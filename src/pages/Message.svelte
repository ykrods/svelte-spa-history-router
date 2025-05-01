<script lang="ts">
  let { message = "" }: { message: string } = $props()
</script>
<svelte:head>
  <title>Message</title>
</svelte:head>
<main class="message">
  {#if message}<p>{message}</p>{/if}
</main>
