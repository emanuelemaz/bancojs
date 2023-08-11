<script lang="ts">
	import type { PageData } from './$types';
	import 'iconify-icon';
	export let data: PageData;
</script>

<div class="container mx-auto p-8 space-y-8">
	<h1 class="h1">Bolla #{data.bolle.id}</h1>
	<form class="form" method="POST" action="/bolle/{data.bolle.id}?/modifica">
		<h2 class="h2">Beneficiario</h2>
		<input type="hidden" name="id" value={data.bolle.id} />
		<div class="grid grid-cols-2 gap-4 my-4">
			<label class="label">
				<span>Beneficiario</span>
				<select name="nucleoId" class="select" value={data.bolle.nucleoId}>
					{#each data.nuclei as nucleo}
						<option value={nucleo.id}
							>{nucleo.nome} {nucleo.cognome} ({nucleo.componenti} p., {nucleo.bambini} b.)</option
						>
					{/each}
				</select>
			</label>
			<label class="label">
				<span>Data</span>
				<input
					class="input p-2"
					type="datetime-local"
					name="data"
					value={data.bolle.data.toISOString().slice(0, -8)}
					required
				/>
			</label>
		</div>
		<label class="mt-4 label">
			<span>Note</span>
			<textarea class="input textarea p-2" name="note" value={data.bolle.note} />
		</label>
		<div class="flex justify-between my-4">
			<div>
				<button type="submit" class="btn variant-filled-primary"
					><iconify-icon icon="mdi:edit" class="text-xl" /> Modifica
				</button>
				<a class="m-0 btn variant-filled-primary" href="/bolle"
					><iconify-icon icon="mdi:arrow-back" class="text-xl" />Indietro</a
				>
			</div>
			<div>
				<form class="form" method="POST" action="/bolle/{data.bolle.id}?/elimina">
					<button type="submit" class="btn variant-filled-error">
						<iconify-icon icon="mdi:trash" class="text-xl" /> Elimina
					</button>
				</form>
			</div>
		</div>
		<div class="block mt-12">
			<h2 class="h2">Alimenti</h2>
			<p class="h4">Le modifiche vengono salvate automaticamente.</p>
			<div class="my-4">
				<form action="/bolle/{data.bolle.id}?/aggiungiAlimento" method="POST">
					<div class="grid grid-cols-2 gap-4 my-2">
						<label class="label">
							<span>Alimento</span>
							<select name="alimentoId" class="select" required>
								{#each data.allAlimenti as alimento}
									<option value={alimento.id}>
										{alimento.nome} ({alimento.unita})
										{!alimento.distribuibile ? '❌ Non servibile ❌' : ''}
										{alimento.scadenza
											? ' || Scadenza: ' + alimento.scadenza.toLocaleDateString()
											: ''}
										{alimento.note ? ' || Note: ' + alimento.note : ''}
									</option>
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
								required
							/>
						</label>
					</div>
					<label class="label">
						<span>Note</span>
						<input class="input p-2" type="text" name="note" min="0" step="0.01" />
					</label>
					<button type="submit" class="mt-4 btn variant-filled-primary"
						><iconify-icon icon="mdi:add" class="text-xl" /> Aggiungi
					</button>
				</form>
			</div>
			<div class="grid grid-cols-2 gap-4 my-4">
				{#each data.alimenti as alimento}
					<div class="block card p-4 flex justify-between">
						<div class="flex justify-between w-full">
							<div class="grid grid-cols-3 gap-4 w-full items-start">
								<div class="h-min">
									<p>Alimento</p>
									<p class="text-xl">{alimento.nome}</p>
								</div>
								<div class="h-min">
									<p>Quantità</p>
									<p class="text-xl">{alimento.quantita} {alimento.unita}</p>
								</div>
								<form action="/bolle/{data.bolle.id}?/eliminaAlimento" method="POST">
									<div>
										<input type="hidden" value={alimento.id} name="alimentoId" />
										<button type="submit" class="btn variant-filled-error w-full">
											<iconify-icon icon="mdi:trash" class="text-xl" /> Elimina
										</button>
									</div>
								</form>
								{#if alimento.note}
									<div class="col-span-3">
										<p>Note</p>
										<p class="text-xl">{alimento.note}</p>
									</div>
								{/if}
							</div>
						</div>
					</div>
				{/each}
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
