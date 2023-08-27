# BancoJS

Gestionale per le attività di banco alimentare. Scritto in [Svelte](https://github.com/sveltejs/kit), [Skeleton](https://github.com/skeletonlabs/skeleton) e [Prisma](https://github.com/prisma/prisma). I PDF vengono generati con [pdfmake](https://github.com/bpampuch/pdfmake). Il database utilizzato è [PostgreSQL](https://www.postgresql.org/).

## Configurazione

### Variabili d'ambiente

Prima di avviare il server andranno inserite, nel file `.env`, tre variabili d'ambiente:

- `BASE_URL`: url usato per generare i pdf dei nuclei e delle bolle. In localhost si può usare `http://127.0.0.1:5173`, la demo usa `https://bancojs.onrender.com`.
- `DATABASE_URL`: stringa di connessione al database PostgreSQL.
- `NODE_VERSION` (solo per hosting): variabile che serve per il deploy dell'applicazione su siti di hosting come Render. Si può usare Node.js versione `20.5.0`.

### Personalizzazione

Per cambiare intestazione inserire un'intestazione vettoriale personalizzata al posto di `pdf/static/intestazione.svg`. Per modificare dimensioni, o per usare un'immagine vettoriale andrà modificato direttamente il codice dei file `+server.ts` nelle sotto-directory di `stampa` e nelle directory `pdf` dei nuclei, delle bolle, degli alimenti e dei carichi.
