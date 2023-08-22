<script lang="ts">
	import {
		modalStore,
		type ModalSettings,
		type PopupSettings,
		popup,
		SlideToggle
	} from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import Bolla from '$lib/Bolla.svelte';
	import moment from 'moment-timezone';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { applyAction, enhance } from '$app/forms';
	export let data: PageData;

	onMount(() => {
		invalidateAll();
	});

	let componenti: HTMLInputElement, bambini: HTMLInputElement;

	function maxBambini() {
		bambini.value > componenti.value
			? (bambini.valueAsNumber = componenti.valueAsNumber)
			: (bambini.value = bambini.value);
		bambini.max = componenti.value;
	}

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
				Nucleo <span
					class="font-mono btn variant-filled p-2 text-xl align-middle"
					use:popup={qrPopup}>#{data.nucleo.id}</span
				>
			</h1>
			<div>
				<i>Creato in data {moment(data.nucleo.createdAt).format('DD/MM/YYYY, HH:mm:ss')}</i>
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
			};
		}}
	>
		<input type="hidden" name="id" value={data.nucleo.id} />
		<div class="grid grid-cols-2 gap-4 my-4">
			<label class="label">
				<span>Nome</span>
				<input class="input p-2" type="text" name="nome" value={data.nucleo.nome} required />
			</label>
			<label class="label">
				<span>Cognome</span>
				<input class="input p-2" type="text" name="cognome" value={data.nucleo.cognome} required />
			</label>
		</div>
		<div class="grid grid-cols-3 gap-4 my-4">
			<label class="label">
				<span>ISEE (€)</span>
				<input
					class="input p-2"
					type="number"
					name="isee"
					value={data.nucleo.isee}
					min="0"
					step="0.01"
				/>
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
					value={data.nucleo.componenti}
					required
				/>
			</label>
			<label class="label">
				<span>(di cui) bambini</span>
				<input
					bind:this={bambini}
					class="input p-2"
					type="number"
					name="bambini"
					min="0"
					max={data.nucleo.componenti}
					step="1"
					value={data.nucleo.bambini}
					required
				/>
			</label>
			<label class="label">
				<span>Cellulare</span>
				<input class="input p-2" type="text" name="cellulare" value={data.nucleo.cellulare} />
			</label>
			<label class="label">
				<span>Indirizzo</span>
				<input class="input p-2" type="text" name="indirizzo" value={data.nucleo.indirizzo} />
			</label>
			<label class="label">
				<span>Comune</span>
				<input class="input p-2" type="text" name="citta" value={data.nucleo.citta} />
			</label>
			<SlideToggle name="servibile" checked={data.nucleo.servibile}>Servibile</SlideToggle>
		</div>
		<label class="mt-4 label">
			<span>Note</span>
			<textarea class="input textarea p-2" name="note" value={data.nucleo.note} />
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
				<form method="get" action="/bolle/nuovo" class="inline">
					<input type="hidden" name="nucleoId" value={data.nucleo.id} />
					<button type="submit" class="btn variant-filled-tertiary"
						><iconify-icon icon="mdi:add" class="text-xl inline" /> Emetti bolla
					</button>
				</form>
				<form action="/nuclei/{data.nucleo.id}/pdf" method="get" class="inline">
					<button type="submit" class="btn variant-filled-tertiary"
						><iconify-icon icon="mdi:invoice" class="text-xl" /> PDF</button
					>
				</form>
				{#if data.bolleNucleo.length}
					<form action="/nuclei/{data.nucleo.id}/pdf" method="get" class="inline">
						<input type="hidden" name="bolle" />
						<button type="submit" class="btn variant-filled-tertiary"
							><iconify-icon icon="mdi:invoice" class="text-xl" /> PDF (con bolle)</button
						>
					</form>
				{/if}
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
								body: `Sicuro di voler eliminare il nucleo ${data.nucleo.nome} ${data.nucleo.cognome} (#${data.nucleo.id})? Tutte le bolle relative al nucleo verranno eliminate.`,
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
					<button type="submit" class="btn variant-filled-error"
						><iconify-icon icon="mdi:trash" class="text-xl" /> Elimina
					</button>
				</form>
			</div>
		</div>
	</form>
	{#if data.bolleNucleo.length}
		<div class="space-y-4">
			<h2 class="h2">Bolle emesse</h2>
			{#each data.bolleNucleo as row}
				<Bolla nucleo={data.nucleo} bolla={row} />
			{/each}
		</div>
	{/if}
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
