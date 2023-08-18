<script lang="ts">
	import Alimento from '$lib/Alimento.svelte';
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import moment from 'moment-timezone';
	import { browser } from '$app/environment';
	export let data: PageData;

	if (browser) {
		document.cookie = `tz=${moment().utcOffset()}`;
	}

	let searchForm: HTMLFormElement;
	let searchBtn: HTMLButtonElement;

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
		Alimenti disponibili <span class="h4">({data.alimenti.length} filtrati, {data.tot} totali)</span
		>
	</h1>
	<p>Sezione dedicata alla gestione degli alimenti in magazzino.</p>
	<a class="btn variant-filled-primary" href="/alimenti/nuovo"
		><iconify-icon icon="mdi:add" class="text-xl" /> Aggiungi alimento</a
	>
	<form action="/stampa/alimenti" method="get" class="inline">
		<button type="submit" class="btn variant-filled-tertiary"
			><iconify-icon icon="mdi:invoice" class="text-xl" /> PDF</button
		>
	</form>
	<form action="/alimenti" method="get" bind:this={searchForm}>
		<div class="grid grid-cols-3 gap-4 my-4">
			<label class="label">
				<span>Nome</span>
				<input type="text" name="nome" class="search-input input p-3" placeholder="Cerca nome..." />
			</label>
			<label class="label">
				<span>Unità</span>
				<select name="unita" class="select p-2 search-input" placeholder="Cerca unità">
					<option />
					{#each data.unita as unita}
						<option value={unita['unita']}>{unita['unita']}</option>
					{/each}
				</select>
			</label>
			<label class="label">
				<span>Note</span>
				<input type="text" name="note" class="search-input input p-3" placeholder="Cerca note..." />
			</label>
			<label class="label">
				<span>Scadenza dal</span>
				<input class="input p-2 search-input" type="date" name="dataInizio" id="dataInput" />
			</label>
			<label class="label">
				<span>Scadenza al</span>
				<input class="input p-2 search-input" type="date" name="dataFine" id="dataInput" />
			</label>
			<div class="space-y-2 flex items-center">
				<SlideToggle
					bind:checked={servSlide}
					name="distribuibile"
					on:click={() => searchBtn.click()}>Includi non distribuibili</SlideToggle
				>
			</div>
		</div>
		<button type="submit" class="btn variant-filled-secondary" bind:this={searchBtn}>
			<iconify-icon icon="mdi:send" class="text-xl" />Invia
		</button>
		<a class="btn variant-filled-warning" href="/alimenti" on:click={() => resetAllInputs()}>
			<iconify-icon icon="mdi:cancel" class="text-xl" />Reset</a
		>
		<button type="submit" class="btn variant-filled-tertiary" formaction="/stampa/alimenti"
			><iconify-icon icon="mdi:invoice" class="text-xl" /> PDF</button
		>
	</form>

	{#each data.alimenti as row}
		<Alimento {row} />
	{/each}
</div>
