import type { Bolla, Nucleo } from '@prisma/client';
import prisma from '../../../prisma/prisma';
import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {

    let id = parseInt(url.searchParams.get("nucleoId") as string);
    let dataInizio = new Date(Date.parse(url.searchParams.get("dataInizio") as string));
    let dataFine = new Date(Date.parse(url.searchParams.get("dataFine") as string));

    let response = (await prisma.bolla.findMany({
        orderBy: {
            data: 'desc'
        }
    }))
    if (url.searchParams.get("nucleoId")) {
        response = response.filter((bolla) => bolla.nucleoId === id)
    }
    if (url.searchParams.get("dataInizio")) {
        response = response.filter((bolla) => bolla.data >= dataInizio)
    }
    if (url.searchParams.get("dataFine")) {
        response = response.filter((bolla) => bolla.data <= dataFine)
    }


    let response_fix: bolla_fix[] = [];
    for (let el of response) {
        let nucleo: Nucleo = await prisma.nucleo.findUniqueOrThrow({ where: { id: el.nucleoId } });
        response_fix.push({
            id: el.id,
            data: el.data,
            note: el.note,
            nucleoId: el.nucleoId,
            nomeN: nucleo.nome,
            cognomeN: nucleo.cognome,
            componentiN: nucleo.componenti,
            bambiniN: nucleo.bambini
        })
    }

    let numBolle = await prisma.bolla.count() as number;

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

    let nucleiBolle_fix: nucleo_fix[] = [];
    nucleiBolle.forEach(el => {
        nucleiBolle_fix.push({
            id: el.id,
            nome: el.nome,
            cognome: el.cognome,
            isee: el.isee?.toNumber() || null,
            componenti: el.componenti,
            bambini: el.bambini,
            cellulare: el.cellulare,
            indirizzo: el.indirizzo,
            citta: el.citta,
            servibile: el.servibile,
            note: el.note
        });
    });

    return { bolle: response_fix, tot: numBolle, nuclei: nucleiBolle_fix };
}) satisfies PageServerLoad;