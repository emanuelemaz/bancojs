# BancoJS

Gestionale per le attività di banco alimentare. Scritto in [Svelte](https://github.com/sveltejs/kit), [Skeleton](https://github.com/skeletonlabs/skeleton) e [Prisma](https://github.com/prisma/prisma). I PDF vengono generati con [pdfmake](https://github.com/bpampuch/pdfmake).

## Offline
Può essere usato in self-hosting, anche offline, con MongoDB Community Server in modalità replica-set.

### Come creare un replica-set con MongoDB Community server

1. Interrompere il servizio di MongoDB se avviato;
2. Sul file di configurazione di MongoDB Community Server (di default `C:\Program Files\MongoDB\Server\6.0\bin\mongod.cfg`) aggiungere le seguenti stringhe:
   ```
   replication:
     replSetName: rs0
   ```
4. Creare n cartelle per ogni istanza del database. Tre istanze saranno sufficienti, per cui si possono creare, ad esempio, le cartelle `C:\data\db1`, `C:\data\db2`, `C:\data\db3`;
5. Avviare una nuova istanza del database con `mongod --port 27037 --replSet rs0 --dbpath="C:\data\db1"`
6. Sulla shell di comando del database (accessibile anche da MongoDB Compass), digitare rs.initate();
7. Avviare altre due istanze del database con
   ```
   mongod --port 27037 --replSet rs0 --dbpath="C:\data\db2"
   mongod --port 27037 --replSet rs0 --dbpath="C:\data\db3"
   ```

Una volta configurato, per avviare ogni volta il server basterà avviare tre istanze con `mongod`. Tuttavia, questo sarà necessario solo se il demone non si avvierà all'avvio del sistema.
