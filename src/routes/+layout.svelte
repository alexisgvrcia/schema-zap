<script lang="ts">
  import '$lib/styles/global.css';
  import { ModeWatcher, mode } from 'mode-watcher';
  import { Toaster } from 'svelte-sonner';

  const { children } = $props();
</script>

<ModeWatcher defaultMode="system" />
{@render children()}
<Toaster
  theme={mode.current === 'dark' ? 'dark' : 'light'}
  position="bottom-center"
  class="toaster"
  toastOptions={{
    unstyled: true,
    classes: {
      toast: `
        flex gap-2 rounded-xl border border-foreground/10 bg-background/90 p-4
        text-sm text-foreground shadow-lg backdrop-blur-md
      `,
      description: 'text-foreground/60'
    }
  }}
/>
