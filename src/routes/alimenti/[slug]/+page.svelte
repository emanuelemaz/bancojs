<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	const getUTCDate = (date: Date) => {
		const d = new Date(date);
		const utcDate = Date.UTC(
			d.getFullYear(),
			d.getMonth(),
			d.getDate(),
			d.getHours(),
			d.getMinutes(),
			d.getSeconds()
		);
		return new Date(utcDate);
	};
	function dataFix(x: Date | null) {
		if (!x) {
			return;
		}
		return getUTCDate(x).toISOString().slice(0, -14);
	}
</script>

<div class="container mx-auto p-8 space-y-8">
	<h1 class="h1">Alimento: {data.alimento.nome} (#{data.alimento.id})</h1>
	<form class="form" method="POST" action="/alimenti/{data.alimento.id}?/modifica">
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
				<input
					class="input p-2"
					type="date"
					name="scadenza"
					value={dataFix(data.alimento.scadenza)}
					id="dataInput"
				/>
			</label>
		</div>
		<div class="grid grid-cols-3 gap-4 my-4">
			<label class="label">
				<span>Distribuibile</span>
				{#if data.alimento.distribuibile === true}
					<input class="checkbox input p-2" type="checkbox" name="distribuibile" checked />
				{:else}
					<input class="checkbox input p-2" type="checkbox" name="distribuibile" />
				{/if}
			</label>
		</div>
		<label class="mt-4 label">
			<span>Note</span>
			<textarea class="input textarea p-2" name="note" value={data.alimento.note} />
		</label>
		<div class="mt-4">
			<div class="float-left">
				<input type="submit" class="btn variant-filled-primary" value="Modifica alimento" />
				<a class="ml-2 btn variant-filled-primary" href="/alimenti">Annulla</a>
			</div>
			<div class="float-right">
				<form class="form" method="POST" action="/alimenti/{data.alimento.id}?/elimina">
					<input type="submit" class="btn variant-filled-error" value="Elimina alimento" />
				</form>
			</div>
		</div>
	</form>
</div>

<style>
	input[type='submit'] {
		cursor: pointer;
	}
	@media print {
		.btn {
			display: none;
		}
	}
</style>
