import { redirect } from '@sveltejs/kit';
import prisma from '../../../../prisma/prisma';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ params }) => {
    const response = await prisma.alimento.findUniqueOrThrow({ where: { id: parseInt(params.slug) } })
    let response_fix: alimento_fix = {
        id: response.id,
        nome: response.nome,
        unita: response.unita,
        scadenza: response.scadenza,
        distribuibile: response.distribuibile,
        note: response.note
    };

    return { alimento: response_fix };
}) satisfies PageServerLoad;

export const actions: Actions = {
    modifica: async ({ request, params }) => {
        const newData = await request.formData()

        const id = parseInt(params.slug);
        const nome = newData.get("nome") as string;
        const unita = newData.get("unita") as string;
        const scadenza = new Date((newData.get("scadenza") as string));
        const note = newData.get("note") as string;
        function distribuibile() {
            if ((newData.get("distribuibile") !== null || newData.get("distribuibile") !== undefined) && newData.get("distribuibile") == "on") {
                return true;
            } else {
                return false;
            }
        }

        try {
            await prisma.alimento.update({
                where: {
                    id: id
                },
                data: {
                    nome: nome,
                    unita: unita,
                    scadenza: newData.get("scadenza") ? scadenza : null,
                    distribuibile: distribuibile(),
                    note: newData.get("note") ? note : null
                }
            });
        } catch (error) {
            console.error(error);
            console.error("Non è stato possibile aggiornare l'alimento.")
        } throw redirect(302, "/alimenti");
    },
    elimina: async ({ params }) => {
        try {
            await prisma.alimento.delete({
                where: {
                    id: parseInt(params.slug)
                }
            })
        } catch (error) {
            console.error(error);
            console.error("Non è stato possibile eliminare l'alimento.")
        } throw redirect(302, "/alimenti");
    }
}