<script lang="ts">
  let {
    num
  }: {
    num: number
  } = $props();
</script>
<svelte:head>
  <title>int param</title>
</svelte:head>
<main class="int-param">
  <p class="value">value: { num }</p>
  <p class="twice">twice: { num * 2 }</p>
</main>
