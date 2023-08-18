import { redirect } from '@sveltejs/kit';
import prisma from '../../../../prisma/prisma';
import type { Actions, PageServerLoad } from './$types';
import type { Bolla } from '@prisma/client';

import moment from 'moment-timezone'

export const load = (async ({ url }) => {
    let fromNucleo = url.searchParams.get("nucleoId")

    let nuclei = (await prisma.nucleo.findMany({
        orderBy: {
            nome: 'asc'
        },
    })).filter(nucleo => nucleo.servibile === true);


    return { nuclei: nuclei, fromNucleo: fromNucleo }
})

export const actions: Actions = {
    aggiungi: async ({ request, cookies }) => {
        const newData = await request.formData()

        const offset = cookies.get("offset") ? parseInt((cookies.get("offset") as string).toString()) : 0;
        const data = moment(newData.get("data") as string).utcOffset(offset, true).toDate();
        const note = newData.get("note") as string | null;
        const nucleoId = newData.get("nucleoId") as string;

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
            throw redirect(302, newBolla.id)
        }
    }
}