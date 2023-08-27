import { fail, redirect } from '@sveltejs/kit';
import prisma from '../../../../prisma/prisma';
import type { Actions, PageServerLoad } from './$types';

import moment from 'moment-timezone'
import QRCode from 'qrcode';
import { get } from 'svelte/store';
import tz from '$lib/stores';
import { BASE_URL } from '$env/static/private';

export const load = (async ({ params }) => {
    const carico = await prisma.carico.findUniqueOrThrow({
        where: { id: +params.slug }, include: {
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

    const qrID = (await QRCode.toString(`${BASE_URL}/carichi/${carico.id}`, {
        type: 'svg', color: {
            dark: '#FFFF',
            light: '#0000'
        }, margin: 0
    }))

    return { carico: carico, nuclei: nuclei, alimenti: carico.alimenti, allAlimenti: alimenti, qrID: qrID };
}) satisfies PageServerLoad;

export const actions: Actions = {
    modifica: async ({ request, params }) => {
        const newData = await request.formData()

        let id = +params.slug;
        const offset = get(tz);
        const data = moment(newData.get("data") as string).utcOffset(offset, true).toDate();
        const note = newData.get("note") as string | null;

        try {
            await prisma.carico.update({
                where: {
                    id: id
                },
                data: {
                    data: data,
                    note: note
                }
            });
        } catch (error) {
            console.error(error);
            console.error("Non è stato possibile aggiornare il carico.")
            return fail(400)
        }
    },
    elimina: async ({ params }) => {
        try {
            await prisma.carico.delete({
                where: {
                    id: +params.slug
                }
            })
        } catch (error) {
            console.error(error);
            console.error("Non è stato possibile eliminare il carico.")
            return fail(400)
        }
        throw redirect(302, "/bolle")
    },
    aggiungiAlimento: async ({ request, params }) => {
        const newData = await request.formData()

        const alimentoId = +(newData.get("alimentoId") as string)
        const quantita = parseFloat(newData.get("quantita") as string)
        const note = newData.get("note") as string

        try {
            await prisma.caricoAlimento.create({
                data: {
                    caricoId: +params.slug,
                    alimentoId: alimentoId,
                    quantita: quantita,
                    note: note
                }
            })
        } catch (error) {
            console.error(error);
            console.error("Non è stato possibile aggiungere l'alimento.")
            return fail(400)
        }
    },
    updateAlimento: async ({ request, params }) => {
        const newData = await request.formData()

        const caricoAlimentoId = +(newData.get("caricoAlimentoId") as string);
        const alimentoId = +(newData.get("alimentoId") as string)
        const quantita = parseFloat(newData.get("quantita") as string)
        const note = newData.get("note") as string

        try {
            await prisma.caricoAlimento.update({
                where: { id: caricoAlimentoId },
                data: {
                    alimentoId: alimentoId,
                    quantita: quantita,
                    note: note
                }
            })
        } catch (error) {
            console.error(error);
            console.error("Non è stato possibile aggiornare l'alimento.")
            return fail(400)
        }
    },
    eliminaAlimento: async ({ request }) => {
        const alimentoId = +((await request.formData()).get("alimentoId") as string)

        try {
            await prisma.caricoAlimento.delete({
                where: {
                    id: alimentoId
                }
            })
        } catch (error) {
            console.error(error);
            console.error("Non è stato possibile eliminare l'alimento.")
            return fail(400)
        }
    }
}