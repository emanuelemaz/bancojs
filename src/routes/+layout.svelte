<script>
	import { AppShell } from '@skeletonlabs/skeleton';
	import '@skeletonlabs/skeleton/themes/theme-gold-nouveau.css';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';
</script>

<AppShell slotSidebarLeft="bg-surface-500/5 w-0 md:w-52 p-4">
	<svelte:fragment slot="sidebarLeft">
		<nav class="list-nav">
			<ul>
				<li><a href="/">Home</a></li>
				<li><a href="/nuclei">Nuclei</a></li>
				<li><a href="/bolle">Bolle</a></li>
				<li><a href="/alimenti">Alimenti</a></li>
			</ul>
		</nav>
	</svelte:fragment>
	<body data-theme="gold-nouveau">
		<div class="container p-10 mx-auto">
			<slot />
		</div>
	</body>
</AppShell>
