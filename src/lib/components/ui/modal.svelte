<script lang="ts">
  import { cn } from '$lib/utils';
  import type { Snippet } from 'svelte';
  import { fade, scale } from 'svelte/transition';

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
    if (closeOnOverlayClick && !(e.target as Element).closest('[data-modal-panel]')) {
      close();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (closeOnEscape && e.key === 'Escape') {
      e.preventDefault();
      close();
    }
  }

  function trapFocus(e: KeyboardEvent) {
    if (e.key !== 'Tab' || !panelElement) return;

    const focusable = panelElement.querySelectorAll<HTMLElement>(
      'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [href], [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function close() {
    onClose?.();
  }

  function motionDuration(duration: number): number {
    return typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 0
      : duration;
  }

  let panelElement = $state<HTMLDivElement>();

  $effect(() => {
    if (!open || typeof document === 'undefined') return;

    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    queueMicrotask(() => {
      panelElement
        ?.querySelector<HTMLElement>('input:not(:disabled), button:not(:disabled), [tabindex]')
        ?.focus();
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  });
</script>

{#if open}
  <div
    class="fixed inset-0 z-[9999] overflow-y-auto bg-background/75 backdrop-blur-sm"
    onclick={handleOverlayClick}
    onkeydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    aria-labelledby={title ? 'modal-title' : undefined}
    aria-label={title ? undefined : 'Dialog'}
    tabindex="-1"
    transition:fade={{ duration: motionDuration(160) }}
  >
    <div class="flex min-h-full items-center justify-center p-4 text-center">
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <div
        bind:this={panelElement}
        data-modal-panel
        class={cn(
          'relative rounded-2xl border border-foreground/10 bg-background p-6 text-left shadow-2xl outline-none',
          sizes[size]
        )}
        onclick={(e) => e.stopPropagation()}
        onkeydown={trapFocus}
        role="document"
        transition:scale={{ duration: motionDuration(220), start: 0.96, opacity: 0 }}
      >
        {#if title}
          <div class="mb-4">
            <h3 id="modal-title" class="text-lg font-semibold tracking-tight text-foreground">
              {@render title()}
            </h3>
          </div>
        {/if}

        <div class="space-y-4">
          {@render children?.()}
        </div>

        {#if footer}
          <div class="mt-6 flex justify-end gap-2">
            {@render footer()}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
