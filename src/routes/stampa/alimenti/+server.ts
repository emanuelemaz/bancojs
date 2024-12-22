import PdfPrinter from 'pdfmake';
import moment from 'moment-timezone';
import fs from 'fs'
import { filterAlimento, pdfTableField } from '$lib';
import { get } from 'svelte/store';
import tz from '$lib/stores';
import { BASE_URL } from '$env/static/private';
import type { Alimento, BollaAlimento, CaricoAlimento } from '@prisma/client';
import prisma from '../../../../prisma/prisma.js';

export async function GET({ url }) {
    let alimenti = await filterAlimento(url)

    const offset = get(tz)

    function cCell(text: string, isBold: boolean = false): Object {
        return isBold ? { text: text, bold: true, alignment: 'center' } : { text: text, bold: false, alignment: 'center' }
    }

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

    const options = [
        pdfTableField(url, "_nome", "Nome", function (al: Alimento) {
            return { text: al.nome, alignment: 'center', link: `${BASE_URL}/alimenti/${al.id}` }
        }, '*'),
        pdfTableField(url, "_unita", "Unità", function (al: Alimento) {
            return cCell(al.unita)
        }, 'auto'),
        pdfTableField(url, "_disponibile", "Magazzino", async function (al: Alimento) {
            let quantitaDisponibile = 0;
            let countable = true;
            const caricoAlimenti = await prisma.caricoAlimento.findMany({
                where: { alimentoId: al.id }
            })
            const bollaAlimenti = await prisma.bollaAlimento.findMany({
                where: { alimentoId: al.id }
            })
            if (!caricoAlimenti.length) {
                return cCell('n.c.') //NON CALCOLABILE: CARICHI MANCANTI
            }
            for (let cA of caricoAlimenti) { quantitaDisponibile += cA.quantita }
            for (let bA of bollaAlimenti) { quantitaDisponibile -= bA.quantita }
            return cCell(`${quantitaDisponibile} ${al.unita}`)
        }, 'auto'),
        pdfTableField(url, "_scadenza", "Scadenza", function (al: Alimento) {
            return scadenza(al.scadenza)
        }, 'auto'),
        pdfTableField(url, "_distribuibile", "Distribuibile", function (al: Alimento) {
            return al.distribuibile ? cCell('sì') : cCell('no', true)
        }, 'auto'),
        pdfTableField(url, "_note", "Note", function (al: Alimento) {
            return al.note ? cCell(al.note) : cCell('///')
        }, function (al: Alimento) { return al.note ? '*' : 'auto' }),
    ]

    if (options.every(x => x.use === false)) {
        options.forEach(x => x.use = true)
    }

    let tblBody: Object[][] = [];
    let headerRow = [];

    for (let opt of options) {
        if (opt.use) {
            headerRow.push(cCell(opt.header, true))
        }
    }
    tblBody.push(headerRow)

    for (let al of alimenti) {
        let dataRow = []
        for (let opt of options) {
            if (opt.use) {
                dataRow.push(await opt.content(al))
            }
        }
        tblBody.push(dataRow)
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
                    { text: "LISTA DEGLI ALIMENTI\n", fontSize: 18, bold: true, alignment: 'center' },
                    { text: "Aggiornata al " + moment().utcOffset(offset).format("DD/MM/YYYY [ore] HH:mm"), alignment: 'center', fontSize: 16 }
                ], margin: [0, 0, 0, 4]
            },
            {
                table: {
                    widths: options.filter(x => x.use).map(x => x.col),
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
                        [{ svg: fs.readFileSync('pdf/static/intestazione.svg'), width: 280 }, { text: `${currentPage}/${pageCount}`, alignment: 'right' }],
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
