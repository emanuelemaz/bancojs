import { redirect } from '@sveltejs/kit';
import prisma from '../../../../prisma/prisma';
import type { Actions, PageServerLoad } from './$types';
import type { Bolla, Nucleo } from '@prisma/client';

import moment from 'moment-timezone'
import { get } from 'svelte/store';
import tz from '$lib/stores';

export const load = (async ({ url }) => {
    let fromNucleoId = +(url.searchParams.get("nucleoId") as string)
    let fromNucleo : Nucleo | null = null;

    if (url.searchParams.has('nucleoId')) {
        fromNucleo = await prisma.nucleo.findUniqueOrThrow({ where: { id: fromNucleoId } })
    }

    let nuclei = (await prisma.nucleo.findMany({
        orderBy: {
            nome: 'asc'
        },
    }));

    return { nuclei: nuclei, fromNucleo: fromNucleo }
})

export const actions: Actions = {
    aggiungi: async ({ request }) => {
        const newData = await request.formData()

        const offset = get(tz)
        const data = moment(newData.get("data") as string).utcOffset(offset, true).toDate();
        const note = newData.get("note") as string | null;
        const nucleoId = +(newData.get("nucleoId") as string);

        var newBolla: Bolla | null = null;
        try {
            newBolla = await prisma.bolla.create({
                data: {
                    data: data,
                    note: note,
                    nucleoId: nucleoId
                }
            }) || null;
        } catch (error) {
            console.error(error);
            console.error("Non è stato possibile creare la bolla.")
        }
        if (newBolla) {
            throw redirect(302, `${newBolla.id}`)
        }
    }
}