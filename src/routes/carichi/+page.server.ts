import prisma from '../../../prisma/prisma';
import { filterCarichi } from '$lib';
import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {

    let carichi = await filterCarichi(url)

    let alimenti = await prisma.alimento.findMany({
        orderBy: {
            nome: 'asc',
        },
        where: {
            carichi: {
                some: {}
            }
        }
    });

    let numCarichi = await prisma.carico.count() ? prisma.carico.count() : 0;

    return { carichi: carichi, alimenti: alimenti, tot: numCarichi };
}) satisfies PageServerLoad;