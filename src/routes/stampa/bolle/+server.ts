import PdfPrinter from 'pdfmake';
import type { Nucleo } from '@prisma/client';
import prisma from '../../../../prisma/prisma';
import moment from 'moment-timezone';
import fs from 'fs'

export async function GET({ url }) {
    let bolle_fix: bolla_fix[] = [];
    let bolle = (await prisma.bolla.findMany({
        orderBy: {
            data: 'desc'
        }
    }))
    for (let el of bolle) {
        let nucleo: Nucleo = await prisma.nucleo.findUniqueOrThrow({ where: { id: el.nucleoId } });
        bolle_fix.push({
            id: el.id,
            data: el.data,
            note: el.note,
            nucleoId: el.nucleoId,
            nomeN: nucleo.nome,
            cognomeN: nucleo.cognome,
            componentiN: nucleo.componenti,
            bambiniN: nucleo.bambini,
            createdAt: nucleo.createdAt
        })
    }

    const offset: number = parseInt(url.searchParams.get("offset") as string)

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

    for (let b of bolle_fix) {
        tblBody.push(
            [cCell(`${b.nomeN} ${b.cognomeN}`), cCell(`${b.componentiN} ${bambini(b.bambiniN)}`), moment(b.data).format("DD/MM/YYYY, HH:mm:ss"), b.note ? cCell(b.note) : '']
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
                    { text: "Aggiornata al " + moment().utcOffset(offset).format("DD/MM/YYYY [ore] HH:mm"), alignment: 'center', fontSize: 16 }
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
            title: 'Lista degli alimenti',
            author: 'Associazione XXX',
            subject: 'Inventario'
        },
    }


    const pdfDoc = pdfPrinter.createPdfKitDocument(scheda, {});

    pdfDoc.end();

    return new Response(pdfDoc);
}
