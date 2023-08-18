import prisma from '../../../../../prisma/prisma';

import PdfPrinter from 'pdfmake'
import fs from 'fs'
import { BASE_URL } from '$env/static/private';

import QRCode from 'qrcode';
import moment from 'moment-timezone';
import { get } from 'svelte/store';
import tz from '$lib/stores';

export async function GET({ url, params }) {

    const displayNotes: boolean = url.searchParams.has("note")
    const offset = get(tz)

    const bolla = await prisma.bolla.findFirstOrThrow({
        where: {
            id: params.slug
        },
        include: {
            alimenti: {
                include: {
                    alimento: true
                },
                orderBy: {
                    alimento: {
                        nome: 'asc'
                    }
                }
            }
        }
    })

    const nucleo = await prisma.nucleo.findUniqueOrThrow({
        where: {
            id: bolla.nucleoId
        }
    })
    function cCell(text: string, isBold: boolean = false): Object {
        return isBold ? { text: text, bold: true, alignment: 'center' } : { text: text, bold: false, alignment: 'center' }
    }

    let tblBody: Object[][] = displayNotes ? [[cCell('Alimento', true), cCell('Quantità', true), cCell('Note', true), cCell('Alimento', true), cCell('Quantità', true), cCell('Note', true)]] : [[cCell('Alimento', true), cCell('Quantità', true), cCell('Alimento', true), cCell('Quantità', true)]];

    bolla.alimenti.forEach((al, i) => {
        if (bolla.alimenti[i + 1]) {
            if (i % 2 === 0) {
                if (displayNotes) {
                    tblBody.push(
                        [
                            cCell(bolla.alimenti[i].alimento.nome), cCell(bolla.alimenti[i].quantita.toString() + " " + bolla.alimenti[i].alimento.unita), bolla.alimenti[i].note ? cCell(bolla.alimenti[i].note as string) : cCell(""),
                            cCell(bolla.alimenti[i + 1].alimento.nome), cCell(bolla.alimenti[i + 1].quantita.toString() + " " + bolla.alimenti[i + 1].alimento.unita), bolla.alimenti[i + 1].note ? cCell(bolla.alimenti[i + 1].note as string) : cCell("")]
                    )
                } else {
                    tblBody.push(
                        [
                            cCell(bolla.alimenti[i].alimento.nome), cCell(bolla.alimenti[i].quantita.toString() + " " + bolla.alimenti[i].alimento.unita),
                            cCell(bolla.alimenti[i + 1].alimento.nome), cCell(bolla.alimenti[i + 1].quantita.toString() + " " + bolla.alimenti[i + 1].alimento.unita)]
                    )
                }
            }
        } else {
            if (i % 2 == 0) {
                if (displayNotes) {
                    tblBody.push(
                        [cCell(bolla.alimenti[i].alimento.nome), cCell(bolla.alimenti[i].quantita.toString() + " " + bolla.alimenti[i].alimento.unita), bolla.alimenti[i].note ? cCell(bolla.alimenti[i].note as string) : cCell(""), cCell("///"), cCell("///"), cCell("///")]
                    )
                } else {
                    tblBody.push(
                        [cCell(bolla.alimenti[i].alimento.nome), cCell(bolla.alimenti[i].quantita.toString() + " " + bolla.alimenti[i].alimento.unita), cCell("///"), cCell("///")]
                    )

                }
            }
        }
    })

    const fonts = {
        Arial: {
            normal: 'pdf_static/ARIALN.TTF',
            bold: 'pdf_static/ARIALNB.TTF',
            italics: 'pdf_static/ARIALNI.TTF'
        },
        Courier: {
            normal: 'pdf_static/cour.ttf'
        }
    }
    const pdfPrinter = new PdfPrinter(fonts)

    const qrID = (await QRCode.toString(`${BASE_URL}/bolle/${bolla.id}`, {
        type: 'svg', margin: 0, width: 90
    }));

    const scheda = {
        content: [
            { text: "Stampato il " + moment().utcOffset(offset).format("DD/MM/YYYY, HH:mm") + "\n", absolutePosition: { x: 15, y: 91 } },
            { svg: qrID, alignment: 'center', absolutePosition: { x: 420, y: 15 } },
            { text: "BOLLA DI DISTRIBUZIONE ALIMENTARE\n", fontSize: 14, bold: true, alignment: 'center' },
            { text: [{ text: "Nucleo: " }, { text: "#" + nucleo.id, link: BASE_URL + "/nuclei/" + nucleo.id, font: 'Courier' }, { text: ` (${nucleo.nome} ${nucleo.cognome})` }], alignment: 'center', margin: [0, 2, 0, 0] },
            {
                text: [{ text: "Bolla: " }, { text: "#" + bolla.id, link: BASE_URL + "/bolle/" + bolla.id, font: 'Courier' }, {
                    text: " (" + moment(bolla.data).utcOffset(offset, true).format("DD/MM/YYYY, HH:mm:ss") + ")"
                }], alignment: 'center', margin: [0, 0, 0, 4]
            },
            {
                table: {
                    widths: displayNotes ? ['*', 'auto', 'auto', '*', 'auto', 'auto'] : ['*', 'auto', '*', 'auto'],
                    headerRows: tblBody.length > 1 ? 1 : 0,
                    body: tblBody.length > 1 ? tblBody : [
                        displayNotes ? [{ text: "Non sono presenti alimenti", colSpan: 6, bold: true, alignment: 'center' }, {}, {}, {}, {}, {}] : [{ text: "Non sono presenti alimenti", colSpan: 4, bold: true, alignment: 'center' }, {}, {}, {}]
                    ]
                }
            }, bolla.note ? {
                text: [{ text: "Note: ", bold: true }, { text: bolla.note }], margin: [0, 2, 0, 0]
            } : null,
        ],
        header: function (currentPage: number, pageCount: number) {
            return {
                layout: 'noBorders',
                table: {
                    widths: ['auto', '*'],
                    body: [
                        [{ svg: fs.readFileSync('pdf_static/intestazione.svg'), width: 240, margin: [0, 0, 2, 0] }, { text: `${currentPage}/${pageCount}`, alignment: 'right' }],
                    ],
                },
                margin: [15, 15, 15, 0]
            }
        },
        defaultStyle: { font: 'Arial' }, pageSize: 'A5', pageOrientation: 'landscape', pageMargins: [15, 90, 15, 15],
        info: {
            title: 'Bolla di distribuzione alimentare',
            author: 'Associazione XXX',
            subject: nucleo.nome + ' ' + nucleo.cognome
        },
    }


    const pdfDoc = pdfPrinter.createPdfKitDocument(scheda, {});

    pdfDoc.end();

    return new Response(pdfDoc, {
        headers: {
            'Content-Type': 'application/pdf',
        }
    })

}