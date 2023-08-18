<script lang="ts">
	import type { Nucleo, Bolla } from '@prisma/client';
	import moment from 'moment-timezone';
	import { get } from 'svelte/store';
	import tz from './stores';
	export let bolla: Bolla;
	export let nucleo: Nucleo;
</script>

<a class="block" href="/bolle/{bolla.id}">
	<div class="card card-hover mx-auto p-8">
		<div class="grid grid-cols-3 gap-4">
			<div>
				<p>Bolla</p>
				<p class="text-xl">(#{bolla.id})</p>
			</div>
			<div>
				<p>Beneficiario</p>
				<p class="text-xl">
					{nucleo.nome}
					{nucleo.cognome} (#{bolla.nucleoId}) || {nucleo.componenti}p, {nucleo.bambini}b
				</p>
			</div>
			<div>
				<p>Data</p>
				<p class="text-xl">
					{moment(bolla.data).format('DD/MM/YYYY, HH:mm:ss')}
				</p>
			</div>
		</div>
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
