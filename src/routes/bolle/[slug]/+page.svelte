<script lang="ts">
	import {
		modalStore,
		type ModalSettings,
		type PopupSettings,
		popup,
		SlideToggle
	} from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import moment from 'moment-timezone';
	import { onMount } from 'svelte';
	export let data: PageData;

	onMount(() => {
		(<HTMLInputElement>document.getElementById('dataInput')).value = moment(data.bolla.data)
			.local()
			.format('YYYY-MM-DDTHH:mm:ss');
	});

	let showNoDist: boolean = false;

	const confirmDeleteBolla = (form: HTMLFormElement): ModalSettings => {
		return {
			type: 'confirm',
			title: 'Elimina',
			body: `Sicuro di voler eliminare la bolla #${data.bolla.id} del nucleo <strong>${data.bolla.nomeN} ${data.bolla.cognomeN}</strong> (#${data.bolla.nucleoId})?`,
			buttonTextConfirm: 'Elimina',
			buttonTextCancel: 'Annulla',
			response: (r: boolean) => {
				if (r) {
					form.submit();
				}
			}
		};
	};

	const confirmUpdateBolla = (form: HTMLFormElement): ModalSettings => {
		return {
			type: 'confirm',
			title: 'Modifica',
			body: `Sicuro di voler applicare le modifiche?`,
			buttonTextConfirm: 'Modifica',
			buttonTextCancel: 'Annulla',
			response: (r: boolean) => {
				if (r) {
					form.submit();
				}
			}
		};
	};

	const confirmDeleteBollaAlimento = (form: HTMLFormElement): ModalSettings => {
		return {
			type: 'confirm',
			title: 'Elimina',
			body: `Sicuro di voler eliminare l'alimento dalla bolla?`,
			buttonTextConfirm: 'Elimina',
			buttonTextCancel: 'Annulla',
			response: (r: boolean) => {
				if (r) {
					form.submit();
				}
			}
		};
	};

	const qrPopup: PopupSettings = {
		event: 'click',
		target: 'qrPopup',
		placement: 'bottom'
	};

	$: showNoDist;
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
				<i
					>Creata in data {moment(data.bolla.createdAt).format("DD/MM/YYYY, HH:mm:ss")}</i
				>
			</div>
			<div class="card qr p-6" data-popup="qrPopup">
				{@html data.qrID}
			</div>
		</div>
	</div>
	<form
		class="form"
		method="POST"
		action="/bolle/{data.bolla.id}?/modifica"
		on:submit|preventDefault={(e) => {
			modalStore.clear();
			modalStore.trigger(confirmUpdateBolla(e.currentTarget));
		}}
	>
		<h2 class="h2">Beneficiario</h2>
		<input type="hidden" name="id" value={data.bolla.id} />
		<div class="grid grid-cols-2 gap-4 my-4">
			<label class="label">
				<span>Beneficiario</span>
				<select name="nucleoId" class="select" value={data.bolla.nucleoId}>
					{#each data.nuclei as nucleo}
						<option value={nucleo.id}
							>{nucleo.nome} {nucleo.cognome} ({nucleo.componenti} p., {nucleo.bambini} b.)</option
						>
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
				<a href="/bolle/{data.bolla.id}/pdf" class="btn variant-filled-tertiary">
					<iconify-icon icon="mdi:invoice" class="text-xl" /> PDF</a
				>
				<a href="/bolle/{data.bolla.id}/pdf?note" class="btn variant-filled-tertiary">
					<iconify-icon icon="mdi:invoice" class="text-xl" /> PDF (con note)</a
				>
			</div>
			<div>
				<form
					class="form"
					method="POST"
					action="/bolle/{data.bolla.id}?/elimina"
					on:submit|preventDefault={(e) => {
						modalStore.clear();
						modalStore.trigger(confirmDeleteBolla(e.currentTarget));
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
					>Mosta alimenti non distribuibili</SlideToggle
				>
			</div>
			<div class="my-4">
				<form action="/bolle/{data.bolla.id}?/aggiungiAlimento" method="POST">
					<div class="grid grid-cols-2 gap-4 my-2">
						<label class="label">
							<span>Alimento</span>
							<select name="alimentoId" class="select" required>
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
				{#each data.alimenti as alimento}
					<div class="block card p-4 flex justify-between">
						<div class="flex justify-between w-full">
							<div class="grid grid-cols-3 gap-4 w-full items-start">
								<div class="h-min">
									<p>Alimento</p>
									<p class="text-xl">{alimento.nome}</p>
								</div>
								<div class="h-min">
									<p>Quantità</p>
									<p class="text-xl">{alimento.quantita} {alimento.unita}</p>
								</div>
								<form
									action="/bolle/{data.bolla.id}?/eliminaAlimento"
									method="POST"
									on:submit|preventDefault={(e) => {
										modalStore.clear();
										modalStore.trigger(confirmDeleteBollaAlimento(e.currentTarget));
									}}
								>
									<div>
										<input type="hidden" value={alimento.id} name="alimentoId" />
										<button type="submit" class="btn variant-filled-error w-full">
											<iconify-icon icon="mdi:trash" class="text-xl" /> Elimina
										</button>
									</div>
								</form>
								{#if alimento.note}
									<div class="col-span-3">
										<p>Note</p>
										<p class="text-xl">{alimento.note}</p>
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
