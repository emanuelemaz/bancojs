<script lang="ts">
	import { browser } from '$app/environment';
	import { applyAction, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { SlideToggle, toastStore } from '@skeletonlabs/skeleton';
	import moment from 'moment-timezone';

	let componenti: HTMLInputElement, bambini: HTMLInputElement;

	function maxBambini() {
		bambini.value > componenti.value
			? (bambini.valueAsNumber = componenti.valueAsNumber)
			: (bambini.value = bambini.value);
		bambini.max = componenti.value;
	}
</script>

<div class="container mx-auto p-8 space-y-8">
	<h1 class="h1">Nuovo nucleo</h1>
	<form
		class="form"
		method="POST"
		action="?/aggiungi"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'success' || result.type === 'redirect') {
					await applyAction(result);
					toastStore.trigger({
						message: 'Nucleo creato con successo.',
						background: 'variant-filled-success',
						timeout: 2500
					});
				}
			};
		}}
	>
		<div class="grid grid-cols-2 gap-4 my-4">
			<label class="label">
				<span>Nome</span>
				<input class="input p-2" type="text" name="nome" required />
			</label>
			<label class="label">
				<span>Cognome</span>
				<input class="input p-2" type="text" name="cognome" required />
			</label>
		</div>
		<div class="grid grid-cols-3 gap-4 my-4">
			<label class="label">
				<span>ISEE (€)</span>
				<input class="input p-2" type="number" name="isee" min="0" step="0.01" />
			</label>
			<label class="label">
				<span>Componenti</span>
				<input
					bind:this={componenti}
					class="input p-2"
					type="number"
					min="0"
					step="1"
					name="componenti"
					on:change={() => maxBambini()}
					required
				/>
			</label>
			<label class="label">
				<span>(di cui bambini)</span>
				<input
					bind:this={bambini}
					class="input p-2"
					type="number"
					name="bambini"
					min="0"
					max="0"
					step="1"
					required
				/>
			</label>
			<label class="label">
				<span>Cellulare</span>
				<input class="input p-2" type="text" name="cellulare" />
			</label>
			<label class="label">
				<span>Indirizzo</span>
				<input class="input p-2" type="text" name="indirizzo" />
			</label>
			<label class="label">
				<span>Comune</span>
				<input class="input p-2" type="text" name="citta" />
			</label>
			<SlideToggle name="servibile" checked>Servibile</SlideToggle>
		</div>
		<label class="mt-4 label">
			<span>Note</span>
			<textarea class="input textarea p-2" name="note" />
		</label>
		<div class="mt-4">
			<input type="submit" class="btn variant-filled-primary" value="Aggiungi nucleo" />
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
