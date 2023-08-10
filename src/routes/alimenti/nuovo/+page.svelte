<script lang="ts">
	let componenti: HTMLInputElement, bambini: HTMLInputElement;
</script>

<div class="container mx-auto p-8 space-y-8">
	<h1 class="h1">Nuovo alimento</h1>
	<form class="form" method="POST" action="/alimenti/nuovo?/aggiungi">
		<div class="grid grid-cols-3 gap-4 my-4">
			<label class="label">
				<span>Nome</span>
				<input class="input p-2" type="text" name="nome" required />
			</label>
			<label class="label">
				<span>Unità</span>
				<input class="input p-2" type="text" name="unita" required />
			</label>
			<label class="label">
				<span>Data di scadenza</span>
				<input class="input p-2" type="date" name="scadenza" id="dataInput" />
			</label>
		</div>
		<div class="grid grid-cols-3 gap-4 my-4">
			<label class="label">
				<span>Distribuibile</span>
				<input class="checkbox input p-2" type="checkbox" name="distribuibile" checked />
			</label>
		</div>
		<label class="mt-4 label">
			<span>Note</span>
			<textarea class="input textarea p-2" name="note" />
		</label>
		<div class="mt-4">
			<input type="submit" class="btn variant-filled-primary" value="Aggiungi alimento" />
			<a class="ml-2 btn variant-filled-primary" href="/alimenti">Annulla</a>
		</div>
	</form>
</div>

<style>
	input[type='submit'] {
		cursor: pointer;
	}
</style>
