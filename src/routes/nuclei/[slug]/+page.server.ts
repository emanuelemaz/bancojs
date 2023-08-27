import { redirect } from '@sveltejs/kit';
import prisma from '../../../../prisma/prisma';
import type { Actions, PageServerLoad } from './$types';

import QRCode from 'qrcode'
import { BASE_URL } from '$env/static/private';

export const load = (async ({ params, url }) => {
    const nucleo = await prisma.nucleo.findUniqueOrThrow({ where: { id: +params.slug }, include: { bolle: { orderBy: { data: 'desc' } } } })

    const qrID = (await QRCode.toString(`${BASE_URL}/nuclei/${nucleo.id}`, {
        type: 'svg', color: {
            dark: '#FFFF',
            light: '#0000'
        }, margin: 0
    }));

    return { nucleo: nucleo, qrID: qrID, bolleNucleo: nucleo.bolle };
}) satisfies PageServerLoad;

export const actions: Actions = {
    modifica: async ({ request }) => {
        const newData = await request.formData()


        let id = +(newData.get("id") as string);
        const nome = newData.get("nome") as string;
        const cognome = newData.get("cognome") as string;
        const isee = parseFloat(newData.get("isee") as string);
        const componenti = parseInt(newData.get("componenti") as string);
        const bambini = parseInt(newData.get("bambini") as string);
        const cellulare = newData.get("cellulare") as string | null;
        const indirizzo = newData.get("indirizzo") as string | null;
        const citta = newData.get("citta") as string | null;
        const note = newData.get("note") as string | null;
        let servibile = newData.has("servibile") ? true : false;

        try {
            await prisma.nucleo.update({
                where: {
                    id: id
                },
                data: {
                    nome: nome,
                    cognome: cognome,
                    isee: isee,
                    componenti: componenti,
                    bambini: bambini,
                    cellulare: cellulare,
                    indirizzo: indirizzo,
                    citta: citta,
                    servibile: servibile,
                    note: note
                }
            });
        } catch (error) {
            console.error(error);
            console.error("Non è stato possibile aggiornare il nucleo.")
        }
    },
    elimina: async ({ params }) => {
        try {
            await prisma.nucleo.delete({
                where: {
                    id: +params.slug
                }
            })
        } catch (error) {
            console.error(error);
            console.error("Non è stato possibile eliminare il nucleo.")
        }
        throw redirect(302, '/nuclei')
    },
}