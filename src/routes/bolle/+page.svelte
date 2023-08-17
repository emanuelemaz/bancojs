<script lang="ts">
	import Bolla from '$lib/Bolla.svelte';
	import moment from 'moment-timezone';
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
	<form action="/stampa/bolle" method="get" class="inline">
		<input type="hidden" name="offset" value={moment().utcOffset()} />
		<button type="submit" class="btn variant-filled-tertiary"
			><iconify-icon icon="mdi:invoice" class="text-xl" /> PDF</button
		>
	</form>
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
		<input type="submit" class="btn variant-filled-secondary" bind:this={searchBtn} />
		<a class="btn variant-filled-warning" href="/bolle" on:click={() => resetAllInputs()}>Reset</a>
	</form>

	{#each data.bolle as row}
		<Bolla bolla={row} nucleo={row.nucleo} />
	{/each}
</div>

<style>
	input[type='submit'] {
		cursor: pointer;
	}
</style>
