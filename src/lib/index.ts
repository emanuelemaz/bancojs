// place files you want to import through the `$lib` alias in this folder.
type nucleo_fix = {
    id: string;
    nome: string;
    cognome: string;
    isee: number | null;
    componenti: number;
    bambini: number;
    cellulare: string | null;
    indirizzo: string | null;
    citta: string | null;
    servibile: boolean;
    note: string | null;
    createdAt: Date;
};

type bolla_fix = {
    id: string;
    data: Date;
    note: string | null;
    nucleoId: string;
    nomeN: string;
    cognomeN: string;
    componentiN: number;
    bambiniN: number;
    createdAt: Date;
}

type bollaalimento_fix = {
    id: string,
    nome: string,
    unita: string,
    quantita: number,
    alimentoId: string,
    bollaId: string,
    note: string | null
}

type alimento_fix = {
    id: string,
    nome: string,
    unita: string,
    scadenza: Date | null,
    distribuibile: boolean,
    note: string | null
}