<script>
	import { page } from '$app/stores';
</script>

<div class="space-y-2">
	<h1 class="h1">Pagina non trovata 😕</h1>
	<p>La pagina <span class="font-mono font-bold text-xl">{$page.url.pathname}</span> non esiste.</p>
	<a href="/" class="btn variant-filled-primary">
		<iconify-icon icon="mdi:home" class="text-xl" />
		Torna alla home</a
	>
</div>
