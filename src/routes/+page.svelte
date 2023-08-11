<div class="container mx-auto p-8 space-y-8">
	<h1 class="h1">BancoJS</h1>
	<p>Il portale gestionale delle associazioni con compiti di banco alimentare.</p>
	<div class="grid grid-cols-1 lg:!grid-cols-3">
		<a class="card p-4 m-4 flex items-center justify-center" href="/nuclei">
			<iconify-icon icon="mdi:user" class="text-6xl mr-2" />
			<p class="text-3xl">Nuclei</p>
		</a>
		<a class="card p-4 m-4 flex items-center justify-center" href="/bolle">
			<iconify-icon icon="mdi:invoice" class="text-6xl mr-2" />
			<p class="text-3xl">Bolle</p>
		</a>
		<a class="card p-4 m-4 flex items-center justify-center" href="/alimenti">
			<iconify-icon icon="mdi:food" class="text-6xl mr-2" />
			<p class="text-3xl">Alimenti</p>
		</a>
	</div>
</div>

<style>
	iconify-icon {
		@apply text-surface-600; 
	}
</style>