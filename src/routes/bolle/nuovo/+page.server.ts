import { redirect } from '@sveltejs/kit';
import prisma from '../../../../prisma/prisma';
import type { Actions, PageServerLoad } from './$types';

const getUTCDate = (date: Date) => {
    const d = new Date(date);
    const utcDate = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds());
    return new Date(utcDate);
}

export const load = (async ({ }) => {
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
            note: el.note
        };
        nuclei_fix.push(el_fix)
    });
    return { nuclei: nuclei_fix }
})

export const actions: Actions = {
    aggiungi: async ({ request }) => {
        const newData = await request.formData()

        const data = getUTCDate(new Date(newData.get("data") as string));
        const note = newData.get("note") as string | null;
        const nucleoId = newData.get("nucleoId") as string;

        try {
            await prisma.bolla.create({
                data: {
                    data: data,
                    note: note,
                    nucleoId: nucleoId
                }
            });
        } catch (error) {
            console.error(error);
            console.error("Non è stato possibile creare la bolla.")
        } throw redirect(302, "/bolle");
    }
}