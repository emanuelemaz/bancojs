<script lang="ts">
	import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	export let data: PageData;

	let componenti: HTMLInputElement, bambini: HTMLInputElement;

	function maxBambini() {
		bambini.max = componenti.value;
	}

	const confirmDelete = (form: HTMLFormElement): ModalSettings => {
		return {
			type: 'confirm',
			title: 'Elimina',
			body: `Sicuro di voler eliminare il nucleo ${data.feed.nome} ${data.feed.cognome} (#${data.feed.id})? Tutte le bolle relative al nucleo verranno eliminate.`,
			buttonTextConfirm: 'Elimina',
			buttonTextCancel: 'Annulla',
			response: (r: boolean) => {
				if (r) {
					form.submit();
				}
			}
		};
	};

	const confirmUpdate = (form: HTMLFormElement): ModalSettings => {
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
</script>

<div class="container mx-auto p-8 space-y-8">
	<h1 class="h1">Nucleo #{data.feed.id}</h1>
	<form
		class="form"
		method="POST"
		action="/nuclei/{data.feed.id}?/modifica"
		on:submit|preventDefault={(e) => {
			modalStore.clear();
			modalStore.trigger(confirmUpdate(e.currentTarget));
		}}
	>
		<input type="hidden" name="id" value={data.feed.id} />
		<div class="grid grid-cols-2 gap-4 my-4">
			<label class="label">
				<span>Nome</span>
				<input class="input p-2" type="text" name="nome" value={data.feed.nome} required />
			</label>
			<label class="label">
				<span>Cognome</span>
				<input class="input p-2" type="text" name="cognome" value={data.feed.cognome} required />
			</label>
		</div>
		<div class="grid grid-cols-3 gap-4 my-4">
			<label class="label">
				<span>ISEE (€)</span>
				<input
					class="input p-2"
					type="number"
					name="isee"
					value={data.feed.isee}
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
					value={data.feed.componenti}
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
					max={data.feed.componenti}
					step="1"
					value={data.feed.bambini}
					required
				/>
			</label>
			<label class="label">
				<span>Cellulare</span>
				<input class="input p-2" type="text" name="cellulare" value={data.feed.cellulare} />
			</label>
			<label class="label">
				<span>Indirizzo</span>
				<input class="input p-2" type="text" name="indirizzo" value={data.feed.indirizzo} />
			</label>
			<label class="label">
				<span>Comune</span>
				<input class="input p-2" type="text" name="citta" value={data.feed.citta} />
			</label>
			<label class="label">
				<span>Servibile</span>
				{#if data.feed.servibile === true}
					<input class="checkbox input p-2" type="checkbox" name="servibile" checked />
				{:else}
					<input class="checkbox input p-2" type="checkbox" name="servibile" />
				{/if}
			</label>
		</div>
		<label class="mt-4 label">
			<span>Note</span>
			<textarea class="input textarea p-2" name="note" value={data.feed.note} />
		</label>
		<div class="mt-4 flex justify-between">
			<div>
				<button type="submit" class="btn variant-filled-primary"
					><iconify-icon icon="mdi:edit" class="text-xl" /> Modifica
				</button>
				<a class="m-0 btn variant-filled-primary" href="/nuclei"
					><iconify-icon icon="mdi:arrow-back" class="text-xl" />Indietro</a
				>
			</div>
			<div>
				<form class="form" method="get" action="/bolle/nuovo">
					<input type="hidden" name="nucleoId" value={data.feed.id} />
					<button type="submit" class="btn variant-filled-tertiary"
						><iconify-icon icon="mdi:add" class="text-xl" /> Emetti bolla
					</button>
				</form>
			</div>
			<div>
				<form
					class="form"
					method="POST"
					action="/nuclei/{data.feed.id}?/elimina"
					on:submit|preventDefault={(e) => {
						modalStore.clear();
						modalStore.trigger(confirmDelete(e.currentTarget));
					}}
				>
					<button type="submit" class="btn variant-filled-error"
						><iconify-icon icon="mdi:trash" class="text-xl" /> Elimina
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
