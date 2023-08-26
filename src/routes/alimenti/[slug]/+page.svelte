<script lang="ts">
	import {
		modalStore,
		SlideToggle,
		toastStore,
		type PopupSettings,
		popup,
		ListBox,
		ListBoxItem
	} from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import moment from 'moment-timezone';
	import { onMount } from 'svelte';
	import { applyAction, enhance } from '$app/forms';
	import TransazioneAlimento from '$lib/BollaAlimento.svelte';
	import BollaAlimento from '$lib/BollaAlimento.svelte';
	import CaricoAlimento from '$lib/CaricoAlimento.svelte';
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

	let pdfPopup: PopupSettings = {
		event: 'click',
		target: 'pdfPopup',
		placement: 'bottom'
	};
	let pdfOptions: string[] = [];
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
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
		<a class="m-0 btn variant-filled-primary h-12" href="/alimenti/nuovo"
			><iconify-icon icon="mdi:add" class="text-xl" />Aggiungi nuovo (SHIFT+N)</a
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
				if (result.type === 'success') {
					await applyAction(result);
					toastStore.trigger({
						message: 'Alimento modificato con successo.',
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
			<form action="/alimenti/{data.alimento.id}/pdf" method="get" class="inline">
				<div class="btn-group variant-filled-tertiary">
					<button
						type="submit"
						class="btn variant-filled-tertiary hover:variant-filled-tertiary justify-between"
					>
						<iconify-icon icon="mdi:invoice" class="text-xl" /> PDF
					</button>
					<button
						type="button"
						class="btn variant-filled-tertiary hover:variant-filled-tertiary w-0"
						use:popup={pdfPopup}>↓</button
					>
				</div>
				<div class="card" data-popup="pdfPopup">
					<ListBox multiple>
						<ListBoxItem name="_bolle" value="1" bind:group={pdfOptions}>Bolle emesse</ListBoxItem>
						<ListBoxItem name="_carichi" value="2" bind:group={pdfOptions}
							>Carichi registrati</ListBoxItem
						>
						<ListBoxItem name="_bolleNote" value="3" bind:group={pdfOptions}>Note bolle</ListBoxItem
						>
						<ListBoxItem name="_carichiNote" value="4" bind:group={pdfOptions}
							>Note carichi</ListBoxItem
						>
						<ListBoxItem name="_noteAlimento" value="5" bind:group={pdfOptions}
							>Note alimento</ListBoxItem
						>
					</ListBox>
				</div>
			</form>
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
							if (result.type === 'success' || result.type === 'redirect') {
								await applyAction(result);
								toastStore.trigger({
									message: 'Alimento eliminato con successo.',
									background: 'variant-filled-success',
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
	</form>
	{#if data.carichiAlimento.length || data.bolleAlimento.length}
		<div class="container mx-auto space-y-8">
			{#if data.carichiAlimento.length && data.bolleAlimento.length}
			<h2 class="h2">
				In magazzino:
				<strong>{data.qt}</strong>
				{data.alimento.unita}
			</h2>
			{:else}
			<div>
				<h2 class="h2">
					In magazzino: non calcolabile
				</h2>
				<p>Non sono presenti bolle e carichi.</p>
			</div>
				{/if}
			{#if data.carichiAlimento.length}
				<h3 class="h3 pb-4">Carichi</h3>
				{#each data.carichiAlimento as ca}
					<CaricoAlimento caricoAlimento={ca} carico={ca.carico} alimento={ca.alimento} />
				{/each}
			{/if}
			{#if data.bolleAlimento.length}
				<h3 class="h3 pb-4">Bolle</h3>
				{#each data.bolleAlimento as ba}
					<BollaAlimento bollaAlimento={ba} bolla={ba.bolla} alimento={ba.alimento} />
				{/each}
			{/if}
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
