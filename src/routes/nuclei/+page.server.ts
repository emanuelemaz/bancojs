import { filterNucleo } from '$lib';
import prisma from '../../../prisma/prisma';
import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {

    let nuclei = await filterNucleo(url)

    let numNuclei = await prisma.nucleo.count() ? prisma.nucleo.count() : 0;

    return { nuclei: nuclei, tot: numNuclei };
}) satisfies PageServerLoad;