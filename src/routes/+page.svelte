<script lang="ts">
  import { Database } from '@lucide/svelte';
  import { schema } from '$lib/stores/app';
  import Header from '$lib/components/layout/header.svelte';
  import Sidebar from '$lib/components/layout/sidebar.svelte';
  import Toolbar from '$lib/components/layout/toolbar.svelte';
  import Canvas from '$lib/components/layout/canvas.svelte';
</script>

<div class="flex h-svh flex-col bg-gray-50 dark:bg-zinc-900">
  <Header />

  <main class="flex flex-1 overflow-hidden">
    <Sidebar />

    <section class="relative flex-1 overflow-hidden bg-gray-50 dark:bg-zinc-900">
      {#if $schema.tables.length > 0}
        <Canvas />
        <Toolbar />
      {:else}
        <div class="flex h-full flex-col items-center justify-center p-8">
          <Database class="mb-4 h-16 w-16  text-gray-300 dark:text-gray-600" />
          <h1 class="mb-2 text-center text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Convert SQL to a Visual Database Diagram
          </h1>
          <p class="mb-4 max-w-md text-center text-gray-600 dark:text-gray-400">
            Paste SQL DDL statements in the sidebar to generate a database schema, inspect table
            relationships, and export a cleaner view of your data model.
          </p>
        </div>
      {/if}
    </section>
  </main>
</div>
