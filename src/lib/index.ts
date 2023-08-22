// place files you want to import through the `$lib` alias in this folder.
import moment from "moment-timezone";
import prisma from "../../prisma/prisma";

export async function filterNucleo(url: URL) {
    let nuclei = await prisma.nucleo.findMany({
        orderBy: {
            nome: 'asc'
        }
    })
    if (nuclei) {
        let nome = url.searchParams.get("nome") as string;
        let cognome = url.searchParams.get("cognome") as string;
        let iseeMin = parseFloat(url.searchParams.get("iseeMin") as string);
        let iseeMax = parseFloat(url.searchParams.get("iseeMax") as string);
        let componenti = url.searchParams.get("componenti") as string;
        let bambini = url.searchParams.get("bambini") as string;
        let cellulare = url.searchParams.get("cellulare") as string;
        let indirizzo = url.searchParams.get("indirizzo") as string;
        let citta = url.searchParams.get("citta") as string;
        let note = url.searchParams.get("note") as string;
        let servibile = !url.searchParams.has("servibile") ? true : false;

        if (nome) {
            nuclei = nuclei.filter(nucleo => nucleo.nome.toLowerCase().includes(nome))
        }
        if (cognome) {
            nuclei = nuclei.filter(nucleo => nucleo.cognome.toLowerCase().includes(cognome))
        }
        if (iseeMin || iseeMin == 0) {
            nuclei = nuclei.filter(nucleo => nucleo.isee || nucleo.isee == 0 ? nucleo.isee >= iseeMin : false)
        }
        if (iseeMax || iseeMax == 0) {
            nuclei = nuclei.filter(nucleo => nucleo.isee || nucleo.isee == 0 ? nucleo.isee <= iseeMax : false)
        }
        if (componenti) {
            nuclei = nuclei.filter(nucleo => nucleo.componenti.toString().toLowerCase().includes(componenti))
        }
        if (bambini) {
            nuclei = nuclei.filter(nucleo => nucleo.bambini.toString().toLowerCase().includes(bambini))
        }
        if (cellulare) {
            nuclei = nuclei.filter(nucleo => nucleo.cellulare?.toString().toLowerCase().includes(cellulare))
        }
        if (indirizzo) {
            nuclei = nuclei.filter(nucleo => nucleo.indirizzo?.toString().toLowerCase().includes(indirizzo))
        }
        if (citta) {
            nuclei = nuclei.filter(nucleo => nucleo.citta?.toString().toLowerCase().includes(citta))
        }
        if (note) {
            nuclei = nuclei.filter(nucleo => nucleo.note?.toString().toLowerCase().includes(note))
        }
        if (servibile) {
            nuclei = nuclei.filter(nucleo => nucleo.servibile === servibile)
        }
    }

    return nuclei
}

export async function filterBolla(url: URL) {
    let bolle = await prisma.bolla.findMany({
        orderBy: {
            data: 'desc'
        },
        include: {
            nucleo: true,
            _count: {
                select: { alimenti: true }
            }
        },
    })
    if (bolle) {
        let id = url.searchParams.get("nucleoId") as string;
        let dataInizio = moment(url.searchParams.get("dataInizio") as string).set({ 'hours': 0, 'minutes': 0, 'seconds': 0 });
        let dataFine = moment(url.searchParams.get("dataFine") as string).set({ 'hours': 23, 'minutes': 59, 'seconds': 59 });

        if (url.searchParams.get("nucleoId")) {
            bolle = bolle.filter((bolla) => bolla.nucleoId === id)
        }
        if (url.searchParams.get("dataInizio")) {
            bolle = bolle.filter((bolla) => bolla.data >= dataInizio.toDate())
        }
        if (url.searchParams.get("dataFine")) {
            bolle = bolle.filter((bolla) => bolla.data <= dataFine.toDate())
        }

    }

    return bolle
}

export async function filterAlimento(url: URL) {
    let alimenti = await prisma.alimento.findMany({
        orderBy: [
            { nome: 'asc' },
        ]
    });

    if (alimenti) {
        let nome = url.searchParams.get("nome") as string;
        let note = url.searchParams.get("note") as string;
        let unita = url.searchParams.get("unita") as string;
        let dataInizio = moment(url.searchParams.get("dataInizio") as string).set({ 'hours': 0, 'minutes': 0, 'seconds': 0 });
        let dataFine = moment(url.searchParams.get("dataFine") as string).set({ 'hours': 23, 'minutes': 59, 'seconds': 59 });
        let distribuibile = !url.searchParams.has("distribuibile");

        if (nome) {
            alimenti = alimenti.filter(alimento => alimento.nome.toLowerCase().includes(nome))
        }
        if (note) {
            alimenti = alimenti.filter(alimento => alimento.note?.toLowerCase().includes(note))
        }
        if (unita) {
            alimenti = alimenti.filter(alimento => alimento.unita == unita)
        }
        if (url.searchParams.get("dataInizio")) {
            alimenti = alimenti.filter(alimento => (alimento.scadenza ? alimento.scadenza >= dataInizio.toDate() : false));
        }
        if (url.searchParams.get("dataFine")) {
            alimenti = alimenti.filter(alimento => (alimento.scadenza ? alimento.scadenza <= dataFine.toDate() : false));
        }
        if (distribuibile) {
            alimenti = alimenti.filter(alimento => alimento.distribuibile === distribuibile)
        }
    }

    return alimenti
}