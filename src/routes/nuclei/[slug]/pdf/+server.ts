import prisma from '../../../../../prisma/prisma';

import PdfPrinter from 'pdfmake'
import fs from 'fs'
import stream from 'stream'

export async function GET({ request, params }) {

    const nucleo = await prisma.nucleo.findUniqueOrThrow({
        where: {
            id: params.slug
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
            {
                svg: fs.readFileSync('pdf_static/intestazione.svg'), width: 349.50
            },
            { text: "SCHEDA ANAGRAFICA\n", fontSize: 14, bold: true, alignment: 'center', margin: [0, 0, 0, 4] },
            { text: [{ text: "ID del nucleo: " }, { text: "#" + nucleo.id.toString(), font: 'Courier' }], alignment: 'center', margin: [0, 0, 0, 8] },
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
            }
        ], defaultStyle: { font: 'Arial' }, pageSize: 'A5', pageOrientation: 'portrait', pageMargins: 35,
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