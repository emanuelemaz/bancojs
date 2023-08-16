import { redirect } from '@sveltejs/kit';
import prisma from '../../../../prisma/prisma';
import type { Actions, PageServerLoad } from './$types';
import type { Bolla } from '@prisma/client';

import moment from 'moment-timezone'

export const load = (async ({ url }) => {
    let nuclei = (await prisma.nucleo.findMany({
        orderBy: {
            nome: 'asc'
        },
    })).filter(nucleo => nucleo.servibile === true);

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
            note: el.note,
            createdAt: el.createdAt
        };
        nuclei_fix.push(el_fix)
    });

    let fromNucleo = url.searchParams.get("nucleoId")
    return { nuclei: nuclei_fix, fromNucleo: fromNucleo }
})

export const actions: Actions = {
    aggiungi: async ({ request }) => {
        const newData = await request.formData()

        const offset = moment.tz(moment(), moment.tz.guess(true)).utcOffset();
        const data = moment(newData.get("data") as string).utcOffset(offset, true).toDate();
        const note = newData.get("note") as string | null;
        const nucleoId = newData.get("nucleoId") as string;

        var newBolla: Bolla | null = null;
        try {
            newBolla = await prisma.bolla.create({
                data: {
                    data: data,
                    note: note,
                    nucleoId: nucleoId
                }
            }) || null;
        } catch (error) {
            console.error(error);
            console.error("Non è stato possibile creare la bolla.")
        }
        if (newBolla) {
            throw redirect(302, newBolla.id)
        }
    }
}