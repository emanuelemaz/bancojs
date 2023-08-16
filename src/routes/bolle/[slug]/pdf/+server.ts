import prisma from '../../../../../prisma/prisma';

import PdfPrinter from 'pdfmake'
import fs from 'fs'
import { BASE_URL } from '$env/static/private';

import QRCode from 'qrcode';
import moment from 'moment-timezone';

export async function GET({ url, params }) {

    const displayNotes: boolean = url.searchParams.has("note")

    const bolla = await prisma.bolla.findFirstOrThrow({
        where: {
            id: params.slug
        }
    })
    const nucleo = await prisma.nucleo.findUniqueOrThrow({
        where: {
            id: bolla.nucleoId
        }
    })

    let alimenti_fix: bollaalimento_fix[] = [];
    const alimenti = await prisma.bollaAlimento.findMany({
        where: {
            bollaId: bolla.id
        },
        orderBy: {
            alimento: {
                nome: 'asc'
            }
        }
    })

    for (let al of alimenti) {
        let alimento = await prisma.alimento.findUniqueOrThrow({ where: { id: al.alimentoId } })
        alimenti_fix.push({ id: al.id, nome: alimento.nome, unita: alimento.unita, bollaId: al.bollaId, alimentoId: al.alimentoId, note: al.note, quantita: al.quantita });
    }

    function cCell(text: string, isBold: boolean = false): Object {
        return isBold ? { text: text, bold: true, alignment: 'center' } : { text: text, bold: false, alignment: 'center' }
    }

    let tblBody: Object[][] = displayNotes ? [[cCell('Alimento', true), cCell('Quantità', true), cCell('Note', true), cCell('Alimento', true), cCell('Quantità', true), cCell('Note', true)]] : [[cCell('Alimento', true), cCell('Quantità', true), cCell('Alimento', true), cCell('Quantità', true)]];

    alimenti_fix.forEach((al, i) => {
        if (alimenti_fix[i + 1]) {
            if (i % 2 === 0) {
                if (displayNotes) {
                    tblBody.push(
                        [
                            cCell(alimenti_fix[i].nome), cCell(alimenti_fix[i].quantita.toString() + " " + alimenti_fix[i].unita), alimenti_fix[i].note ? cCell(alimenti_fix[i].note as string) : cCell(""),
                            cCell(alimenti_fix[i + 1].nome), cCell(alimenti_fix[i + 1].quantita.toString() + " " + alimenti_fix[i + 1].unita), alimenti_fix[i + 1].note ? cCell(alimenti_fix[i + 1].note as string) : cCell("")]
                    )
                } else {
                    tblBody.push(
                        [
                            cCell(alimenti_fix[i].nome), cCell(alimenti_fix[i].quantita.toString() + " " + alimenti_fix[i].unita),
                            cCell(alimenti_fix[i + 1].nome), cCell(alimenti_fix[i + 1].quantita.toString() + " " + alimenti_fix[i + 1].unita)]
                    )

                }
            }
        } else {
            if (i % 2 == 0) {
                if (displayNotes) {
                    tblBody.push(
                        [cCell(alimenti_fix[i].nome), cCell(alimenti_fix[i].quantita.toString() + " " + alimenti_fix[i].unita), alimenti_fix[i].note ? cCell(alimenti_fix[i].note as string) : cCell(""), cCell("///"), cCell("///"), cCell("///")]
                    )
                } else {
                    tblBody.push(
                        [cCell(alimenti_fix[i].nome), cCell(alimenti_fix[i].quantita.toString() + " " + alimenti_fix[i].unita), cCell("///"), cCell("///")]
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
            { svg: qrID, alignment: 'center', margin: [0, 0, 0, 4], absolutePosition: { x: 420, y: 15 } },
            { text: "BOLLA DI DISTRIBUZIONE ALIMENTARE\n", fontSize: 14, bold: true, alignment: 'center' },
            { text: [{ text: "Nucleo: " }, { text: "#" + nucleo.id, link: BASE_URL + "/nuclei/" + nucleo.id, font: 'Courier' }, { text: ` (${nucleo.nome} ${nucleo.cognome})` }], alignment: 'center', margin: [0, 2, 0, 0] },
            {
                text: [{ text: "Bolla: " }, { text: "#" + bolla.id, link: BASE_URL + "/bolle/" + bolla.id, font: 'Courier' }, {
                    text: " (" + moment(bolla.data).format("DD/MM/YYYY, HH:mm:ss" + ")")
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
        defaultStyle: { font: 'Arial' }, pageSize: 'A5', pageOrientation: 'landscape', pageMargins: [15, 85, 15, 15],
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