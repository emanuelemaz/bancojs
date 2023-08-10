<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	import 'iconify-icon';

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
		<input type="submit" class="btn variant-filled-secondary" bind:this={searchBtn} />
		<a class="btn variant-filled-warning" href="/bolle" on:click={() => resetAllInputs()}>Reset</a>
	</form>

	{#each data.bolle as row}
		<a class="block" href="/bolle/{row.id}">
			<div class="card card-hover mx-auto p-8">
				<div class="grid grid-cols-3 gap-4">
					<div>
						<p>Bolla</p>
						<p class="text-xl">(#{row.id})</p>
					</div>
					<div>
						<p>Beneficiario</p>
						<p class="text-xl">
							{row.nomeN}
							{row.cognomeN} (#{row.nucleoId}) || {row.componentiN}p, {row.bambiniN}b
						</p>
					</div>
					<div>
						<p>Data</p>
						<p class="text-xl">
							{row.data.toLocaleDateString('it-IT', {
								day: '2-digit',
								month: '2-digit',
								year: 'numeric'
							})}
						</p>
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
