import PdfPrinter from 'pdfmake';
import prisma from '../../../../prisma/prisma';
import moment from 'moment-timezone';
import fs from 'fs'
import { filterBolla } from '$lib';
import { get } from 'svelte/store';
import tz from '$lib/stores';

export async function GET({ url }) {
    let bolle = await filterBolla(url)

    const offset = get(tz)

    function cCell(text: string, isBold: boolean = false): Object {
        return isBold ? { text: text, bold: true, alignment: 'center' } : { text: text, bold: false, alignment: 'center' }
    }

    let tblBody: Object[][] = [[cCell('Beneficiario', true), cCell('Componenti', true), cCell('Data', true), cCell('Note', true)]];

    function bambini(x: number) {
        if (x == 0) {
            return '';
        }
        if (x == 1) {
            return `(${x} bambino)`;
        }
        return `(${x} bambini)`;
    }

    for (let b of bolle) {
        tblBody.push(
            [cCell(`${b.nucleo.nome} ${b.nucleo.cognome}`), cCell(`${b.nucleo.componenti} ${bambini(b.nucleo.bambini)}`), moment(b.data).format("DD/MM/YYYY, HH:mm:ss"), b.note ? cCell(b.note) : '']
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
                    { text: "LISTA DELLE BOLLE\n", fontSize: 18, bold: true, alignment: 'center' },
                    { text: "Aggiornata al " + moment().utcOffset(offset, true).format("DD/MM/YYYY [ore] HH:mm"), alignment: 'center', fontSize: 16 }
                ], margin: [0, 0, 0, 4]
            },
            {
                table: {
                    widths: ['*', 'auto', 'auto', '*'],
                    headerRows: tblBody.length > 1 ? 1 : 0,
                    body: tblBody.length > 1 ? tblBody : [
                        [{ text: 'Non sono presenti bolle', colSpan: 4, alignment: 'center', bold: true }, {}, {}, {}],
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
            title: 'Lista delle bolle',
            author: 'Associazione XXX',
            subject: 'Bolle di distribuzione'
        },
    }


    const pdfDoc = pdfPrinter.createPdfKitDocument(scheda, {});

    pdfDoc.end();

    return new Response(pdfDoc);
}
