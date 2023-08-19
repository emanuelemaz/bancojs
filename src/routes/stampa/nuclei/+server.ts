import PdfPrinter from 'pdfmake';
import prisma from '../../../../prisma/prisma';
import moment from 'moment-timezone';
import fs from 'fs'
import { filterNucleo } from '$lib';
import { get } from 'svelte/store';
import tz from '$lib/stores';

export async function GET({ url }) {
    let nuclei = await filterNucleo(url);

    const offset = get(tz)

    function cCell(text: string, isBold: boolean = false): Object {
        return isBold ? { text: text, bold: true, alignment: 'center' } : { text: text, bold: false, alignment: 'center' }
    }

    function bambini(x: number) {
        if (x == 0) {
            return '';
        }
        return `(${x}b.)`;
    }

    let tblBody: Object[][] = [[cCell('Nome', true), cCell('Cognome', true), cCell('ISEE', true), cCell('Pers. (b.)', true), cCell('Cellulare', true), cCell('Indirizzo', true), cCell('Comune', true), cCell('Note', true)]];

    for (let n of nuclei) {
        tblBody.push(
            [
                {text: (n.nome), link: `/nuclei/${n.id}`, alignment: 'center'},
                {text: (n.cognome), link: `/nuclei/${n.id}`, alignment: 'center'},
                n.isee || n.isee == 0 ? cCell(Intl.NumberFormat('it-IT', { currency: 'EUR', style: 'currency' }).format(n.isee)) : cCell("///"),
                cCell(`${n.componenti} ${bambini(n.bambini)}`),
                n.cellulare ? cCell(n.cellulare) : cCell("///"),
                n.indirizzo ? cCell(n.indirizzo) : cCell("///"),
                n.citta ? cCell(n.citta) : cCell("///"),
                n.note ? cCell(n.note) : cCell("///")]
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
                    { text: "LISTA DEI NUCLEI\n", fontSize: 18, bold: true, alignment: 'center' },
                    { text: "Aggiornata al " + moment().utcOffset(offset).format("DD/MM/YYYY [ore] HH:mm"), alignment: 'center', fontSize: 16 }
                ], margin: [0, 0, 0, 4]
            },
            {
                table: {
                    widths: ['*', '*', 'auto', 'auto', 'auto', 'auto', 'auto', '*'],
                    headerRows: tblBody.length > 1 ? 1 : 0,
                    body: tblBody.length > 1 ? tblBody : [
                        [{ text: 'Non sono presenti nuclei', colSpan: 8, alignment: 'center', bold: true }, {}, {}, {}, {}, {}, {}, {}],
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
        defaultStyle: { font: 'Arial' }, pageSize: 'A4', pageOrientation: 'landscape', pageMargins: [30, 120, 30, 30],
        info: {
            title: 'Lista dei nuclei',
            author: 'Associazione XXX',
            subject: 'Beneficiari'
        },
    }


    const pdfDoc = pdfPrinter.createPdfKitDocument(scheda, {});

    pdfDoc.end();

    return new Response(pdfDoc);
}
