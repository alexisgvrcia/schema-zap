<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
    children: Snippet;
  }

  let { content, position = 'top', children }: Props = $props();
  let trigger = $state<HTMLSpanElement>();
  let isOpen = $state(false);
  let coordinates = $state({ x: 0, y: 0 });

  function updatePosition() {
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();

    if (position === 'top') coordinates = { x: rect.left + rect.width / 2, y: rect.top - 8 };
    if (position === 'bottom') coordinates = { x: rect.left + rect.width / 2, y: rect.bottom + 8 };
    if (position === 'left') coordinates = { x: rect.left - 8, y: rect.top + rect.height / 2 };
    if (position === 'right') coordinates = { x: rect.right + 8, y: rect.top + rect.height / 2 };
  }

  function show() {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    updatePosition();
    isOpen = true;
  }

  function portal(node: HTMLElement) {
    document.body.appendChild(node);

    return {
      destroy() {
        node.remove();
      }
    };
  }

  $effect(() => {
    if (!isOpen) return;

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  });
</script>

<span
  bind:this={trigger}
  role="group"
  class="inline-flex"
  onpointerenter={show}
  onpointerleave={() => (isOpen = false)}
  onfocusin={show}
  onfocusout={() => (isOpen = false)}
>
  {@render children()}
</span>

{#if isOpen}
  <span
    use:portal
    role="tooltip"
    data-position={position}
    style="left: {coordinates.x}px; top: {coordinates.y}px;"
    class="tooltip-content pointer-events-none fixed z-[3000] w-max max-w-48 rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-lg transition-[opacity,transform] duration-150 ease-[var(--ease-out)]"
  >
    {content}
  </span>
{/if}

<style>
  [data-position='top'] {
    transform: translate(-50%, -100%);
  }

  [data-position='bottom'] {
    transform: translateX(-50%);
  }

  [data-position='left'] {
    transform: translate(-100%, -50%);
  }

  [data-position='right'] {
    transform: translateY(-50%);
  }

  @media (prefers-reduced-motion: reduce) {
    .tooltip-content {
      transition: none;
    }
  }

  @media (hover: none), (pointer: coarse) {
    .tooltip-content {
      display: none;
    }
  }
</style>
