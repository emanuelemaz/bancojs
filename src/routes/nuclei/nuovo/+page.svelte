<script lang="ts">
	let componenti: HTMLInputElement, bambini: HTMLInputElement;

	function maxBambini() {
		bambini.max = componenti.value;
	}
</script>

<div class="container mx-auto p-8 space-y-8">
	<h1 class="h1">Nuovo nucleo</h1>
	<form class="form" method="POST" action="/nuclei/nuovo?/aggiungi">
		<div class="grid grid-cols-2 gap-4 my-4">
			<label class="label">
				<span>Nome</span>
				<input class="input p-2" type="text" name="nome" required />
			</label>
			<label class="label">
				<span>Cognome</span>
				<input class="input p-2" type="text" name="cognome" required />
			</label>
		</div>
		<div class="grid grid-cols-3 gap-4 my-4">
			<label class="label">
				<span>ISEE (€)</span>
				<input class="input p-2" type="number" name="isee" min="0" step="0.01" />
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
					required
				/>
			</label>
			<label class="label">
				<span>(di cui bambini)</span>
				<input
					bind:this={bambini}
					class="input p-2"
					type="number"
					name="bambini"
					min="0"
					max="0"
					step="1"
					required
				/>
			</label>
			<label class="label">
				<span>Cellulare</span>
				<input class="input p-2" type="text" name="cellulare" />
			</label>
			<label class="label">
				<span>Indirizzo</span>
				<input class="input p-2" type="text" name="indirizzo" />
			</label>
			<label class="label">
				<span>Comune</span>
				<input class="input p-2" type="text" name="citta" />
			</label>
			<label class="label">
				<span>Servibile</span>
				<input class="checkbox input p-2" type="checkbox" name="servibile" checked />
			</label>
		</div>
		<label class="mt-4 label">
			<span>Note</span>
			<textarea class="input textarea p-2" name="note" />
		</label>
		<div class="mt-4">
			<input type="submit" class="btn variant-filled-primary" value="Aggiungi nucleo" />
			<a class="ml-2 btn variant-filled-primary" href="/nuclei">Annulla</a>
		</div>
	</form>
</div>

<style>
	input[type='submit'] {
		cursor: pointer;
	}
</style>
