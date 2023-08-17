<script lang="ts">
	import type { Nucleo } from "@prisma/client";

    export let row: Nucleo;

    function valuta(x: number | undefined | null) {
		if (x || x == 0) {
			return Intl.NumberFormat('it-IT', { currency: 'EUR', style: 'currency' }).format(x);
		}
		return '-';
	}

	function bambini(x: number) {
		if (x == 0) {
			return '';
		}
		if (x == 1) {
			return `(${x} bambino)`;
		}
		return `(${x} bambini)`;
	}
</script>

<a class="block" href="/nuclei/{row.id}">
    <div class="card card-hover mx-auto p-8">
        {#if !row.servibile}
            <div class="text-xl mb-2 chip variant-filled-surface">❌ Non servibile ❌</div>
        {/if}
        <div class="grid grid-cols-3 gap-4">
            <div>
                <p>Beneficiario</p>
                <p class="text-xl">{row.nome} {row.cognome} (#{row.id})</p>
            </div>
            <div>
                <p>ISEE</p>
                <p class="text-xl">{valuta(row.isee)}</p>
            </div>
            <div>
                <p>Componenti</p>
                <p class="text-xl">{row.componenti} {bambini(row.bambini)}</p>
            </div>
            <div>
                <p>Cellulare</p>
                <p class="text-xl">{row.cellulare || '-'}</p>
            </div>
            <div>
                <p>Indirizzo</p>
                <p class="text-xl">{row.indirizzo || '-'}</p>
            </div>
            <div>
                <p>Comune</p>
                <p class="text-xl">{row.citta || '-'}</p>
            </div>
        </div>
        {#if row.note}
            <!-- svelte-ignore a11y-invalid-attribute -->
            <a href="#"
                ><div class="mt-4">
                    Note <textarea class="textarea p-2" readonly>{row.note}</textarea>
                </div></a
            >
        {/if}
    </div>
</a>

<style>
	textarea,
	textarea:hover {
		cursor: help !important;
	}
</style>
