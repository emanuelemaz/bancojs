import PdfPrinter from 'pdfmake';
import prisma from '../../../../../prisma/prisma';
import moment from 'moment-timezone';
import fs from 'fs'

export async function GET({ url }) {
    const alimenti = await prisma.alimento.findMany();

    const offset: number = moment.tz(moment(), moment.tz.guess(true)).utcOffset()

    function cCell(text: string, isBold: boolean = false): Object {
        return isBold ? { text: text, bold: true, alignment: 'center' } : { text: text, bold: false, alignment: 'center' }
    }

    let tblBody: Object[][] = [[cCell('Alimento', true), cCell('Unità', true), cCell('Distribuibile', true), cCell('Scadenza', true), cCell('Note', true)]];

    function scadenza(data: Date | null) {
        let response: Object[] = [];
        if (data) {
            response.push({ text: moment(data).format("DD/MM/YYYY") });
            if (moment().isAfter(data, 'day')) {
                response.push({ text: ' (scaduto)', bold: true });
            }
            if (moment().isSame(data, 'day')) {
                response.push({ text: ' (scade oggi)', bold: true });
            }
        } else {
            return "";
        }
        return { text: response };
    }


    for (let al of alimenti) {
        tblBody.push(
            [cCell(al.nome), cCell(al.unita), al.distribuibile ? cCell('sì') : cCell('no', true), scadenza(al.scadenza), al.note ? cCell(al.note) : '']
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
            {
                text: [
                    { text: "LISTA DEGLI ALIMENTI\n", fontSize: 18, bold: true, alignment: 'center' },
                    { text: "Aggiornata al " + moment().utcOffset(offset).format("DD/MM/YYYY [ore] HH:mm"), alignment: 'center', fontSize: 16 }
                ], margin: [0, 0, 0, 4]
            },
            {
                table: {
                    widths: ['*', 'auto', 'auto', 'auto', '*'],
                    headerRows: tblBody.length > 1 ? 1 : 0,
                    body: tblBody.length > 1 ? tblBody : [
                        [{ text: 'Non sono presenti alimenti', colSpan: 5, alignment: 'center', bold: true }, {}, {}, {}, {}],
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
            title: 'Lista degli alimenti',
            author: 'Associazione XXX',
            subject: 'Inventario'
        },
    }


    const pdfDoc = pdfPrinter.createPdfKitDocument(scheda, {});

    pdfDoc.end();

    return new Response(pdfDoc);
}
