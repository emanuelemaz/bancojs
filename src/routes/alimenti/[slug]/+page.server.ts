import { redirect } from '@sveltejs/kit';
import prisma from '../../../../prisma/prisma';
import type { Actions, PageServerLoad } from './$types';

import moment from 'moment';

export const load = (async ({ params }) => {
    const alimenti = await prisma.alimento.findUniqueOrThrow({ where: { id: params.slug } })

    return { alimento: alimenti };
}) satisfies PageServerLoad;

export const actions: Actions = {
    modifica: async ({ request, params }) => {
        const newData = await request.formData()

        const id = params.slug;
        const nome = newData.get("nome") as string;
        const unita = newData.get("unita") as string;
        const scadenza = moment(newData.get("scadenza") as string).toDate();
        const note = newData.get("note") as string;
        let distribuibile = newData.has("distribuibile") ? true : false;

        try {
            await prisma.alimento.update({
                where: {
                    id: id
                },
                data: {
                    nome: nome,
                    unita: unita,
                    scadenza: newData.get("scadenza") ? scadenza : null,
                    distribuibile: distribuibile,
                    note: newData.get("note") ? note : null
                }
            });
        } catch (error) {
            console.error(error);
            console.error("Non è stato possibile aggiornare l'alimento.")
        }
    },
    elimina: async ({ params }) => {
        try {
            await prisma.alimento.delete({
                where: {
                    id: params.slug
                }
            })
        } catch (error) {
            console.error(error);
            console.error("Non è stato possibile eliminare l'alimento.")
        } throw redirect(302, "/alimenti");
    }
}