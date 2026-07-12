<script lang="ts">
  import { toggleMode, mode } from 'mode-watcher';
  import Button from '$lib/components/ui/button.svelte';
  import { Sun, Moon } from '@lucide/svelte';
</script>

<Button
  variant="icon"
  size="sm"
  onClick={toggleMode}
  aria-label={mode.current === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
  aria-pressed={mode.current === 'dark'}
>
  <span class="relative h-4 w-4">
    <Sun
      class="absolute inset-0 h-4 w-4 transition-[opacity,filter,scale] duration-200 ease-[var(--ease-out)] {mode.current ===
      'dark'
        ? 'scale-100 opacity-100 blur-0'
        : 'scale-[0.25] opacity-0 blur-[4px]'}"
    />
    <Moon
      class="absolute inset-0 h-4 w-4 transition-[opacity,filter,scale] duration-200 ease-[var(--ease-out)] {mode.current ===
      'dark'
        ? 'scale-[0.25] opacity-0 blur-[4px]'
        : 'scale-100 opacity-100 blur-0'}"
    />
  </span>
</Button>
