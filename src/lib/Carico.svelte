<script lang="ts">
	import type { Carico } from '@prisma/client';
	import moment from 'moment-timezone';
	export let carico: Carico;
</script>

<a class="block" href="/carichi/{carico.id}">
	<div class="card card-hover mx-auto p-8">
		<div class="grid grid-cols-2 gap-4">
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
