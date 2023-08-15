import { redirect } from '@sveltejs/kit';
import prisma from '../../../../prisma/prisma';
import type { Actions, PageServerLoad } from './$types';
import type { Nucleo } from '@prisma/client';

import moment from 'moment-timezone'

import QRCode from 'qrcode';

export const load = (async ({ params }) => {
    const timezone = moment.tz.guess();
    const bolla = await prisma.bolla.findUniqueOrThrow({ where: { id: params.slug } })
    let nucleo: Nucleo = await prisma.nucleo.findUniqueOrThrow({ where: { id: bolla.nucleoId } });

    let response_fix: bolla_fix = {
        id: bolla.id,
        data: bolla.data,
        note: bolla.note,
        nucleoId: bolla.nucleoId,
        nomeN: nucleo.nome,
        cognomeN: nucleo.cognome,
        componentiN: nucleo.componenti,
        bambiniN: nucleo.bambini
    };


    const nuclei = await prisma.nucleo.findMany({
        orderBy: {
            nome: 'asc'
        }
    });

    let nuclei_fix: nucleo_fix[] = [];
    nuclei.forEach(el => {
        let el_fix: nucleo_fix = {
            id: el.id,
            nome: el.nome,
            cognome: el.cognome,
            isee: el.isee || null,
            componenti: el.componenti,
            bambini: el.bambini,
            cellulare: el.cellulare,
            indirizzo: el.indirizzo,
            citta: el.citta,
            servibile: el.servibile,
            note: el.note
        };
        nuclei_fix.push(el_fix)
    });

    let alimenti_fix: bollaalimento_fix[] = [];
    const alimenti = await prisma.bollaAlimento.findMany({
        where: {
            bollaId: bolla.id
        }, orderBy: {
            alimento: {
                nome: 'asc'
            }
        }
    })
    for (let al of alimenti) {
        let alimento = await prisma.alimento.findUniqueOrThrow({ where: { id: al.alimentoId } })
        alimenti_fix.push({ id: al.id, nome: alimento.nome, unita: alimento.unita, bollaId: al.bollaId, alimentoId: al.alimentoId, note: al.note, quantita: al.quantita });
    }
    let allAlimenti_fix: alimento_fix[] = [];
    const allAlimenti = await prisma.alimento.findMany({ orderBy: { nome: 'asc' } })
    for (let al of allAlimenti) {
        allAlimenti_fix.push({ id: al.id, nome: al.nome, unita: al.unita, scadenza: al.scadenza, distribuibile: al.distribuibile, note: al.note });
    }

    const qrID = (await QRCode.toString(`bolle/${bolla.id}`, {type: 'svg', color: {
        dark: '#FFFF',
        light: '#0000'
      }, margin: 0}))


    return { bolla: response_fix, nuclei: nuclei_fix, alimenti: alimenti_fix, allAlimenti: allAlimenti_fix, qrID: qrID };
}) satisfies PageServerLoad;

export const actions: Actions = {
    modifica: async ({ request }) => {
        const newData = await request.formData()

        let id = newData.get("id") as string;
        const data = moment(newData.get("data") as string).toDate();
        const note = newData.get("note") as string | null;
        const nucleoId = newData.get("nucleoId") as string;

        try {
            await prisma.bolla.update({
                where: {
                    id: id
                },
                data: {
                    data: data,
                    note: note,
                    nucleoId: nucleoId
                }
            });
        } catch (error) {
            console.error(error);
            console.error("Non è stato possibile aggiornare la bolla.")
        } throw redirect(302, "/bolle");
    },
    elimina: async ({ params }) => {
        try {
            await prisma.bolla.delete({
                where: {
                    id: params.slug
                }
            })
        } catch (error) {
            console.error(error);
            console.error("Non è stato possibile eliminare il nucleo.")
        } throw redirect(302, "/bolle");
    },
    aggiungiAlimento: async ({ request, params }) => {
        const newData = await request.formData()

        const alimentoId = newData.get("alimentoId") as string
        const quantita = parseFloat(newData.get("quantita") as string)
        const note = newData.get("note") as string

        try {
            await prisma.bollaAlimento.create({
                data: {
                    bollaId: params.slug,
                    alimentoId: alimentoId,
                    quantita: quantita,
                    note: note
                }
            })
        } catch (error) {
            console.error(error);
            console.error("Non è stato possibile aggiungere l'alimento.")
        } throw redirect(302, `/bolle/${params.slug}`);
    },
    eliminaAlimento: async ({ request, params }) => {
        const alimentoId = (await request.formData()).get("alimentoId") as string

        try {
            await prisma.bollaAlimento.delete({
                where: {
                    id: alimentoId
                }
            })
        } catch (error) {
            console.error(error);
            console.error("Non è stato possibile eliminare l'alimento.")
        } throw redirect(302, `/bolle/${params.slug}`);
    }
}