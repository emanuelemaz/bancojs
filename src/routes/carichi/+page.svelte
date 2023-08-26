<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import Carico from '$lib/Carico.svelte';
	export let data: PageData;

	onMount(() => {
		invalidateAll();
	})

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
		Carichi registrati <span class="h4">({data.carichi.length} filtrati, {data.tot} totali)</span>
	</h1>
	<p>Sezione dedicata alla gestione dei carichi.</p>
	<a class="btn variant-filled-primary" href="/carichi/nuovo"
		><iconify-icon icon="mdi:add" class="text-xl" /> Aggiungi carico</a
	>
	<form action="/carichi" method="get" bind:this={searchForm}>
		<div class="grid grid-cols-3 gap-4 my-4">
			<label class="label">
				<span>Alimento</span>
				<select name="alimentoId" class="select search-input">
					<option />
					{#each data.alimenti as alimento}
						<option value={alimento.id}
							>{alimento.nome} ({alimento.unita})</option
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
		<a class="btn variant-filled-warning" href="/carichi" on:click={() => resetAllInputs()}>
			<iconify-icon icon="mdi:cancel" class="text-xl" />Reset</a
		>
		<button type="submit" class="btn variant-filled-tertiary" formaction="/stampa/carichi"
			><iconify-icon icon="mdi:invoice" class="text-xl" /> PDF</button
		>
	</form>

	{#each data.carichi as row}
		<Carico carico={row} />
	{/each}
</div>
