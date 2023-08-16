import prisma from '../../../prisma/prisma';
import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {

    let response = (await prisma.nucleo.findMany({
        orderBy: {
            nome: 'asc'
        }
    }))

    let response_fix: nucleo_fix[] = [];

    if (response) {
        let nome = url.searchParams.get("nome") as string;
        let cognome = url.searchParams.get("cognome") as string;
        let isee = url.searchParams.get("isee") as string;
        let componenti = url.searchParams.get("componenti") as string;
        let bambini = url.searchParams.get("bambini") as string;
        let cellulare = url.searchParams.get("cellulare") as string;
        let indirizzo = url.searchParams.get("indirizzo") as string;
        let citta = url.searchParams.get("citta") as string;
        let note = url.searchParams.get("note") as string;
        let servibile = !url.searchParams.has("servibile") ? true : false;

        if (nome) {
            response = response.filter(nucleo => nucleo.nome.toLowerCase().includes(nome))
        }
        if (cognome) {
            response = response.filter(nucleo => nucleo.cognome.toLowerCase().includes(cognome))
        }
        if (isee) {
            response = response.filter(nucleo => nucleo.isee?.toString().toLowerCase().includes(isee))
        }
        if (componenti) {
            response = response.filter(nucleo => nucleo.componenti.toString().toLowerCase().includes(componenti))
        }
        if (bambini) {
            response = response.filter(nucleo => nucleo.bambini.toString().toLowerCase().includes(bambini))
        }
        if (cellulare) {
            response = response.filter(nucleo => nucleo.cellulare?.toString().toLowerCase().includes(cellulare))
        }
        if (indirizzo) {
            response = response.filter(nucleo => nucleo.indirizzo?.toString().toLowerCase().includes(indirizzo))
        }
        if (citta) {
            response = response.filter(nucleo => nucleo.citta?.toString().toLowerCase().includes(citta))
        }
        if (note) {
            response = response.filter(nucleo => nucleo.note?.toString().toLowerCase().includes(note))
        }
        if (servibile) {
            response = response.filter(nucleo => nucleo.servibile === servibile)
        }

        for (let el of response) {
            response_fix.push({
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
            })
        }
    }

    let numNuclei = await prisma.nucleo.count() ? prisma.nucleo.count() : 0;

    return { feed: response_fix, tot: numNuclei };
}) satisfies PageServerLoad;