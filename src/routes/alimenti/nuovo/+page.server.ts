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

        function distribuibile() {
            if ((newData.get("distribuibile") !== null || newData.get("distribuibile") !== undefined) && newData.get("distribuibile") == "on") {
                return true;
            } else {
                return false;
            }
        }

        try {
            await prisma.alimento.create({
                data: {
                    nome: nome,
                    unita: unita,
                    scadenza: newData.get("scadenza") ? scadenza : null,
                    note: newData.get("note") ? note : null
                }
            });
        } catch (error) {
            console.error(error);
            console.error("Non è stato possibile creare l'alimento.")
        } throw redirect(302, "/alimenti");
    },
}