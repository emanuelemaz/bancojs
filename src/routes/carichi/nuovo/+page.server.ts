import { redirect } from '@sveltejs/kit';
import prisma from '../../../../prisma/prisma';
import type { Actions } from './$types';
import type { Carico } from '@prisma/client';

import moment from 'moment-timezone'
import { get } from 'svelte/store';
import tz from '$lib/stores';

export const actions: Actions = {
    aggiungi: async ({ request }) => {
        const newData = await request.formData()

        const offset = get(tz)
        const data = moment(newData.get("data") as string).utcOffset(offset, true).toDate();
        const note = newData.get("note") as string | null;

        var newCarico: Carico | null = null;
        try {
            newCarico = await prisma.carico.create({
                data: {
                    data: data,
                    note: note,
                }
            }) || null;
        } catch (error) {
            console.error(error);
            console.error("Non è stato possibile creare il carico.")
        }
        if (newCarico) {
            throw redirect(302, newCarico.id)
        }
    }
}