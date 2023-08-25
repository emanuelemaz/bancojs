<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	import moment from 'moment-timezone';
	import { applyAction, enhance } from '$app/forms';
	import { SlideToggle, toastStore } from '@skeletonlabs/skeleton';

	onMount(() => {
		(<HTMLInputElement>document.getElementById('dataInput')).value =
			moment().format('YYYY-MM-DDTHH:mm:ss');
	});

	let showNoServ: boolean = !data.fromNucleoServibile;
	$: showNoServ;
</script>

<div class="container mx-auto p-8 space-y-8">
	<h1 class="h1">Nuova bolla</h1>
	<SlideToggle name="servSlide" bind:checked={showNoServ}
		>Mostra beneficiari non servibili</SlideToggle
	>
	<form
		class="form"
		method="POST"
		action="?/aggiungi"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'success' || result.type === 'redirect') await applyAction(result);
				toastStore.trigger({
					message: 'Bolla creata con successo.',
					background: 'variant-filled-success',
					timeout: 2500
				});
			};
		}}
	>
		<div class="grid grid-cols-2 gap-4 my-4">
			<label class="label">
				<span>Beneficiario</span>
				<select name="nucleoId" class="select" required>
					{#each data.nuclei as nucleo}
						{#if nucleo.servibile || showNoServ}
							{#if nucleo.id == data.fromNucleo.id}
								<option value={nucleo.id} selected
									>{nucleo.nome}
									{nucleo.cognome} ({nucleo.componenti}p, {nucleo.bambini}b) {!nucleo.servibile
										? '❌ Non servibile ❌'
										: ''}</option
								>
							{:else}
								<option value={nucleo.id}
									>{nucleo.nome}
									{nucleo.cognome} ({nucleo.componenti}p, {nucleo.bambini}b) {!nucleo.servibile
										? '❌ Non servibile ❌'
										: ''}</option
								>
							{/if}
						{/if}
					{/each}
				</select>
			</label>
			<label class="label">
				<span>Data</span>
				<input
					class="input p-2"
					type="datetime-local"
					step="1"
					name="data"
					id="dataInput"
					required
				/>
			</label>
		</div>
		<label class="mt-4 label">
			<span>Note</span>
			<textarea class="input textarea p-2" name="note" />
		</label>
		<div class="mt-4">
			<div class="float-left">
				<button type="submit" class="mt-4 btn variant-filled-primary">Emetti bolla</button>
				<button type="button" class="m-0 btn variant-filled-primary" on:click={() => history.back()}
					>Indietro</button
				>
			</div>
		</div>
	</form>
</div>

<style>
	@media print {
		.btn {
			display: none;
		}
	}
</style>
