<script lang="ts">
	import moment from 'moment-timezone';
	export let row: bolla_fix;

	</script>

<a class="block" href="/bolle/{row.id}">
	<div class="card card-hover mx-auto p-8">
		<div class="grid grid-cols-3 gap-4">
			<div>
				<p>Bolla</p>
				<p class="text-xl">(#{row.id})</p>
			</div>
			<div>
				<p>Beneficiario</p>
				<p class="text-xl">
					{row.nomeN}
					{row.cognomeN} (#{row.nucleoId}) || {row.componentiN}p, {row.bambiniN}b
				</p>
			</div>
			<div>
				<p>Data</p>
				<p class="text-xl">
					{moment(row.data.getTime() + row.data.getTimezoneOffset()*60*1000).format('DD/MM/YYYY, HH:mm:ss')}
				</p>
			</div>
		</div>
		{#if row.note}
			<!-- svelte-ignore a11y-invalid-attribute -->
			<a href="#"
				><div class="mt-4">
					Note <textarea class="textarea p-2" readonly>{row.note}</textarea>
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
