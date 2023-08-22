<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Alimento, BollaAlimento } from '@prisma/client';
	import { SlideToggle, toastStore } from '@skeletonlabs/skeleton';
	import { modalStore } from '@skeletonlabs/skeleton';
	import moment from 'moment';

	export let bollaAlimento: BollaAlimento;
	export let allAlimenti: Alimento[];

	let showNoDist: boolean = false;
	$: showNoDist;
</script>

<div class="card p-8 w-modal shadow-xl space-y-4">
	<h2 class="h2">Modifica alimento</h2>
	<div class="mb-4">
		<SlideToggle name="distSlide" bind:checked={showNoDist}
			>Mostra alimenti non distribuibili</SlideToggle
		>
	</div>
	<form
		action="/bolle/{bollaAlimento.bollaId}?/updateAlimento"
		method="post"
		use:enhance={async ({ formElement, formData, action, cancel, submitter }) => {
			return async ({ update, result }) => {
				modalStore.close();
				if (result.type !== 'error' && result.type !== 'failure') {
					await update();
					toastStore.trigger({
						message: 'Alimento modificato con successo.',
						background: 'variant-filled-success',
						timeout: 2500
					});
				}
			};
		}}
	>
		<input type="hidden" name="bollaAlimentoId" value={bollaAlimento.id} />
		<div class="grid grid-cols-2 gap-4 my-2">
			<label class="label">
				<span>Alimento</span>
				<select name="alimentoId" class="select" value={bollaAlimento.alimentoId} required>
					{#each allAlimenti as alimento}
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
					value={bollaAlimento.quantita}
					required
				/>
			</label>
		</div>
		<label class="label">
			<span>Note</span>
			<input
				class="input p-2"
				type="text"
				name="note"
				min="0"
				step="0.01"
				value={bollaAlimento.note}
			/>
		</label>
		<div class="flex justify-end gap-2">
			<button
				type="button"
				on:click={() => modalStore.close()}
				class="btn variant-ghost-surface mt-4"
			>
				Annulla
			</button>
			<button type="submit" class="btn variant-filled-warning mt-4"> Modifica </button>
		</div>
	</form>
</div>
