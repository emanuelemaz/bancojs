<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	function valuta(x: number | undefined | null) {
		if (x || x == 0) {
			return Intl.NumberFormat('it-IT', { currency: 'EUR', style: 'currency' }).format(x);
		}
		return '-';
	}

	function bambini(x: number, y: number) {
		if (x == 0) {
			return '';
		}
		if (x == 1) {
			return `(${x} bambino)`;
		}
		return `(${x} bambini)`;
	}

	let searchForm: HTMLFormElement;
	let searchBtn: HTMLInputElement;

	function resetAllInputs() {
		var inputs = <HTMLCollectionOf<HTMLInputElement>>(
			document.getElementsByClassName('search-input')
		);
		for (let i of inputs) {
			i.value = '';
		}
		servibileCheckbox.checked = true;
	}

	let servibileBoolInput: HTMLInputElement;
	let servibileCheckbox: HTMLInputElement;
	function fixServBool() {
		if (servibileCheckbox.checked) {
			servibileBoolInput.value = 'true';
		} else {
			servibileBoolInput.value = 'false';
		}
		searchBtn.click();
	}
</script>

<div class="container mx-auto p-8 space-y-8">
	<h1 class="h1">
		Nuclei serviti <span class="h4">({data.feed.length} filtrati, {data.tot} totali)</span>
	</h1>
	<p>Sezione dedicata alla gestione dell'anagrafica.</p>
	<a class="btn variant-filled-primary" href="/nuclei/nuovo"
		><iconify-icon icon="mdi:add" class="text-xl" />Aggiungi nucleo</a
	>
	<form action="/nuclei" method="get" bind:this={searchForm}>
		<div class="grid grid-cols-3 gap-4 my-4">
			<input type="text" name="nome" class="search-input input p-3" placeholder="Cerca nome..." />
			<input
				type="text"
				name="cognome"
				class="search-input input p-3"
				placeholder="Cerca cognome..."
			/>
			<input
				type="number"
				name="isee"
				class="search-input input p-3"
				step="0.01"
				min="0"
				placeholder="Cerca ISEE..."
			/>
			<input
				type="number"
				name="componenti"
				class="search-input input p-3"
				min="0"
				step="1"
				placeholder="Cerca componenti..."
			/>
			<input
				type="number"
				name="bambini"
				class="search-input input p-3"
				min="0"
				step="1"
				placeholder="Cerca bambini..."
			/>
			<input
				type="text"
				name="cellulare"
				class="search-input input p-3"
				placeholder="Cerca cellulare..."
			/>
			<input
				type="text"
				name="indirizzo"
				class="search-input input p-3"
				placeholder="Cerca indirizzo..."
			/>
			<input type="text" name="citta" class="search-input input p-3" placeholder="Cerca citta..." />
			<input type="text" name="note" class="search-input input p-3" placeholder="Cerca note..." />
			<div class="space-y-2">
				<label class="flex items-center space-x-2" for="servibile">Escludi non servibili</label>
				<input type="hidden" name="servibile" value="true" bind:this={servibileBoolInput} />
				<input
					type="checkbox"
					bind:this={servibileCheckbox}
					on:click={() => fixServBool()}
					checked
					class="search-input checkbox input p-3"
				/>
			</div>
		</div>
		<input type="submit" class="btn variant-filled-secondary" bind:this={searchBtn} />
		<a class="btn variant-filled-warning" href="/nuclei" on:click={() => resetAllInputs()}>Reset</a>
	</form>

	{#each data.feed as row}
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
						<p class="text-xl">{row.componenti} {bambini(row.bambini, row.componenti)}</p>
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
	{/each}
</div>

<style>
	textarea,
	textarea:hover {
		cursor: help !important;
	}

	input[type='submit'] {
		cursor: pointer;
	}
</style>
