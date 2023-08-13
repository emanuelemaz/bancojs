import prisma from '../../../../../prisma/prisma';

import PdfPrinter from 'pdfmake'
import fs from 'fs'
import { BASE_URL } from '$env/static/private';

export async function GET({ params }) {

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

    let response_fix: bolla_fix = {
        id: bolla.id,
        data: bolla.data,
        note: bolla.note,
        nucleoId: bolla.nucleoId,
        nomeN: nucleo.nome,
        cognomeN: nucleo.cognome,
        componentiN: nucleo.componenti,
        bambiniN: nucleo.bambini
    };

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

    let tblBody: Object[][] = [[cCell('Alimento', true), cCell('Quantità', true), cCell('Alimento', true), cCell('Quantità', true)]];

    alimenti_fix.forEach((al, i) => {
        if (alimenti_fix[i + 1]) {
            if (i % 2 === 0) {
                tblBody.push(
                    [cCell(alimenti_fix[i].nome), cCell(alimenti_fix[i].quantita.toString() + " " + alimenti_fix[i].unita),
                    cCell(alimenti_fix[i + 1].nome), cCell(alimenti_fix[i + 1].quantita.toString() + " " + alimenti_fix[i + 1].unita),
                    ]
                )
            }
        } else {
            if (i % 2 == 0) {
                tblBody.push(
                    [cCell(alimenti_fix[i].nome), cCell(alimenti_fix[i].quantita.toString() + " " + alimenti_fix[i].unita), "", ""]
                )
            }
        }
    })

    const fonts = {
        Arial: {
            normal: 'pdf_static/ARIALN.TTF',
            bold: 'pdf_static/ARIALNB.TTF',
        },
        Courier: {
            normal: 'pdf_static/cour.ttf'
        }
    }
    const pdfPrinter = new PdfPrinter(fonts)

    const scheda = {
        content: [
            { text: "BOLLA DI DISTRIBUZIONE ALIMENTARE\n", fontSize: 14, bold: true, alignment: 'center', margin: [0, 0, 0, 4] },
            { text: [{ text: "Nucleo: " }, { text: "#" + nucleo.id, link: BASE_URL+"/nuclei/"+nucleo.id, font: 'Courier' }, { text: ` (${nucleo.nome} ${nucleo.cognome})` }], alignment: 'center', margin: [0, 0, 0, 0] },
            {
                text: [{ text: "Bolla: " }, { text: "#" + bolla.id, link: BASE_URL+"/bolle/"+bolla.id, font: 'Courier' }, {
                    text: " (" + bolla.data.toLocaleDateString('it-IT', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    }) + ")"
                }], alignment: 'center', margin: [0, 0, 0, 8]
            },
            {
                table: {
                    widths: ['*', 'auto', '*', 'auto'],
                    headerRows: 1,
                    body: tblBody.length ? tblBody : [
                        [{ text: 'Non sono presenti alimenti', colSpan: 4, alignment: 'center', bold: true }, {}],
                    ]
                }
            }, bolla.note ? {
                text: [{ text: "Note: ", bold: true }, { text: bolla.note }], margin: [0, 2, 0, 0]
            } : null
        ],
        header: function (currentPage: number, pageCount: number) {
            return {
                layout: 'noBorders',
                table: {
                    widths: ['auto', '*'],
                    body: [
                        [{svg: fs.readFileSync('pdf_static/intestazione.svg'), width: 340, margin: [0,0,2,0]}, {text: `${currentPage}/${pageCount}`, alignment: 'right'}],
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