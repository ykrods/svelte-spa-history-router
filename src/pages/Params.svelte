<script lang="ts">
  let {
    params
  }: {
    params: { slug: string }
  } = $props();
</script>
<svelte:head>
  <title>Slug { params.slug }</title>
</svelte:head>
<main class="params">
  <p class="slug">slug: { params.slug }</p>
</main>
