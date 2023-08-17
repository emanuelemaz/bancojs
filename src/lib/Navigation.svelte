<script lang="ts">
	import { page } from '$app/stores';
	import { drawerStore } from '@skeletonlabs/skeleton';

	function drawerClose(): void {
		drawerStore.close();
	}

	$: homeActive = (href: string) => (href === $page.url.pathname ? '!bg-surface-600' : '');
	$: classesActive = (href: string) => ($page.url.pathname.includes(href) && (href == "/" ? false : href != "/") ? '!bg-surface-600' : '');
</script>

<nav class="list-nav p-4 w-full">
	<ul>
		<li><a on:click={drawerClose} href="/" class="{homeActive("/")}">Home</a></li>
		<li><a on:click={drawerClose} href="/nuclei" class="{classesActive("/nuclei")}">Nuclei</a></li>
		<li><a on:click={drawerClose} href="/bolle" class="{classesActive("/bolle")}">Bolle</a></li>
		<li><a on:click={drawerClose} href="/alimenti" class="{classesActive("/alimenti")}">Alimenti</a></li>
	</ul>
</nav>
