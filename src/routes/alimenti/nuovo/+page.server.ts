import { redirect } from '@sveltejs/kit';
import prisma from '../../../../prisma/prisma';
import type { Actions } from './$types';

export const actions: Actions = {
    aggiungi: async ({ request }) => {
        const newData = await request.formData()

        const nome = newData.get("nome") as string;
        const unita = newData.get("unita") as string;
        const scadenza = new Date(Date.parse(newData.get("scadenza") as string));
        const note = newData.get("note") as string;
        const distribuibile = newData.has("distribuibile") ? true : false;

        try {
            await prisma.alimento.create({
                data: {
                    nome: nome,
                    unita: unita,
                    scadenza: newData.get("scadenza") ? scadenza : null,
                    note: newData.get("note") ? note : null,
                    distribuibile: distribuibile
                }
            });
        } catch (error) {
            console.error(error);
            console.error("Non è stato possibile creare l'alimento.")
        } throw redirect(302, "/alimenti");
    },
}