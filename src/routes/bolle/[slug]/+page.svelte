<script lang="ts">
	import {
		modalStore,
		type PopupSettings,
		popup,
		SlideToggle,
		toastStore
	} from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import moment from 'moment-timezone';
	import { onMount } from 'svelte';
	import BollaAlimentoForm from '$lib/BollaAlimentoForm.svelte';
	import { applyAction, enhance } from '$app/forms';
	import { afterNavigate, invalidateAll } from '$app/navigation';
	export let data: PageData;

	let alimentoInput: HTMLSelectElement;
	onMount(() => {
		invalidateAll();
		(<HTMLInputElement>document.getElementById('dataInput')).value = moment(data.bolla.data).format(
			'YYYY-MM-DDTHH:mm:ss'
		);
		alimentoInput.focus();
	});

	afterNavigate(() => {
		alimentoInput.focus();
	});

	let showNoDist: boolean = false;
	let showNoServ: boolean = false;

	const qrPopup: PopupSettings = {
		event: 'click',
		target: 'qrPopup',
		placement: 'bottom'
	};

	$: showNoDist, showNoServ;
</script>

<div class="container mx-auto p-8 space-y-8">
	<div class="flex w-full justify-between">
		<div>
			<h1 class="h1">
				Bolla <span
					class="font-mono btn variant-filled p-2 text-xl align-middle"
					use:popup={qrPopup}>#{data.bolla.id}</span
				>
			</h1>
			<div>
				<i>Creata in data {moment(data.bolla.createdAt).format('DD/MM/YYYY, HH:mm:ss')}</i>
			</div>
			<div class="card qr p-6" data-popup="qrPopup">
				{@html data.qrID}
			</div>
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
				if (result.type === 'success') {
					await applyAction(result);
					toastStore.trigger({
						message: 'Bolla modificata con successo.',
						background: 'variant-filled-success',
						timeout: 2500
					});
				} else {
					toastStore.trigger({
						message: 'Non è stato possibile modificare la bolla.',
						background: 'variant-filled-error',
						timeout: 2500
					});
				}
			};
		}}
	>
		<h2 class="h2">Beneficiario</h2>
		<input type="hidden" name="id" value={data.bolla.id} />
		<div class="my-4">
			<SlideToggle name="servSlide" bind:checked={showNoServ}
				>Mostra beneficiari non servibili</SlideToggle
			>
		</div>
		<div class="grid grid-cols-2 gap-4 my-4">
			<label class="label">
				<span>Beneficiario</span>
				<select name="nucleoId" class="select" value={data.bolla.nucleoId}>
					{#each data.nuclei as nucleo}
						{#if nucleo.servibile || showNoServ}
							<option value={nucleo.id}
								>{nucleo.nome}
								{nucleo.cognome} ({nucleo.componenti}p, {nucleo.bambini}b) {!nucleo.servibile
									? '❌ Non servibile ❌'
									: ''}</option
							>
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
			<textarea class="input textarea p-2" name="note" value={data.bolla.note} />
		</label>
		<div class="flex justify-between my-4">
			<div>
				<button type="submit" class="btn variant-filled-primary"
					><iconify-icon icon="mdi:edit" class="text-xl" /> Modifica
				</button>
				<button type="button" class="m-0 btn variant-filled-primary" on:click={() => history.back()}
					><iconify-icon icon="mdi:arrow-back" class="text-xl" />Indietro</button
				>
			</div>
			<div>
				<form action="/bolle/{data.bolla.id}/pdf" method="get" class="inline">
					<button type="submit" class="btn variant-filled-tertiary"
						><iconify-icon icon="mdi:invoice" class="text-xl" /> PDF</button
					>
				</form>
				<form action="/bolle/{data.bolla.id}/pdf" method="get" class="inline">
					<input type="hidden" name="note" />
					<button type="submit" class="btn variant-filled-tertiary"
						><iconify-icon icon="mdi:invoice" class="text-xl" /> PDF (con note)</button
					>
				</form>
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
								body: `Sicuro di voler eliminare la bolla #${data.bolla.id} del nucleo <strong>${data.bolla.nucleo.nome} ${data.bolla.nucleo.cognome}</strong> (#${data.bolla.nucleo.id})?`,
								buttonTextConfirm: 'Elimina',
								buttonTextCancel: 'Annulla',
								response: (r) => resolve(!r)
							})
						);

						if (await doCancelPromise) {
							cancel();
						}
						return async ({ result }) => {
							if (result.type === 'success' || result.type === 'redirect') {
								await applyAction(result);
								toastStore.trigger({
									message: 'Bolla eliminata con successo.',
									background: 'variant-filled-success',
									timeout: 2500
								});
							} else {
								toastStore.trigger({
									message: 'Non è stato possibile eliminare la bolla.',
									background: 'variant-filled-error',
									timeout: 2500
								});
							}
						};
					}}
				>
					<button type="submit" class="btn variant-filled-error">
						<iconify-icon icon="mdi:trash" class="text-xl" /> Elimina
					</button>
				</form>
			</div>
		</div>
		<div class="block mt-12">
			<h2 class="h2">Alimenti</h2>
			<p class="h4">Le modifiche vengono salvate automaticamente.</p>
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<div class="my-4">
				<SlideToggle name="distSlide" bind:checked={showNoDist}
					>Mostra alimenti non distribuibili</SlideToggle
				>
			</div>
			<div class="my-4">
				<form
					action="?/aggiungiAlimento"
					method="POST"
					use:enhance={async ({ formElement, formData, action, cancel, submitter }) => {
						return async ({ update, result }) => {
							if (result.type === 'success') {
								await update();
								toastStore.trigger({
									message: 'Alimento aggiunto con successo.',
									background: 'variant-filled-success',
									timeout: 2500
								});
								formElement.reset();
							} else {
								toastStore.trigger({
									message:
										"Non è stato possibile aggiungere l'alimento (probabilmente esiste già).",
									background: 'variant-filled-error',
									timeout: 2500
								});
							}
							alimentoInput.focus();
						};
					}}
				>
					<div class="grid grid-cols-2 gap-4 my-2">
						<label class="label">
							<span>Alimento</span>
							<select name="alimentoId" class="select" required bind:this={alimentoInput}>
								{#each data.allAlimenti as alimento}
									{#if alimento.distribuibile || showNoDist}
										<option value={alimento.id}>
											{alimento.nome} ({alimento.unita})
											{!alimento.distribuibile ? '❌ Non servibile ❌' : ''}
											{alimento.scadenza
												? moment().isAfter(alimento.scadenza, 'day')
													? '⚠️ Scaduto ⚠️'
													: ''
												: ''}
											{alimento.scadenza
												? moment().isSame(alimento.scadenza, 'day')
													? '⚠️ Scade oggi ⚠️'
													: ''
												: ''}
											{alimento.note ? ' || Note: ' + alimento.note : ''}
										</option>
									{/if}
								{/each}
							</select>
						</label>
						<label class="label">
							<span>Quantità</span>
							<input
								class="input p-2"
								type="number"
								name="quantita"
								min="0"
								step="0.001"
								required
							/>
						</label>
					</div>
					<label class="label">
						<span>Note</span>
						<input class="input p-2" type="text" name="note" min="0" step="0.01" />
					</label>
					<button type="submit" class="mt-4 btn variant-filled-primary"
						><iconify-icon icon="mdi:add" class="text-xl" /> Aggiungi
					</button>
				</form>
			</div>
			<div class="grid grid-cols-2 gap-4 my-4">
				{#each data.alimenti as alimentoBolla}
					<div class="block card p-4 flex justify-between">
						<div class="flex justify-between w-full">
							<div class="grid grid-cols-3 gap-4 w-full items-start">
								<div class="h-min">
									<p>Alimento</p>
									<p class="text-xl">{alimentoBolla.alimento.nome}</p>
								</div>
								<div class="h-min">
									<p>Quantità</p>
									<p class="text-xl">{alimentoBolla.quantita} {alimentoBolla.alimento.unita}</p>
								</div>
								<div class="flex gap-2 justify-end">
									<button
										type="button"
										class="btn btn-icon variant-filled-primary"
										on:click|preventDefault={() => {
											modalStore.clear();
											modalStore.trigger({
												type: 'component',
												component: {
													ref: BollaAlimentoForm,
													props: { allAlimenti: data.allAlimenti, bollaAlimento: alimentoBolla }
												}
											});
										}}
									>
										<iconify-icon icon="mdi:edit" class="text-xl" />
									</button>
									<form
										action="?/eliminaAlimento"
										method="POST"
										use:enhance={async ({ formElement, formData, action, cancel, submitter }) => {
											modalStore.clear();

											const doCancelPromise = new Promise((resolve) =>
												modalStore.trigger({
													type: 'confirm',
													title: 'Elimina',
													body: `Sicuro di voler eliminare l'alimento dalla bolla?`,
													buttonTextConfirm: 'Elimina',
													buttonTextCancel: 'Annulla',
													response: (r) => resolve(!r)
												})
											);

											if (await doCancelPromise) {
												cancel();
											}

											return async ({ update, result }) => {
												if (result.type === 'success') {
													await update();
													toastStore.trigger({
														message: 'Alimento eliminato con successo.',
														background: 'variant-filled-success',
														timeout: 2500
													});
												} else {
													toastStore.trigger({
														message: "Non è stato possibile eliminare l'alimento.",
														background: 'variant-filled-error',
														timeout: 2500
													});
												}
												alimentoInput.focus();
											};
										}}
									>
										<div>
											<input type="hidden" value={alimentoBolla.id} name="alimentoId" />
											<button type="submit" class="btn btn-icon variant-filled-error">
												<iconify-icon icon="mdi:trash" class="text-xl" />
											</button>
										</div>
									</form>
								</div>
								{#if alimentoBolla.note}
									<div class="col-span-3">
										<p>Note</p>
										<p class="text-xl">{alimentoBolla.note}</p>
									</div>
								{/if}
							</div>
						</div>
					</div>
				{/each}
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
