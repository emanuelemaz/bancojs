<script lang="ts">
	import {
		modalStore,
		type ModalSettings,
		SlideToggle,
		toastStore,
		type PopupSettings,
		popup
	} from '@skeletonlabs/skeleton';
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

	const qrPopup: PopupSettings = {
		event: 'click',
		target: 'qrPopup',
		placement: 'bottom'
	};
</script>

<div class="container mx-auto p-8 space-y-8">
	<div class="flex w-full justify-between">
		<div>
			<h1 class="h1">
				Alimento <span
					class="font-mono btn variant-filled p-2 text-xl align-middle"
					use:popup={qrPopup}>#{data.alimento.id}</span
				>
			</h1>
			<div>
				<i>Creato in data {moment(data.alimento.createdAt).format('DD/MM/YYYY, HH:mm:ss')}</i>
			</div>
		</div>
		<div class="card qr p-6" data-popup="qrPopup">
			{@html data.qrID}
		</div>
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
				toastStore.trigger({
					message: 'Alimento modificato con successo.',
					background: 'variant-filled-success',
					timeout: 2500
				});
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
					action="?/elimina"
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
							toastStore.trigger({
								message: 'Alimento eliminato con successo.',
								background: 'variant-filled-success',
								timeout: 2500
							});
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
	.qr {
		width: 16rem;
	}
</style>
