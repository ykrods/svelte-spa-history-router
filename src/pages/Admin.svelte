<script lang="ts">
  import { link } from "../lib/index"
</script>
<svelte:head>
  <title>Admin</title>
</svelte:head>
<main class="admin">
  <h1>Admin</h1>
  <p>admin page</p>
  <a use:link href="/admin/items/1">admin item</a>
</main>
