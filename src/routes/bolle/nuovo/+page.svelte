<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	import moment from 'moment-timezone';

	onMount(() => {
		(<HTMLInputElement>document.getElementById('dataInput')).value =
			moment().format('YYYY-MM-DDTHH:mm:ss');
	});
</script>

<div class="container mx-auto p-8 space-y-8">
	<h1 class="h1">Nuova bolla</h1>
	<form class="form" method="POST" action="/bolle/nuovo?/aggiungi">
		<div class="grid grid-cols-2 gap-4 my-4">
			<label class="label">
				<span>Beneficiario</span>
				<select name="nucleoId" class="select" required>
					{#each data.nuclei as nucleo}
						{#if nucleo.id == data.fromNucleo}
							<option value={nucleo.id} selected
								>{nucleo.nome} {nucleo.cognome} ({nucleo.componenti}p, {nucleo.bambini}b)</option
							>
						{:else}
							<option value={nucleo.id}
								>{nucleo.nome} {nucleo.cognome} ({nucleo.componenti}p, {nucleo.bambini}b)</option
							>
						{/if}
					{/each}
				</select>
			</label>
			<label class="label">
				<span>Data</span>
				<input type="hidden" name="offset" value={moment().utcOffset()}/>
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
