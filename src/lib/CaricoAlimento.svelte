<script lang="ts">
	import type { Alimento, Carico, CaricoAlimento } from '@prisma/client';
	import moment from 'moment-timezone';
	export let caricoAlimento: CaricoAlimento;
	export let carico: Carico;
	export let alimento: Alimento;
</script>

<a href="/carichi/{carico.id}">
	<div class="card card-hover mx-auto p-4">
		<div class="grid grid-cols-3 gap-4">
			<div>
				<p>Quantità</p>
				<p class="text-xl text-green-400">
					{caricoAlimento.quantita}
					{alimento.unita}
				</p>
			</div>
			<div>
				<p>Carico</p>
				<p class="text-xl">(#{carico.id})</p>
			</div>
			<div>
				<p>Data</p>
				<p class="text-xl">
					{moment(carico.data).format('DD/MM/YYYY, HH:mm:ss')}
				</p>
			</div>
		</div>
		{#if caricoAlimento.note}
			<!-- svelte-ignore a11y-invalid-attribute -->
			<a href="#"
				><div class="mt-4">
					Note <textarea class="textarea p-2" readonly>{caricoAlimento.note}</textarea>
				</div></a
			>
		{/if}
		{#if carico.note}
			<!-- svelte-ignore a11y-invalid-attribute -->
			<a href="#"
				><div class="mt-4">
					Note <textarea class="textarea p-2" readonly>{carico.note}</textarea>
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
