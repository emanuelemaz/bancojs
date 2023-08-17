import { filterAlimento } from '$lib';
import prisma from '../../../prisma/prisma';
import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
    let alimenti = await filterAlimento(url)

    let alimentiTot = await prisma.alimento.count() ? prisma.alimento.count() : 0;

    let unitaList = await prisma.alimento.findMany({
        distinct: ['unita'],
        select: {
            unita: true
        }
    })

    return { alimenti: alimenti, tot: alimentiTot, unita: unitaList };
}) satisfies PageServerLoad;