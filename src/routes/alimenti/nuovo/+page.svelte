<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { SlideToggle, toastStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	let nomeInput: HTMLInputElement;
	onMount(() => {
		nomeInput.focus();
	});

	let servSlide: boolean = true;
	$: servSlide;
</script>

<div class="container mx-auto p-8 space-y-8">
	<h1 class="h1">Nuovo alimento</h1>
	<form
		class="form"
		method="POST"
		action="?/aggiungi"
		use:enhance={async ({ formElement, formData, action, cancel, submitter }) => {
			return async ({ result, update }) => {
				if (result.type === 'success' || result.type === 'redirect') {
					await applyAction(result);
					toastStore.trigger({
						message: 'Alimento aggiunto con successo.',
						background: 'variant-filled-success',
						timeout: 2500
					});
				}
			};
		}}
	>
		<div class="grid grid-cols-3 gap-4 my-4">
			<label class="label">
				<span>Nome</span>
				<input class="input p-2" type="text" name="nome" required bind:this={nomeInput} />
			</label>
			<label class="label">
				<span>Unità</span>
				<input class="input p-2" type="text" name="unita" required />
			</label>
			<label class="label">
				<span>Data di scadenza</span>
				<input class="input p-2" type="date" name="scadenza" id="dataInput" />
			</label>
		</div>
		<div class="grid grid-cols-3 gap-4 my-4">
			<SlideToggle bind:checked={servSlide} name="distribuibile">Distribuibile</SlideToggle>
		</div>
		<label class="mt-4 label">
			<span>Note</span>
			<textarea class="input textarea p-2" name="note" />
		</label>
		<div class="mt-4">
			<input type="submit" class="btn variant-filled-primary" value="Aggiungi alimento" />
			<button type="button" class="m-0 btn variant-filled-primary" on:click={() => history.back()}
				>Indietro</button
			>
		</div>
	</form>
</div>

<style>
	input[type='submit'] {
		cursor: pointer;
	}
</style>
