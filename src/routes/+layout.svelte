<script lang="ts">
	import '../app.postcss';
	import {
		AppShell,
		AppBar,
		Drawer,
		drawerStore,
		LightSwitch,
		Modal,
		modalStore
	} from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import '@skeletonlabs/skeleton/themes/theme-gold-nouveau.css';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import Navigation from '$lib/Navigation.svelte';
	import { storePopup } from '@skeletonlabs/skeleton';
	
	
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	function drawerOpen(): void {
		drawerStore.open({});
	}

	import { autoModeWatcher } from '@skeletonlabs/skeleton';
</script>

<svelte:head
	>{@html `<script>${autoModeWatcher.toString()} autoModeWatcher();</script>`}</svelte:head
>

<Modal buttonPositive="variant-filled-warning" />
<Drawer class="g:w-0 w-64 "><Navigation /></Drawer>
<AppShell slotSidebarLeft="bg-surface-500/5 w-0 lg:w-64 p-0 lg:p-4">
	<svelte:fragment slot="sidebarLeft">
		<Navigation />
	</svelte:fragment>
	<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
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
		<svelte:fragment slot="trail">
			<LightSwitch class="self-right" />
		</svelte:fragment>
	</AppBar>
	<body data-theme="gold-nouveau">
		<div class="container p-10 mx-auto">
			<slot />
		</div>
	</body>
</AppShell>
