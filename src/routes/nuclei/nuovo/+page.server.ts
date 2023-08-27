import type { Nucleo } from '@prisma/client';
import prisma from '../../../../prisma/prisma';
import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const actions: Actions = {
    aggiungi: async ({ request }) => {
        const newData = await request.formData()

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

        var newNucleo: Nucleo | null = null;
        try {
            newNucleo = await prisma.nucleo.create({
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
            }) || null;
        } catch (error) {
            console.error(error);
            console.error("Non è stato possibile creare il nucleo.")
        }
        if (newNucleo) {
            throw redirect(302, `${newNucleo.id}`)
        }
    },
}