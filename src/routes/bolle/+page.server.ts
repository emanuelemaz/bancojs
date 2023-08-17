import prisma from '../../../prisma/prisma';
import { filterBolla } from '$lib';
import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {

    let bolle = await filterBolla(url)

    let nucleiBolle = await prisma.nucleo.findMany({
        orderBy: {
            nome: 'asc',
        },
        where: {
            bolle: {
                some: {}
            }
        }
    });

    let numBolle = await prisma.bolla.count() ? prisma.bolla.count() : 0;

    return { bolle: bolle, nuclei: nucleiBolle, tot: numBolle };
}) satisfies PageServerLoad;