import PdfPrinter from 'pdfmake';
import moment from 'moment-timezone';
import fs from 'fs'
import { filterBolla, filterCarichi } from '$lib';
import { get } from 'svelte/store';
import tz from '$lib/stores';
import { BASE_URL } from '$env/static/private';

export async function GET({ url }) {
    let carichi = await filterCarichi(url)

    const offset = get(tz)

    function cCell(text: string, isBold: boolean = false): Object {
        return isBold ? { text: text, bold: true, alignment: 'center' } : { text: text, bold: false, alignment: 'center' }
    }

    let tblBody: Object[][] = [[cCell('Data', true),cCell('Alimenti', true), cCell('Note', true)]];

    for (let c of carichi) {
        tblBody.push(
            [{ text: moment(c.data).utcOffset(offset).format("DD/MM/YYYY, HH:mm:ss"), alignment: 'center', link: `${BASE_URL}/carichi/${c.id}` }, cCell(c._count.alimenti.toString()), c.note ? c.note : '']
        )
    }

    const fonts = {
        Arial: {
            normal: 'pdf/static/ARIALN.TTF',
            bold: 'pdf/static/ARIALNB.TTF',
        },
        Courier: {
            normal: 'pdf/static/cour.ttf'
        }
    }
    const pdfPrinter = new PdfPrinter(fonts)

    const scheda = {
        content: [
            {
                text: [
                    { text: "LISTA DEI CARICHI\n", fontSize: 18, bold: true, alignment: 'center' },
                    { text: "Aggiornata al " + moment().utcOffset(offset).format("DD/MM/YYYY [ore] HH:mm"), alignment: 'center', fontSize: 16 }
                ], margin: [0, 0, 0, 4]
            },
            {
                table: {
                    widths: ['auto','auto', '*'],
                    headerRows: tblBody.length > 1 ? 1 : 0,
                    body: tblBody.length > 1 ? tblBody : [
                        [{ text: 'Non sono presenti carichi', colSpan: 3, alignment: 'center', bold: true }, {}, {}],
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
                        [{ svg: fs.readFileSync('pdf/static/intestazione.svg'), width: 280 }, { text: `${currentPage}/${pageCount}`, alignment: 'right' }],
                    ],
                },
                margin: [30, 30, 30, 0]
            }
        },
        defaultStyle: { font: 'Arial' }, pageSize: 'A4', pageOrientation: 'portrait', pageMargins: [30, 120, 30, 30],
        info: {
            title: 'Lista dei carichi',
            author: 'Associazione XXX',
            subject: 'Inventario'
        },
    }


    const pdfDoc = pdfPrinter.createPdfKitDocument(scheda, {});

    pdfDoc.end();

    return new Response(pdfDoc);
}
