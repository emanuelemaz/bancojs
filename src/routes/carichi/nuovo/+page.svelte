<script lang="ts">
	import { onMount } from 'svelte';
	import moment from 'moment-timezone';
	import { applyAction, enhance } from '$app/forms';
	import { toastStore } from '@skeletonlabs/skeleton';

	onMount(() => {
		(<HTMLInputElement>document.getElementById('dataInput')).value =
			moment().format('YYYY-MM-DDTHH:mm:ss');
	});
</script>

<div class="container mx-auto p-8 space-y-8">
	<h1 class="h1">Nuovo carico</h1>
	<form
		class="form"
		method="POST"
		action="?/aggiungi"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'success' || result.type === 'redirect') await applyAction(result);
				toastStore.trigger({
					message: 'Carico creato con successo.',
					background: 'variant-filled-success',
					timeout: 2500
				});
			};
		}}
	>
		<label class="label">
			<span>Data</span>
			<input class="input p-2" type="datetime-local" step="1" name="data" id="dataInput" required />
		</label>
		<label class="mt-4 label">
			<span>Note</span>
			<textarea class="input textarea p-2" name="note" />
		</label>
		<div class="mt-4">
			<div class="float-left">
				<button type="submit" class="mt-4 btn variant-filled-primary">Registra carico</button>
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
