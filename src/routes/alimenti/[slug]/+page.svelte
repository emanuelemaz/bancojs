<script lang="ts">
	import { modalStore, type ModalSettings, SlideToggle } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import moment from 'moment-timezone';
	import { onMount } from 'svelte';
	import { applyAction, enhance } from '$app/forms';
	export let data: PageData;

	onMount(() => {
		(<HTMLInputElement>document.getElementById('dataInput')).value = moment(
			data.alimento.scadenza
		).format('YYYY-MM-DD');
	});
</script>

<div class="container mx-auto p-8 space-y-8">
	<h1 class="h1 mb-0">
		Alimento: {data.alimento.nome}
		<span class="font-mono">#{data.alimento.id}</span>
	</h1>
	<div class="!mt-0">
		<i
			>Creato in data {new Date(
				parseInt(data.alimento.id.slice(0, 8), 16) * 1000
			).toLocaleDateString('it-IT', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit'
			})}</i
		>
	</div>
	<form
		class="form"
		method="POST"
		action="?/modifica"
		use:enhance={async ({ formElement, formData, action, cancel, submitter }) => {
			modalStore.clear();

			const doCancelPromise = new Promise((resolve) =>
				modalStore.trigger({
					type: 'confirm',
					title: 'Modifica',
					body: `Sicuro di voler applicare le modifiche?`,
					buttonTextConfirm: 'Modifica',
					buttonTextCancel: 'Annulla',
					response: (r) => resolve(!r)
				})
			);

			if (await doCancelPromise) {
				cancel();
			}

			return async ({ result }) => {
				await applyAction(result);
			};
		}}
	>
		<div class="grid grid-cols-3 gap-4 my-4">
			<label class="label">
				<span>Nome</span>
				<input class="input p-2" type="text" name="nome" value={data.alimento.nome} required />
			</label>
			<label class="label">
				<span>Unità</span>
				<input class="input p-2" type="text" name="unita" value={data.alimento.unita} required />
			</label>
			<label class="label">
				<span>Data di scadenza</span>
				<input class="input p-2" type="date" name="scadenza" id="dataInput" />
			</label>
		</div>
		<div class="grid grid-cols-3 gap-4 my-4">
			<SlideToggle checked={data.alimento.distribuibile} name="distribuibile"
				>Distribuibile</SlideToggle
			>
		</div>
		<label class="mt-4 label">
			<span>Note</span>
			<textarea class="input textarea p-2" name="note" value={data.alimento.note} />
		</label>
		<div class="mt-4 flex justify-between">
			<div>
				<button type="submit" class="btn variant-filled-primary"
					><iconify-icon icon="mdi:edit" class="text-xl" /> Modifica
				</button>
				<button type="button" class="m-0 btn variant-filled-primary" on:click={() => history.back()}
					><iconify-icon icon="mdi:arrow-back" class="text-xl" />Indietro</button
				>
			</div>
			<div>
				<form
					class="form"
					method="POST"
					action="/alimenti/{data.alimento.id}?/elimina"
					use:enhance={async ({ formElement, formData, action, cancel, submitter }) => {
						modalStore.clear();

						const doCancelPromise = new Promise((resolve) =>
							modalStore.trigger({
								type: 'confirm',
								title: 'Elimina',
								body: `Sicuro di voler eliminare l'alimento?`,
								buttonTextConfirm: 'Elimina',
								buttonTextCancel: 'Annulla',
								response: (r) => resolve(!r)
							})
						);

						if (await doCancelPromise) {
							cancel();
						}

						return async ({ result, update }) => {
							await applyAction(result);
						};
					}}
				>
					<button type="submit" class="btn variant-filled-error">
						<iconify-icon icon="mdi:trash" class="text-xl" /> Elimina
					</button>
				</form>
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
