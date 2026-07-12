<script lang="ts">
  import { Database } from '@lucide/svelte';
  import { schema } from '$lib/stores/app';
  import Header from '$lib/components/layout/header.svelte';
  import Sidebar from '$lib/components/layout/sidebar.svelte';
  import Toolbar from '$lib/components/layout/toolbar.svelte';
  import Canvas from '$lib/components/layout/canvas.svelte';
</script>

<div class="flex h-svh flex-col bg-background text-foreground">
  <Header />

  <main class="relative flex flex-1 overflow-hidden">
    <Sidebar />

    <section class="relative flex-1 overflow-hidden bg-background">
      {#if $schema.tables.length > 0}
        <Canvas />
        <Toolbar />
      {:else}
        <div
          class="mx-auto flex h-full max-w-xl flex-col items-center justify-center p-5 text-center sm:p-8"
        >
          <div class="mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary">
            <Database class="h-6 w-6 text-foreground/60" />
          </div>
          <h1 class="mb-3 text-balance text-2xl font-semibold tracking-tight text-foreground">
            Convert SQL to a Visual Database Diagram
          </h1>
          <p class="max-w-md text-pretty text-sm leading-6 text-foreground/55">
            Paste SQL DDL statements in the sidebar to generate a database schema, inspect table
            relationships, and export a cleaner view of your data model.
          </p>
        </div>
      {/if}
    </section>
  </main>
</div>
