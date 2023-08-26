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
        }
    })

    const carichi = await prisma.caricoAlimento.findMany({
        where: {
            alimentoId: alimento.id
        },
        include: {
            carico: {
                select: {
                    data: true,
                    note: true
                }
            }
        }
    })

    const bolle = await prisma.bollaAlimento.findMany({
        where: {
            alimentoId: alimento.id
        },
        include: {
            bolla: {
                select: {
                    data: true,
                    note: true
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

    let carichiDoc = [];

    for (let carico of carichi) {
        carichiDoc.push([{
            table: {
                widths: ['auto', '*'],
                body: carico.note ? [
                    ["ID", { text: carico.id, link: BASE_URL + "/carichi/" + carico.id, font: 'Courier' }],
                    ["Quantità", `${carico.quantita} ${alimento.unita}`], ,
                    ["Data", moment(carico.carico.data).utcOffset(offset).format("DD/MM/YYYY, HH:mm:ss")],
                    ["Note", { text: carico.note }]
                ] : [
                    ["ID", { text: carico.id, link: BASE_URL + "/carichi/" + carico.id, font: 'Courier' }],
                    ["Quantità", `${carico.quantita} ${alimento.unita}`],
                    ["Data", moment(carico.carico.data).utcOffset(offset).format("DD/MM/YYYY, HH:mm:ss")]
                ]
            }
        }, { text: "\n", fontSize: 4 }])
    }

    let bolleDoc = [];

    for (let bolla of bolle) {
        bolleDoc.push([{
            table: {
                widths: ['auto', '*'],
                body: bolla.note ? [
                    ["ID", { text: bolla.id, link: BASE_URL + "/bolle/" + bolla.id, font: 'Courier' }],
                    ["Quantità", `${bolla.quantita} ${alimento.unita}`],
                    ["Data", moment(bolla.bolla.data).utcOffset(offset).format("DD/MM/YYYY, HH:mm:ss")],
                    ["Note", bolla.note]
                ] : [
                    ["ID", { text: bolla.id, link: BASE_URL + "/bolle/" + bolla.id, font: 'Courier' }],
                    ["Quantità", `${bolla.quantita} ${alimento.unita}`],
                    ["Data", moment(bolla.bolla.data).utcOffset(offset).format("DD/MM/YYYY, HH:mm:ss")]
                ]
            }
        }, { text: "\n", fontSize: 4 }])
    }

    let quantitaDisponibile = 0;
    for (let c of carichi) {
        quantitaDisponibile += c.quantita
    }
    for (let b of bolle) {
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
                }, layout: "noBorders", margin: [0, 4]
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
            (carichiDoc.length) ? [{ text: 'Carichi registrati', bold: true, margin: [0, 0, 0, 1] }, carichiDoc] : { text: "" },
            (bolleDoc.length) ? [{ text: 'Bolle emesse', bold: true, margin: [0, 2, 0, 1] }, bolleDoc] : { text: "" }
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