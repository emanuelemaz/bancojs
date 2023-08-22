<script lang="ts">
	import Nucleo from '$lib/Nucleo.svelte';
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { enhance } from '$app/forms';
	export let data: PageData;

	let searchForm: HTMLFormElement;
	let searchBtn: HTMLButtonElement;

	onMount(() => {
		invalidateAll();
		resetAllInputs();
		servSlide = new URLSearchParams(window.location.search).has('servibile');
	});

	function resetAllInputs() {
		var inputs = <HTMLCollectionOf<HTMLInputElement>>(
			document.getElementsByClassName('search-input')
		);
		for (let i of inputs) {
			i.value = '';
		}
		servSlide = false;
	}

	let servSlide: boolean;
	$: servSlide;
</script>

<div class="container mx-auto p-8 space-y-8">
	<h1 class="h1">
		Nuclei serviti <span class="h4">({data.nuclei.length} filtrati, {data.tot} totali)</span>
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
			<div class="grid grid-cols-2 gap-4">
				<input
					type="number"
					name="iseeMin"
					class="search-input input p-3"
					step="0.01"
					min="0"
					placeholder="Cerca ISEE minimo..."
				/>
				<input
					type="number"
					name="iseeMax"
					class="search-input input p-3"
					step="0.01"
					min="0"
					placeholder="Cerca ISEE massimo..."
				/>
			</div>
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
				<SlideToggle name="servibile" bind:checked={servSlide} on:click={() => searchBtn.click()}
					>Includi non servibili</SlideToggle
				>
			</div>
		</div>
		<button type="submit" class="btn variant-filled-secondary" bind:this={searchBtn}>
			<iconify-icon icon="mdi:send" class="text-xl" />Invia
		</button>
		<a class="btn variant-filled-warning" href="/nuclei" on:click={() => resetAllInputs()}>
			<iconify-icon icon="mdi:cancel" class="text-xl" />Reset</a
		>
		<button type="submit" class="btn variant-filled-tertiary" formaction="/stampa/nuclei"
			><iconify-icon icon="mdi:invoice" class="text-xl" /> PDF</button
		>
	</form>

	{#each data.nuclei as row}
		<Nucleo {row} />
	{/each}
</div>
