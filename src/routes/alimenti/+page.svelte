<script lang="ts">
	import Alimento from '$lib/Alimento.svelte';
	import {
		ListBox,
		ListBoxItem,
		SlideToggle,
		type PopupSettings,
		popup
	} from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	export let data: PageData;

	let searchForm: HTMLFormElement;
	let searchBtn: HTMLButtonElement;

	onMount(() => {
		invalidateAll();
		resetAllInputs();
		servSlide = new URLSearchParams(window.location.search).has('distribuibile');
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

	let pdfPopup: PopupSettings = {
		event: 'click',
		target: 'pdfPopup',
		placement: 'bottom'
	};

	let servSlide: boolean;
	let pdfOptions: string[] = [];

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
		<div class="flex gap-1">
			<button type="submit" class="btn variant-filled-secondary" bind:this={searchBtn}>
				<iconify-icon icon="mdi:send" class="text-xl" />Invia
			</button>
			<a class="btn variant-filled-warning" href="/alimenti" on:click={() => resetAllInputs()}>
				<iconify-icon icon="mdi:cancel" class="text-xl" />Reset</a
			>
			<div class="btn-group variant-filled-tertiary">
				<button
					type="submit"
					formaction="/stampa/alimenti"
					class="btn variant-filled-tertiary hover:variant-filled-tertiary justify-between"
				>
					<iconify-icon icon="mdi:invoice" class="text-xl" /> PDF
				</button>
				<button
					type="button"
					class="btn variant-filled-tertiary hover:variant-filled-tertiary w-0"
					use:popup={pdfPopup}>↓</button
				>
			</div>
			<div class="card" data-popup="pdfPopup">
				<ListBox multiple>
					<ListBoxItem name="_nome" value="1" bind:group={pdfOptions}>Nome alimento</ListBoxItem>
					<ListBoxItem name="_unita" value="2" bind:group={pdfOptions}>Unità</ListBoxItem>
					<ListBoxItem name="_disponibile" value="3" bind:group={pdfOptions}
						>Quantità disponibile</ListBoxItem
					>
					<ListBoxItem name="_scadenza" value="4" bind:group={pdfOptions}>Scadenza</ListBoxItem>
					<ListBoxItem name="_distribuibile" value="5" bind:group={pdfOptions}
						>Distribuibile</ListBoxItem
					>
					<ListBoxItem name="_note" value="6" bind:group={pdfOptions}>Note</ListBoxItem>
				</ListBox>
			</div>
		</div>
	</form>

	{#each data.alimenti as row}
		<Alimento {row} />
	{/each}
</div>
