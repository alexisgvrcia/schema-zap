<script lang="ts">
  import { cn } from '$lib/utils';
  import type { Snippet } from 'svelte';

  interface Props {
    open: boolean;
    size?: 'sm' | 'md' | 'lg';
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
    onClose?: () => void;
    title?: Snippet;
    children?: Snippet;
    footer?: Snippet;
  }

  let {
    open = false,
    size = 'md',
    closeOnOverlayClick = true,
    closeOnEscape = true,
    onClose = undefined,
    title,
    children,
    footer
  }: Props = $props();

  const sizes = {
    sm: 'w-full max-w-sm',
    md: 'w-full max-w-md',
    lg: 'w-full max-w-2xl'
  };

  function handleOverlayClick(e: MouseEvent) {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      close();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (closeOnEscape && e.key === 'Escape') {
      close();
    }
  }

  function close() {
    onClose?.();
  }

  $effect(() => {
    if (open && typeof window !== 'undefined') {
      document.body.style.overflow = 'hidden';
    } else if (typeof window !== 'undefined') {
      document.body.style.overflow = '';
    }
  });
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <div
    class="fixed inset-0 z-[9999] overflow-y-auto bg-black/50 backdrop-blur-sm"
    onclick={handleOverlayClick}
    onkeydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <div
        class={cn(
          'relative transform rounded-lg bg-white p-6 text-left shadow-2xl transition-all dark:bg-[#111111]',
          sizes[size]
        )}
        onclick={(e) => e.stopPropagation()}
        onkeydown={(e) => e.stopPropagation()}
        role="document"
      >
        {#if title}
          <div class="mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
              {@render title()}
            </h3>
          </div>
        {/if}

        <div class="space-y-4">
          {@render children?.()}
        </div>

        {#if footer}
          <div class="mt-6 flex justify-end gap-3">
            {@render footer()}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
