<script lang="ts">
	import '../app.postcss';
	import {
		AppShell,
		AppBar,
		Drawer,
		drawerStore,
		Modal,
		Toast
	} from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';

	import '@skeletonlabs/skeleton/themes/theme-gold-nouveau.css';

	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import Navigation from '$lib/Navigation.svelte';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { autoModeWatcher } from '@skeletonlabs/skeleton';
	import 'iconify-icon';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	function drawerOpen(): void {
		drawerStore.open({
			width: 'w-[280px] md:w-[480px]'
		});
	}

	function keyBinds(event: KeyboardEvent) {
		let currentRoute = $page.url.pathname
		if (currentRoute.includes("/alimenti/") && !currentRoute.includes("nuovo") && currentRoute !== "/alimenti") {
			if (event.shiftKey && event.key.toLowerCase() === "n") {
				event.preventDefault()
				goto("/alimenti/nuovo")
			}
		}
	}

	$: positionClasses = $drawerStore.open ? 'translate-x-[50%]' : '';
</script>

<svelte:window on:keydown={(e) => keyBinds(e)} />
<svelte:head
	>{@html `<script>${autoModeWatcher.toString()} autoModeWatcher();</script>`}
</svelte:head>
<Modal buttonPositive="variant-filled-warning" />
<Toast />
<Drawer>
	<Navigation />
</Drawer>
<AppShell
	slotSidebarLeft="bg-surface-500/5 lg:w-64 w-0"
	class="transition-transform {positionClasses} m-0"
>
	<svelte:fragment slot="sidebarLeft">
		<Navigation />
	</svelte:fragment>
	<AppBar
		gridColumns="grid-cols-3"
		slotDefault="place-self-center"
		slotTrail="place-content-end"
		slot="header"
	>
		<svelte:fragment slot="lead">
			<div class="flex items-center">
				<button class="lg:hidden btn btn-sm mr-4" on:click={drawerOpen}>
					<span>
						<svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
							<rect width="100" height="20" />
							<rect y="30" width="100" height="20" />
							<rect y="60" width="100" height="20" />
						</svg>
					</span>
				</button>
			</div>
		</svelte:fragment>
	</AppBar>
	<body data-theme="gold-nouveau">
		<div class="container p-10 mx-auto">
			<slot />
		</div>
	</body>
</AppShell>
