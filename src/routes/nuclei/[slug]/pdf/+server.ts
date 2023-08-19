import prisma from '../../../../../prisma/prisma';

import PdfPrinter from 'pdfmake'
import fs from 'fs'
import { BASE_URL } from '$env/static/private';

import moment from 'moment-timezone';
import QRCode from 'qrcode';
import { get } from 'svelte/store';
import tz from '$lib/stores';

export async function GET({ url, params }) {

    const displayBolle: boolean = url.searchParams.has("bolle");
    const offset = get(tz)
    
    const nucleo = await prisma.nucleo.findUniqueOrThrow({
        where: {
            id: params.slug
        }
    })

    const bolle = await prisma.bolla.findMany({
        where: {
            nucleoId: nucleo.id
        }
    })

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

    let bolleDoc = [];

    for (let bolla of bolle) {
        bolleDoc.push([{
            table: {
                widths: ['auto', '*'],
                body: bolla.note ? [
                    ["ID", { text: bolla.id, link: BASE_URL + "/bolle/" + bolla.id, font: 'Courier' }],
                    ["Data", moment(bolla.data).utcOffset(offset).format("DD/MM/YYYY, HH:mm:ss")],
                    ["Note", { text: bolla.note }]
                ] : [
                    ["ID", { text: bolla.id, link: BASE_URL + "/bolle/" + bolla.id, font: 'Courier' }],
                    ["Data", moment(bolla.data).utcOffset(offset).format("DD/MM/YYYY, HH:mm:ss")]
                ]
            }
        }, { text: "\n", fontSize: 4 }])
    }

    const qrID = (await QRCode.toString(`${BASE_URL}/nuclei/${nucleo.id}`, {
        type: 'svg', margin: 0, width: 100
    }));

    const scheda = {
        content: [
            {
                table: {
                    widths: ['*', 'auto'],
                    body: [
                        [{ text: [{ text: "SCHEDA ANAGRAFICA\n", fontSize: 14, bold: true, alignment: 'center' }, {text: "Stampata il " + moment().utcOffset(offset).format("DD/MM/YYYY, HH:mm") + "\n"}, { text: "ID del nucleo: " }, { text: "#" + nucleo.id, link: BASE_URL + "/nuclei/" + nucleo.id, font: 'Courier' }], alignment: 'center', margin: [0, 0, 0, 4] }, { svg: qrID }]
                    ]
                }, layout: "noBorders", margin: [0, 4]
            },
            {
                table: {
                    widths: ['auto', '*'],
                    body: [
                        ["Nome", nucleo.nome],
                        ["Cognome", nucleo.cognome],
                        ["ISEE", (nucleo.isee || nucleo.isee == 0) ? Intl.NumberFormat('it-IT', { currency: 'EUR', style: 'currency' }).format(nucleo.isee) : "///"],
                        ["Componenti", nucleo.componenti.toString()],
                        ["(di cui) bambini", nucleo.bambini.toString()],
                        ["Cellulare", nucleo.cellulare ? nucleo.cellulare : "///"],
                        ["Indirizzo", nucleo.indirizzo ? nucleo.indirizzo : "///"],
                        ["Comune", nucleo.citta ? nucleo.citta : "///"],
                        ["Note", nucleo.note ? nucleo.note.replace(/\r\n/g, '\n') : "///"],
                    ]
                }
            },
            (displayBolle && bolleDoc.length) ? [{ text: 'Bolle emesse', bold: true, margin: [0, 2, 0, 1] }, bolleDoc] : { text: "" }
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
        defaultStyle: { font: 'Arial' }, pageSize: 'A5', pageOrientation: 'portrait', pageMargins: [15, 85, 15, 15],
        info: {
            title: 'Scheda anagrafica',
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