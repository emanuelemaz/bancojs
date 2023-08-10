// place files you want to import through the `$lib` alias in this folder.
type nucleo_fix = {
    id: number;
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
};

type bolla_fix = {
    id: number;
    data: Date;
    note: string | null;
    nucleoId: number;
    nomeN: string;
    cognomeN: string;
    componentiN: number;
    bambiniN: number;
}

type bollaalimento_fix = {
    id: number,
    nome: string,
    unita: string,
    quantita: number,
    alimentoId: number,
    bollaId: number,
    note: string | null
}

type alimento_fix = {
    id: number,
    nome: string,
    unita: string,
    scadenza: Date | null,
    distribuibile: boolean,
    note: string | null
}