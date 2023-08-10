import type { Nucleo } from '@prisma/client';
import prisma from '../../../prisma/prisma';
import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {

    let nome = url.searchParams.get("nome") as string;
    let note = url.searchParams.get("note") as string;
    let unita = url.searchParams.get("unita") as string;
    let dataInizio = new Date(Date.parse(url.searchParams.get("dataInizio") as string));
    let dataFine = new Date(Date.parse(url.searchParams.get("dataFine") as string));
    let distribuibile = url.searchParams.get("distribuibile") === "true" || url.searchParams.get("distribuibile") === null ? true : false;

    let response = (await prisma.alimento.findMany({
        orderBy: {
            nome: 'desc'
        }
    }))
    if (url.searchParams.get("nome")) {
        response = response.filter(alimento => alimento.nome.toLowerCase().includes(nome))
    }
    if (url.searchParams.get("note")) {
        response = response.filter(alimento => alimento.note?.toLowerCase().includes(note))
    }
    if (url.searchParams.get("unita")) {
        response = response.filter(alimento => alimento.unita == unita)
    }
    if (url.searchParams.get("dataInizio")) {
        response = response.filter(alimento => (alimento.scadenza ? alimento.scadenza >= dataInizio : false));
    }
    if (url.searchParams.get("dataFine")) {
        response = response.filter(alimento => (alimento.scadenza ? alimento.scadenza <= dataFine : false));
    }
    if (distribuibile) {
        response = response.filter(alimento => alimento.distribuibile === distribuibile)
    }

    let alimentiTot = await prisma.alimento.count();
    let unitaList = await prisma.alimento.findMany({
        distinct: ['unita'],
        select: {
            unita: true
        }
    })

    return { alimenti: response, tot: alimentiTot, unita: unitaList };
}) satisfies PageServerLoad;