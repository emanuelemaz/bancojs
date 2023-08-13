import prisma from '../../../../../prisma/prisma';

import PdfPrinter from 'pdfmake'
import fs from 'fs'
import { BASE_URL } from '$env/static/private';

export async function GET({ url, params }) {

    const displayBolle: boolean = (url.searchParams.get("bolle") as string) === "true" ? true : false;

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
            normal: 'pdf_static/ARIALN.TTF',
            bold: 'pdf_static/ARIALNB.TTF',
        },
        Courier: {
            normal: 'pdf_static/cour.ttf'
        }
    }
    const pdfPrinter = new PdfPrinter(fonts)

    let bolleDoc = [];

    for (let bolla of bolle) {
        bolleDoc.push([{
            table: {
                widths: ['auto', '*'],
                body: bolla.note ? [
                    ["ID", { text: bolla.id, link: BASE_URL+"/bolle/"+bolla.id, font: 'Courier' }],
                    ["Data", bolla.data.toLocaleDateString('it-IT', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    })],
                    ["Note", { text: bolla.note }]
                ] : [
                    ["ID", { text: bolla.id, link: BASE_URL+"/bolle/"+bolla.id, font: 'Courier' }],
                    ["Data", bolla.data.toLocaleDateString('it-IT', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    })]
                ]
            }
        }, { text: "\n", fontSize: 4 }])
    }

    const scheda = {
        content: [
            { text: "SCHEDA ANAGRAFICA\n", fontSize: 14, bold: true, alignment: 'center', margin: [0, 0, 0, 4] },
            { text: [{ text: "ID del nucleo: " }, { text: "#" + nucleo.id, link: BASE_URL+"/nuclei/"+nucleo.id, font: 'Courier' }], alignment: 'center', margin: [0, 0, 0, 8] },
            {
                table: {
                    widths: ['auto', '*'],
                    body: [
                        ["Nome", nucleo.nome],
                        ["Cognome", nucleo.cognome],
                        ["ISEE", (nucleo.isee || nucleo.isee == 0) ? Intl.NumberFormat('it-IT', { currency: 'EUR', style: 'currency' }).format(nucleo.isee) : "(non specificato)"],
                        ["Componenti", nucleo.componenti.toString()],
                        ["(di cui) bambini", nucleo.bambini.toString()],
                        ["Indirizzo", nucleo.indirizzo ? nucleo.indirizzo : "(non specificato)"],
                        ["Comune", nucleo.citta ? nucleo.citta : "(non specificato)"],
                        ["Cellulare", nucleo.cellulare ? nucleo.cellulare : "(non specificato)"],
                        ["Note", nucleo.note ? nucleo.note.replace(/\r\n/g, '\n') : "(non presenti)"],
                    ]
                }
            },
            (displayBolle && bolleDoc) ? [{ text: 'Bolle emesse', bold: true, margin: [0, 2, 0, 1] }, bolleDoc] : { text: "" }
        ],
        header: function (currentPage: number, pageCount: number) {
            return {
                layout: 'noBorders',
                table: {
                    widths: ['auto', '*'],
                    body: [
                        [{ svg: fs.readFileSync('pdf_static/intestazione.svg'), width: 340, margin: [0, 0, 2, 0] }, { text: `${currentPage}/${pageCount}`, alignment: 'right' }],
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