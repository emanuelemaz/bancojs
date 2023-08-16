import PdfPrinter from 'pdfmake';
import prisma from '../../../prisma/prisma';
import type { PageServerLoad } from './$types';
import moment from 'moment';

export const load = (async ({ url }) => {

    let response = (await prisma.alimento.findMany({
        orderBy: {
            nome: 'desc'
        }
    }))

    let nome = url.searchParams.get("nome") as string;
    let note = url.searchParams.get("note") as string;
    let unita = url.searchParams.get("unita") as string;
    let dataInizio = moment(url.searchParams.get("dataInizio") as string).set({ 'hours': 0, 'minutes': 0, 'seconds': 0 });
    let dataFine = moment(url.searchParams.get("dataFine") as string).set({ 'hours': 23, 'minutes': 59, 'seconds': 59 });
    let distribuibile = !url.searchParams.has("distribuibile") ? true : false;

    if (response) {
        if (nome) {
            response = response.filter(alimento => alimento.nome.toLowerCase().includes(nome))
        }
        if (note) {
            response = response.filter(alimento => alimento.note?.toLowerCase().includes(note))
        }
        if (unita) {
            response = response.filter(alimento => alimento.unita == unita)
        }
        if (url.searchParams.get("dataInizio")) {
            response = response.filter(alimento => (alimento.scadenza ? alimento.scadenza >= dataInizio.toDate() : false));
        }
        if (url.searchParams.get("dataFine")) {
            response = response.filter(alimento => (alimento.scadenza ? alimento.scadenza <= dataFine.toDate() : false));
        }
        if (distribuibile) {
            response = response.filter(alimento => alimento.distribuibile === distribuibile)
        }
    }

    let alimentiTot = await prisma.alimento.count() ? prisma.alimento.count() : 0;

    let unitaList = await prisma.alimento.findMany({
        distinct: ['unita'],
        select: {
            unita: true
        }
    })

    return { alimenti: response, tot: alimentiTot, unita: unitaList };
}) satisfies PageServerLoad;