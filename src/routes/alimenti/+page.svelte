<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	import 'iconify-icon';

	let searchForm: HTMLFormElement;
	let searchBtn: HTMLButtonElement;

	let distribuibileBoolInput: HTMLInputElement;
	let distribuibileCheckbox: HTMLInputElement;
	function resetAllInputs() {
		var inputs = <HTMLCollectionOf<HTMLInputElement>>(
			document.getElementsByClassName('search-input')
		);
		for (let i of inputs) {
			i.value = '';
		}
		distribuibileCheckbox.checked = true;
	}

	function fixDistBool() {
		if (distribuibileCheckbox.checked) {
			distribuibileBoolInput.value = 'true';
		} else {
			distribuibileBoolInput.value = 'false';
		}
		searchBtn.click();
	}
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
			<div class="space-y-2">
				<label class="flex items-center space-x-2" for="distribuibile">Escludi non distribuibili</label>
				<input type="hidden" name="distribuibile" value="true" bind:this={distribuibileBoolInput} />
				<input
					type="checkbox"
					bind:this={distribuibileCheckbox}
					on:click={() => fixDistBool()}
					checked
					class="search-input checkbox input p-3"
				/>
			</div>
		</div>
		<button type="submit" class="btn variant-filled-secondary" bind:this={searchBtn}>Invia</button>
		<a class="btn variant-filled-warning" href="/alimenti" on:click={() => resetAllInputs()}
			>Reset</a
		>
	</form>

	{#each data.alimenti as row}
		<a class="block" href="/alimenti/{row.id}">
			<div class="card card-hover mx-auto p-8">
				{#if !row.distribuibile}
					<div class="text-xl mb-2 chip variant-filled-surface">❌ Non distribuibile ❌</div>
				{/if}
				<div class="grid grid-cols-3 gap-4">
					<div>
						<p>Nome</p>
						<p class="text-xl">
							{row.nome} (#{row.id})
						</p>
					</div>
					<div>
						<p>Unità</p>
						<p class="text-xl">
							{row.unita}
						</p>
					</div>
					<div>
						<p>Prima scadenza</p>
						<p class="text-xl">
							{#if row.scadenza}
								{row.scadenza?.toLocaleDateString('it-IT', {
									day: '2-digit',
									month: '2-digit',
									year: 'numeric'
								})}
							{:else}
								-
							{/if}
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
</style>
