import prisma from '../../../../../prisma/prisma';

import PdfPrinter from 'pdfmake'
import fs from 'fs'
import { BASE_URL } from '$env/static/private';

import moment from 'moment-timezone';
import QRCode from 'qrcode';
import { get } from 'svelte/store';
import tz from '$lib/stores';

export async function GET({ url, params }) {

    const offset = get(tz)

    const alimento = await prisma.alimento.findUniqueOrThrow({
        where: {
            id: params.slug
        }, include: {
            carichi: {
                include: {
                    carico: true
                }
            },
            bolle: {
                include: {
                    bolla: true
                }
            }
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

    let tblBody: Object[][] = [];
    if (url.searchParams.has("_carichi") && alimento.carichi.length) {
        let carichiDoc = [];

        for (let carico of alimento.carichi) {
            let note = [];
            if (carico.note && url.searchParams.has("_noteAlimento")) {
                note.push(["Note (alimento)", carico.note],)
            }
            if (carico.carico.note && url.searchParams.has("_carichiNote")) {
                note.push(["Note (carico)", carico.carico.note])
            }
            carichiDoc.push([{
                table: {
                    widths: ['auto', '*'],
                    body: [
                        ["ID", { text: carico.id, link: BASE_URL + "/carichi/" + carico.id, font: 'Courier' }],
                        ["Quantità", `${carico.quantita} ${alimento.unita}`],
                        ["Data", moment(carico.carico.data).utcOffset(offset).format("DD/MM/YYYY, HH:mm:ss")],
                        ...note
                    ],
                }
            }, { text: "\n", fontSize: 4 }])
        }

        tblBody.push([{ text: 'Carichi registrati', bold: true, margin: [0, 0, 0, 1] }, carichiDoc])
    }
    if (url.searchParams.has("_bolle")  && alimento.bolle.length) {
        let bolleDoc = [];

        for (let bolla of alimento.bolle) {
            let note: Object[][] = [];
            if (bolla.note && url.searchParams.has("_noteAlimento")) {
                note.push(["Note (alimento)", bolla.note])
            }
            if (bolla.bolla.note && url.searchParams.has("_bolleNote")) {
                note.push(["Note (bolla)", bolla.bolla.note])
            }
            bolleDoc.push([{
                table: {
                    widths: ['auto', '*'],
                    body: [
                        ["ID", { text: bolla.id, link: BASE_URL + "/bolle/" + bolla.id, font: 'Courier' }],
                        ["Quantità", `${bolla.quantita} ${alimento.unita}`],
                        ["Data", moment(bolla.bolla.data).utcOffset(offset).format("DD/MM/YYYY, HH:mm:ss")],
                        ...note
                    ]
                }
            }, { text: "\n", fontSize: 4 }])
        }
        tblBody.push([{ text: 'Bolle emesse', bold: true, margin: [0, 2, 0, 1] }, bolleDoc])
    }

    let quantitaDisponibile = 0;
    for (let c of alimento.carichi) {
        quantitaDisponibile += c.quantita
    }
    for (let b of alimento.bolle) {
        quantitaDisponibile -= b.quantita
    }

    const qrID = (await QRCode.toString(`${BASE_URL}/alimenti/${alimento.id}`, {
        type: 'svg', margin: 0, width: 100
    }));

    const scheda = {
        content: [
            {
                table: {
                    widths: ['*', 'auto'],
                    body: [
                        [{ text: [{ text: "SCHEDA DELL'ALIMENTO\n", fontSize: 14, bold: true, alignment: 'center' }, { text: "Stampata il " + moment().utcOffset(offset).format("DD/MM/YYYY, HH:mm") + "\n" }], alignment: 'center', margin: [0, 0, 0, 4] }, { svg: qrID }]
                    ]
                }, layout: "noBorders", margin: [0, 0, 0, 4]
            },
            {
                table: {
                    widths: ['auto', '*'],
                    body: [
                        ["Nome", alimento.nome],
                        ["Unità", alimento.unita],
                        ["Prima scadenza", alimento.scadenza ? moment(alimento.scadenza).utcOffset(offset).format("DD/MM/YYYY, HH:mm:ss") : "///"],
                        ["Servibile", alimento.distribuibile ? 'sì' : 'no'],
                        ["Note", alimento.note],
                    ]
                }
            },
            { text: ['In magazzino: ', { text: `${quantitaDisponibile} ${alimento.unita}`, bold: true }], alignment: 'center', margin: [0, 4, 0, 0] },
            tblBody.length ? tblBody : ""
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
        defaultStyle: { font: 'Arial' }, pageSize: 'A5', pageOrientation: 'portrait', pageMargins: [15, 90, 15, 15],
        info: {
            title: 'Scheda dell\'alimento',
            author: 'Associazione XXX',
            subject: alimento.nome
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