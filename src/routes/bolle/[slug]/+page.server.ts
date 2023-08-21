import { redirect } from '@sveltejs/kit';
import prisma from '../../../../prisma/prisma';
import type { Actions, PageServerLoad } from './$types';

import moment from 'moment-timezone'
import QRCode from 'qrcode';
import { get } from 'svelte/store';
import tz from '$lib/stores';

export const load = (async ({ params }) => {
    const bolla = await prisma.bolla.findUniqueOrThrow({
        where: { id: params.slug }, include: {
            nucleo: true,
            alimenti: {
                orderBy: {
                    alimento: {
                        nome: 'asc'
                    }
                },
                include: {
                    alimento: true
                }
            }
        },
    })

    const nuclei = await prisma.nucleo.findMany({
        orderBy: {
            nome: 'asc',
        }
    });
    const alimenti = await prisma.alimento.findMany({
        orderBy: {
            nome: 'asc',
        }
    });

    const qrID = (await QRCode.toString(`bolle/${bolla.id}`, {
        type: 'svg', color: {
            dark: '#FFFF',
            light: '#0000'
        }, margin: 0
    }))


    return { bolla: bolla, nuclei: nuclei, alimenti: bolla.alimenti, allAlimenti: alimenti, qrID: qrID };
}) satisfies PageServerLoad;

export const actions: Actions = {
    modifica: async ({ request }) => {
        const newData = await request.formData()

        let id = newData.get("id") as string;
        const offset = get(tz);
        const data = moment(newData.get("data") as string).utcOffset(offset, true).toDate();
        const note = newData.get("note") as string | null;
        const nucleoId = newData.get("nucleoId") as string;

        try {
            await prisma.bolla.update({
                where: {
                    id: id
                },
                data: {
                    data: data,
                    note: note,
                    nucleoId: nucleoId
                }
            });
        } catch (error) {
            console.error(error);
            console.error("Non è stato possibile aggiornare la bolla.")
        } throw redirect(302, "/bolle");
    },
    elimina: async ({ params }) => {
        try {
            await prisma.bolla.delete({
                where: {
                    id: params.slug
                }
            })
        } catch (error) {
            console.error(error);
            console.error("Non è stato possibile eliminare il nucleo.")
        } throw redirect(302, "/bolle");
    },
    aggiungiAlimento: async ({ request, params }) => {
        const newData = await request.formData()

        const alimentoId = newData.get("alimentoId") as string
        const quantita = parseFloat(newData.get("quantita") as string)
        const note = newData.get("note") as string

        try {
            await prisma.bollaAlimento.create({
                data: {
                    bollaId: params.slug,
                    alimentoId: alimentoId,
                    quantita: quantita,
                    note: note
                }
            })
        } catch (error) {
            console.error(error);
            console.error("Non è stato possibile aggiungere l'alimento.")
        } throw redirect(302, `/bolle/${params.slug}`);
    },
    updateAlimento: async ({ request, params }) => {
        const newData = await request.formData()

        const bollaAlimentoId = newData.get("bollaAlimentoId") as string;
        const alimentoId = newData.get("alimentoId") as string
        const quantita = parseFloat(newData.get("quantita") as string)
        const note = newData.get("note") as string

        try {
            await prisma.bollaAlimento.update({
                where: { id: bollaAlimentoId },
                data: {
                    alimentoId: alimentoId,
                    quantita: quantita,
                    note: note
                }
            })
        } catch (error) {
            console.error(error);
            console.error("Non è stato possibile aggiornare l'alimento.")
        } throw redirect(302, `/bolle/${params.slug}`);
    },
    eliminaAlimento: async ({ request, params }) => {
        const alimentoId = (await request.formData()).get("alimentoId") as string

        try {
            await prisma.bollaAlimento.delete({
                where: {
                    id: alimentoId
                }
            })
        } catch (error) {
            console.error(error);
            console.error("Non è stato possibile eliminare l'alimento.")
        } throw redirect(302, `/bolle/${params.slug}`);
    }
}