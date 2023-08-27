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

    const carico = await prisma.carico.findFirstOrThrow({
        where: {
            id: +params.slug
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

    function cCell(text: string, isBold: boolean = false): Object {
        return isBold ? { text: text, bold: true, alignment: 'center' } : { text: text, bold: false, alignment: 'center' }
    }

    let tblBody: Object[][] = displayNotes ? [[cCell('Alimento', true), cCell('Quantità', true), cCell('Note', true), cCell('Alimento', true), cCell('Quantità', true), cCell('Note', true)]] : [[cCell('Alimento', true), cCell('Quantità', true), cCell('Alimento', true), cCell('Quantità', true)]];

    carico.alimenti.forEach((al, i) => {
        if (carico.alimenti[i + 1]) {
            if (i % 2 === 0) {
                if (displayNotes) {
                    tblBody.push(
                        [
                            { text: carico.alimenti[i].alimento.nome, link: BASE_URL + "/alimenti/" + carico.alimenti[i].alimentoId, alignment: 'center' }, cCell(carico.alimenti[i].quantita.toString() + " " + carico.alimenti[i].alimento.unita), carico.alimenti[i].note ? cCell(carico.alimenti[i].note as string) : cCell(""),
                            { text: carico.alimenti[i + 1].alimento.nome, link: BASE_URL + "/alimenti/" + carico.alimenti[i + 1].alimentoId, alignment: 'center' }, cCell(carico.alimenti[i + 1].quantita.toString() + " " + carico.alimenti[i + 1].alimento.unita), carico.alimenti[i + 1].note ? cCell(carico.alimenti[i + 1].note as string) : cCell("")]
                    )
                } else {
                    tblBody.push(
                        [
                            { text: carico.alimenti[i].alimento.nome, link: BASE_URL + "/alimenti/" + carico.alimenti[i].alimentoId, alignment: 'center' }, cCell(carico.alimenti[i].quantita.toString() + " " + carico.alimenti[i].alimento.unita),
                            { text: carico.alimenti[i + 1].alimento.nome, link: BASE_URL + "/alimenti/" + carico.alimenti[i + 1].alimentoId, alignment: 'center' }, cCell(carico.alimenti[i + 1].quantita.toString() + " " + carico.alimenti[i + 1].alimento.unita)]
                    )
                }
            }
        } else {
            if (i % 2 == 0) {
                if (displayNotes) {
                    tblBody.push(
                        [{ text: carico.alimenti[i].alimento.nome, link: BASE_URL + "/alimenti/" + carico.alimenti[i].alimentoId, alignment: 'center' }, cCell(carico.alimenti[i].quantita.toString() + " " + carico.alimenti[i].alimento.unita), carico.alimenti[i].note ? cCell(carico.alimenti[i].note as string) : cCell(""), cCell("///"), cCell("///"), cCell("///")]
                    )
                } else {
                    tblBody.push(
                        [{ text: carico.alimenti[i].alimento.nome, link: BASE_URL + "/alimenti/" + carico.alimenti[i].alimentoId, alignment: 'center' }, cCell(carico.alimenti[i].quantita.toString() + " " + carico.alimenti[i].alimento.unita), cCell("///"), cCell("///")]
                    )

                }
            }
        }
    })

    const fonts = {
        Arial: {
            normal: 'pdf/static/ARIALN.TTF',
            bold: 'pdf/static/ARIALNB.TTF',
            italics: 'pdf/static/ARIALNI.TTF'
        },
        Courier: {
            normal: 'pdf/static/cour.ttf'
        }
    }
    const pdfPrinter = new PdfPrinter(fonts)

    const qrID = (await QRCode.toString(`${BASE_URL}/carichi/${carico.id}`, {
        type: 'svg', margin: 0, width: 90
    }));

    const scheda = {
        content: [
            { text: "Stampato il " + moment().utcOffset(offset).format("DD/MM/YYYY, HH:mm") + "\n", absolutePosition: { x: 15, y: 91 } },
            { svg: qrID, alignment: 'center', absolutePosition: { x: 420, y: 15 } },
            { text: "CARICO DI GENERI ALIMENTARI\n", fontSize: 14, bold: true, alignment: 'center' },
            {
                text: [{ text: "Carico: " },
                {
                    text: moment(carico.data).utcOffset(offset).format("DD/MM/YYYY, HH:mm:ss") + " ("
                },
                { text: `#${carico.id}`, link: BASE_URL + "/carichi/" + carico.id, font: 'Courier' },
                { text: ")" }
                ], alignment: 'center', margin: [0, 0, 0, 4]
            },
            {
                table: {
                    widths: displayNotes ? ['*', 'auto', 'auto', '*', 'auto', 'auto'] : ['*', 'auto', '*', 'auto'],
                    headerRows: tblBody.length > 1 ? 1 : 0,
                    body: tblBody.length > 1 ? tblBody : [
                        displayNotes ? [{ text: "Non sono presenti alimenti", colSpan: 6, bold: true, alignment: 'center' }, {}, {}, {}, {}, {}] : [{ text: "Non sono presenti alimenti", colSpan: 4, bold: true, alignment: 'center' }, {}, {}, {}]
                    ]
                }
            }, carico.note ? {
                text: [{ text: "Note: ", bold: true }, { text: carico.note }], margin: [0, 2, 0, 0]
            } : null,
        ],
        header: function (currentPage: number, pageCount: number) {
            return {
                layout: 'noBorders',
                table: {
                    widths: ['auto', '*'],
                    body: [
                        [{ svg: fs.readFileSync('pdf/static/intestazione.svg'), width: 240, margin: [0, 0, 2, 0] }, { text: `${currentPage}/${pageCount}`, alignment: 'right' }],
                    ],
                },
                margin: [15, 15, 15, 0]
            }
        },
        defaultStyle: { font: 'Arial' }, pageSize: 'A5', pageOrientation: 'landscape', pageMargins: [15, 90, 15, 15],
        info: {
            title: 'Carico di generi alimentari',
            author: 'Associazione XXX',
            subject: 'Inventario'
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