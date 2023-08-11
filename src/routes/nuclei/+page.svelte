<script lang="ts">
	import Nucleo from '$lib/Nucleo.svelte';
	import type { PageData } from './$types';
	export let data: PageData;

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
		<Nucleo row={row}/>
	{/each}
</div>

<style>
	input[type='submit'] {
		cursor: pointer;
	}
</style>
