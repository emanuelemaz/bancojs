import PdfPrinter from 'pdfmake';
import prisma from '../../../../../prisma/prisma';
import moment from 'moment-timezone';
import fs from 'fs'

export async function GET({ }) {
    const alimenti = await prisma.alimento.findMany();

    function cCell(text: string, isBold: boolean = false): Object {
        return isBold ? { text: text, bold: true, alignment: 'center' } : { text: text, bold: false, alignment: 'center' }
    }

    let tblBody: Object[][] = [[cCell('Alimento', true), cCell('Unità', true), cCell('Distribuibile', true), cCell('Scadenza', true), cCell('Note')]];

    for (let al of alimenti) {
        tblBody.push(
            [cCell(al.nome), cCell(al.unita), al.distribuibile ? '' : cCell('non distribuibile', true), al.scadenza ? moment(al.scadenza).format("DD/MM/YYYY") : "(non specificata)", al.note ? cCell(al.note) : '']
        )
    }

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
            { text: "LISTA DEGLI ALIMENTI\n", fontSize: 18, bold: true, alignment: 'center', margin: [0, 0, 0, 4] },
            {
                text: "Aggiornata al " + moment().tz('Europe/Rome').format("DD/MM/YYYY [ore] HH:mm"), alignment: 'center', fontSize: 16, margin: [0, 0, 0, 8]
            },
            {
                table: {
                    widths: ['*', 'auto', 'auto', 'auto', '*'],
                    headerRows: 1,
                    body: tblBody.length ? tblBody : [
                        [{ text: 'Non sono presenti alimenti', colSpan: 5, alignment: 'center', bold: true }, {}],
                    ]
                }
            }
        ],
        header: function (currentPage: number, pageCount: number) {
            return {
                layout: 'noBorders',
                table: {
                    widths: ['auto', '*'],
                    body: [
                        [{ svg: fs.readFileSync('pdf_static/intestazione.svg'), width: 280 }, { text: `${currentPage}/${pageCount}`, alignment: 'right' }],
                    ],
                },
                margin: [30, 30, 30, 0]
            }
        },
        defaultStyle: { font: 'Arial' }, pageSize: 'A4', pageOrientation: 'portrait', pageMargins: [30, 120, 30, 30],
        info: {
            title: 'Bolla di distribuzione alimentare',
            author: 'Associazione XXX',
            subject: 'Inventario'
        },
    }


    const pdfDoc = pdfPrinter.createPdfKitDocument(scheda, {});

    pdfDoc.end();

    return new Response(pdfDoc);
}