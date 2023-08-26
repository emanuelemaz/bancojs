<script lang="ts">
	import type { Alimento, Bolla, BollaAlimento, Carico, CaricoAlimento } from '@prisma/client';
	import moment from 'moment-timezone';
	export let bollaAlimento: BollaAlimento;
	export let bolla: Bolla;
	export let alimento: Alimento;
</script>

<a href="/bolle/{bolla.id}">
	<div class="card card-hover mx-auto p-4">
		<div class="grid grid-cols-3 gap-4">
			<div>
				<p>Quantità</p>
				<p class="text-xl text-red-400">
					{bollaAlimento.quantita}
					{alimento.unita}
				</p>
			</div>
			<div>
				<p>Bolla</p>
				<p class="text-xl">(#{bolla.id})</p>
			</div>
			<div>
				<p>Data</p>
				<p class="text-xl">
					{moment(bolla.data).format('DD/MM/YYYY, HH:mm:ss')}
				</p>
			</div>
		</div>
		{#if bollaAlimento.note}
			<!-- svelte-ignore a11y-invalid-attribute -->
			<a href="#"
				><div class="mt-4">
					Note <textarea class="textarea p-2" readonly>{bollaAlimento.note}</textarea>
				</div></a
			>
		{/if}
		{#if bolla.note}
			<!-- svelte-ignore a11y-invalid-attribute -->
			<a href="#"
				><div class="mt-4">
					Note <textarea class="textarea p-2" readonly>{bolla.note}</textarea>
				</div></a
			>
		{/if}
	</div>
</a>

<style>
	textarea,
	textarea:hover {
		cursor: help !important;
	}
</style>
