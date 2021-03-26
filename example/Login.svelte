<script>
  import { push } from '../src/push';

  import { user } from './store';

  function login() {
    $user = "admin";
  }
  function logout() {
    $user = null;
  }
</script>

<div class="login">
  <h1>Login</h1>
  {#if $user === null }
  <button id="login" on:click={login}>login</button>
  {:else }
  current user: { $user } <button id="logout" on:click={logout}>logout</button>
  {/if }
</div>
