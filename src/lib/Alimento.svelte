<script lang="ts">
    export let row: alimento_fix;
</script>

<a class="block" href="/alimenti/{row.id}">
    <div class="card card-hover mx-auto p-8">
        {#if !row.distribuibile}
            <div class="text-xl mb-2 chip variant-filled-surface">❌ Non distribuibile ❌</div>
        {/if}
        <div class="grid grid-cols-3 gap-4">
            <div>
                <p>Nome</p>
                <p class="text-xl">
                    {row.nome} (#{row.id})
                </p>
            </div>
            <div>
                <p>Unità</p>
                <p class="text-xl">
                    {row.unita}
                </p>
            </div>
            <div>
                <p>Prima scadenza</p>
                <p class="text-xl">
                    {#if row.scadenza}
                        {row.scadenza?.toLocaleDateString('it-IT', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        })}
                    {:else}
                        -
                    {/if}
                </p>
            </div>
        </div>
        {#if row.note}
            <!-- svelte-ignore a11y-invalid-attribute -->
            <a href="#"
                ><div class="mt-4">
                    Note <textarea class="textarea p-2" readonly>{row.note}</textarea>
                </div></a
            >
        {/if}
    </div>
</a>

<style>
	textarea,
	textarea:hover {
		cursor: help !important;
	}
</style>
