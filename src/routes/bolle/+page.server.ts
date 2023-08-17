import prisma from '../../../prisma/prisma';
import type { PageServerLoad } from './$types';
import moment from 'moment';

export const load = (async ({ url }) => {

    let bolle = (await prisma.bolla.findMany({
        orderBy: {
            data: 'desc'
        },
        include: {
            nucleo: true
        }
    }))

    if (bolle) {
        let id = url.searchParams.get("nucleoId") as string;
        let dataInizio = moment(url.searchParams.get("dataInizio") as string).set({ 'hours': 0, 'minutes': 0, 'seconds': 0 });
        let dataFine = moment(url.searchParams.get("dataFine") as string).set({ 'hours': 23, 'minutes': 59, 'seconds': 59 });

        if (url.searchParams.get("nucleoId")) {
            bolle = bolle.filter((bolla) => bolla.nucleo.id === id)
        }
        if (url.searchParams.get("dataInizio")) {
            bolle = bolle.filter((bolla) => bolla.data >= dataInizio.toDate())
        }
        if (url.searchParams.get("dataFine")) {
            bolle = bolle.filter((bolla) => bolla.data <= dataFine.toDate())
        }

    }
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