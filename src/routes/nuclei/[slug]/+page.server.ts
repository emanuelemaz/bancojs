import { redirect } from '@sveltejs/kit';
import prisma from '../../../../prisma/prisma';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ params }) => {
    // 1.
    const response = await prisma.nucleo.findUniqueOrThrow({ where: { id: parseInt(params.slug) } })
    let response_fix: nucleo_fix = {
        id: response.id,
        nome: response.nome,
        cognome: response.cognome,
        isee: response.isee?.toNumber() || null,
        componenti: response.componenti,
        bambini: response.bambini,
        cellulare: response.cellulare,
        indirizzo: response.indirizzo,
        citta: response.citta,
        servibile: response.servibile,
        note: response.note
    };
    // 2.
    return { feed: response_fix };
}) satisfies PageServerLoad;

export const actions: Actions = {
    modifica: async ({ request }) => {
        const newData = await request.formData()

        let id = parseInt(newData.get("id") as string);
        const nome = newData.get("nome") as string;
        const cognome = newData.get("cognome") as string;
        const isee = parseFloat(newData.get("isee") as string);
        const componenti = parseInt(newData.get("componenti") as string);
        const bambini = parseInt(newData.get("bambini") as string);
        const cellulare = newData.get("cellulare") as string | null;
        const indirizzo = newData.get("indirizzo") as string | null;
        const citta = newData.get("citta") as string | null;
        const note = newData.get("note") as string | null;
        function servibile() {
            if ((newData.get("servibile") !== null || newData.get("servibile") !== undefined) && newData.get("servibile") == "on") {
                return true;
            } else {
                return false;
            }
        }
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
                    servibile: servibile(),
                    note: note
                }
            });
        } catch (error) {
            console.error(error);
            console.error("Non è stato possibile aggiornare il nucleo.")
        } throw redirect(302, "/nuclei");
    },
    elimina: async ({ params }) => {
        try {
            await prisma.nucleo.delete({
                where: {
                    id: parseInt(params.slug)
                }
            })
        } catch (error) {
            console.error(error);
            console.error("Non è stato possibile eliminare il nucleo.")
        } throw redirect(302, "/nuclei");
    }
}