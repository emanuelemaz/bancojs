<script lang="ts">
	import Bolla from '$lib/Bolla.svelte';
	import moment from 'moment-timezone';
	import type { PageData } from './$types';
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
		servibileCheckbox.checked = true;
	}

	let servibileCheckbox: HTMLInputElement;
</script>

<div class="container mx-auto p-8 space-y-8">
	<h1 class="h1">
		Bolle emesse <span class="h4">({data.bolle.length} filtrate, {data.tot} totali)</span>
	</h1>
	<p>Sezione dedicata alla gestione delle bolle di distribuzione.</p>
	<a class="btn variant-filled-primary" href="/bolle/nuovo"
		><iconify-icon icon="mdi:add" class="text-xl" /> Aggiungi bolla</a
	>
	<form action="/bolle" method="get" bind:this={searchForm}>
		<div class="grid grid-cols-3 gap-4 my-4">
			<label class="label">
				<span>Nucleo</span>
				<select name="nucleoId" class="select search-input">
					<option />
					{#each data.nuclei as nucleo}
						<option value={nucleo.id}
							>{nucleo.nome} {nucleo.cognome} ({nucleo.componenti}p, {nucleo.bambini}b)</option
						>
					{/each}
				</select>
			</label>
			<label class="label">
				<span>Dal</span>
				<input class="input p-2 search-input" type="date" name="dataInizio" id="dataInput" />
			</label>
			<label class="label">
				<span>Al</span>
				<input class="input p-2 search-input" type="date" name="dataFine" id="dataInput" />
			</label>
		</div>
		<button type="submit" class="btn variant-filled-secondary" bind:this={searchBtn}>
			<iconify-icon icon="mdi:send" class="text-xl" />Invia
		</button>
		<a class="btn variant-filled-warning" href="/bolle" on:click={() => resetAllInputs()}>
			<iconify-icon icon="mdi:cancel" class="text-xl" />Reset</a
		>
		<button type="submit" class="btn variant-filled-tertiary" formaction="/stampa/bolle"
			><iconify-icon icon="mdi:invoice" class="text-xl" /> PDF</button
		>
	</form>

	{#each data.bolle as row}
		<Bolla bolla={row} nucleo={row.nucleo} />
	{/each}
</div>
