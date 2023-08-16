import type { Nucleo } from '@prisma/client';
import prisma from '../../../prisma/prisma';
import type { PageServerLoad } from './$types';
import moment from 'moment';

export const load = (async ({ url }) => {

    let response = (await prisma.bolla.findMany({
        orderBy: {
            data: 'desc'
        }
    }))

    let response_fix: bolla_fix[] = [];
    let nucleiBolle_fix: nucleo_fix[] = [];

    if (response) {
        let id = url.searchParams.get("nucleoId") as string;
        let dataInizio = moment(url.searchParams.get("dataInizio") as string).set({ 'hours': 0, 'minutes': 0, 'seconds': 0 });
        let dataFine = moment(url.searchParams.get("dataFine") as string).set({ 'hours': 23, 'minutes': 59, 'seconds': 59 });

        if (url.searchParams.get("nucleoId")) {
            response = response.filter((bolla) => bolla.nucleoId === id)
        }
        if (url.searchParams.get("dataInizio")) {
            response = response.filter((bolla) => bolla.data >= dataInizio.toDate())
        }
        if (url.searchParams.get("dataFine")) {
            response = response.filter((bolla) => bolla.data <= dataFine.toDate())
        }

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

        for (let el of nucleiBolle) {
            nucleiBolle_fix.push({
                id: el.id,
                nome: el.nome,
                cognome: el.cognome,
                isee: el.isee || null,
                componenti: el.componenti,
                bambini: el.bambini,
                cellulare: el.cellulare,
                indirizzo: el.indirizzo,
                citta: el.citta,
                servibile: el.servibile,
                note: el.note
            });
        }
    }

    let numBolle = await prisma.bolla.count() ? prisma.bolla.count() : 0;

    return { bolle: response_fix, tot: numBolle, nuclei: nucleiBolle_fix };
}) satisfies PageServerLoad;