import { redirect } from '@sveltejs/kit';
import prisma from '../../../../prisma/prisma';
import type { Actions, PageServerLoad } from './$types';

import QRCode from 'qrcode';
import moment from 'moment-timezone';
import { BASE_URL } from '$env/static/private';

export const load = (async ({ params }) => {
    const alimento = await prisma.alimento.findUniqueOrThrow({ where: { id: params.slug } })
    
    const qrID = (await QRCode.toString(`${BASE_URL}/alimenti/${alimento.id}`, {
        type: 'svg', color: {
            dark: '#FFFF',
            light: '#0000'
        }, margin: 0
    }))
    
    return { alimento: alimento, qrID: qrID };
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