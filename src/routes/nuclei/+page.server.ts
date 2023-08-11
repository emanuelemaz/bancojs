import prisma from '../../../prisma/prisma';
import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
    let nome = url.searchParams.get("nome") as string;
    nome === null ? nome = "" : nome = nome
    let cognome = url.searchParams.get("cognome") as string;
    cognome === null ? cognome = "" : cognome = cognome
    let isee = url.searchParams.get("isee") as string;
    isee === null ? isee = "" : isee = isee
    let componenti = url.searchParams.get("componenti") as string;
    componenti === null ? componenti = "" : componenti = componenti
    let bambini = url.searchParams.get("bambini") as string;
    bambini === null ? bambini = "" : bambini = bambini
    let cellulare = url.searchParams.get("cellulare") as string;
    cellulare === null ? cellulare = "" : cellulare = cellulare
    let indirizzo = url.searchParams.get("indirizzo") as string;
    indirizzo === null ? indirizzo = "" : indirizzo = indirizzo
    let citta = url.searchParams.get("citta") as string;
    citta === null ? citta = "" : citta = citta
    let note = url.searchParams.get("note") as string;
    note === null ? note = "" : note = note
    let servibile = url.searchParams.get("servibile") === "true" || url.searchParams.get("servibile") === null ? true : false;

    let response = (await prisma.nucleo.findMany({
        orderBy: {
            nome: 'asc',
        }
    }))
        .filter(nucleo => nucleo.nome.toLowerCase().includes(nome))
        .filter(nucleo => nucleo.cognome.toLowerCase().includes(cognome))
        .filter(nucleo => String(nucleo.isee).includes(isee))
        .filter(nucleo => String(nucleo.componenti).includes(componenti))
        .filter(nucleo => String(nucleo.bambini).includes(bambini))
        .filter(nucleo => String(nucleo.cellulare).toLowerCase().includes(cellulare))
        .filter(nucleo => String(nucleo.indirizzo).toLowerCase().includes(indirizzo))
        .filter(nucleo => String(nucleo.citta).toLowerCase().includes(citta))
        .filter(nucleo => String(nucleo.note).toLowerCase().includes(note))

    if (servibile) {
        response = response.filter(nucleo => nucleo.servibile === servibile)
    }

    let response_fix: nucleo_fix[] = [];
    response.forEach(el => {
        let el_fix: nucleo_fix = {
            id: el.id,
            nome: el.nome,
            cognome: el.cognome,
            isee: (el.isee || el.isee == 0) ? el.isee : null,
            componenti: el.componenti,
            bambini: el.bambini,
            cellulare: el.cellulare,
            indirizzo: el.indirizzo,
            citta: el.citta,
            servibile: el.servibile,
            note: el.note
        };
        response_fix.push(el_fix)
    });

    let numNuclei = await prisma.nucleo.count() as number;

    return { feed: response_fix, tot: numNuclei};
}) satisfies PageServerLoad;