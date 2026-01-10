<script lang="ts">
  let { params }: { params: Record<"itemId", string> } = $props();
</script>
<svelte:head>
  <title>Admin Item { params.itemId }</title>
</svelte:head>
<main class="admin">
  <h1>Admin Item { params.itemId }</h1>
  <p>admin item page</p>
</main>
