<script lang="ts">
	import Alimento from '$lib/Alimento.svelte';
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	export let data: PageData;

	let searchForm: HTMLFormElement;
	let searchBtn: HTMLButtonElement;

	function resetAllInputs() {
		var inputs = <HTMLCollectionOf<HTMLInputElement>>(
			document.getElementsByClassName('search-input')
		);
		for (let i of inputs) {
			i.value = '';
		}
		servSlide = true;
	}

	let servSlide: boolean;
	$: servSlide
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
	<a href="/alimenti/stampa/pdf" class="btn variant-filled-tertiary">
		<iconify-icon icon="mdi:invoice" class="text-xl" /> PDF</a
	>
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
				<SlideToggle bind:checked={servSlide} name="distribuibile" on:click={() => searchBtn.click()}>Includi non distribuibili</SlideToggle>
			</div>
		</div>
		<button type="submit" class="btn variant-filled-secondary" bind:this={searchBtn}>Invia</button>
		<a class="btn variant-filled-warning" href="/alimenti" on:click={() => resetAllInputs()}
			>Reset</a
		>
	</form>

	{#each data.alimenti as row}
		<Alimento row={row}/>
	{/each}
</div>