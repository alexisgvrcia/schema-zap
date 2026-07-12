<script lang="ts">
  import { cn } from '$lib/utils';
  import { onMount } from 'svelte';
  import { Settings } from '@lucide/svelte';

  interface MenuOption {
    label: string;
    icon?: any;
    iconClass?: string;
    disabled?: boolean;
    onClick?: () => void;
  }

  interface Props {
    options: MenuOption[];
    disabled?: boolean;
    id?: string;
    className?: string;
    panelClass?: string;
    optionClass?: string;
    maxHeight?: string;
  }

  let {
    options,
    disabled = false,
    id = '',
    className = '',
    panelClass = '',
    optionClass = '',
    maxHeight = 'max-h-64'
  }: Props = $props();

  let isOpen = $state(false);
  let triggerElement = $state<HTMLButtonElement>();

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (
      triggerElement &&
      !triggerElement.contains(target) &&
      !target.closest('[data-menu-panel]')
    ) {
      isOpen = false;
    }
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });

  function toggle() {
    if (disabled) return;
    isOpen = !isOpen;
  }
</script>

<div class="relative {className}">
  <button
    bind:this={triggerElement}
    {id}
    type="button"
    class={cn(
      'flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-foreground/10 bg-primary p-2 text-sm text-foreground outline-none transition-[border-color,background-color,transform] duration-150 ease-[var(--ease-out)] active:scale-[0.96] hover:border-foreground/20 focus-visible:ring-2 focus-visible:ring-foreground/20',
      disabled && 'cursor-not-allowed opacity-40 active:scale-100'
    )}
    {disabled}
    onclick={toggle}
    aria-haspopup="true"
    aria-expanded={isOpen}
    aria-label="Menu"
  >
    <Settings class="h-4 w-4" />
  </button>

  {#if isOpen}
    <div
      data-menu-panel
      class={cn(
        'menu-panel absolute top-full right-0 z-50 mt-1 overflow-y-auto rounded-xl border border-foreground/10 bg-background p-1 shadow-xl',
        maxHeight,
        panelClass
      )}
    >
      <div role="menu" aria-label="Menu options">
        {#each options as option (option.label)}
          <button
            type="button"
            class={cn(
              'flex min-h-10 w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-foreground outline-none transition-colors duration-150 hover:bg-primary focus-visible:bg-primary',
              option.disabled && 'cursor-not-allowed opacity-40 hover:bg-transparent',
              optionClass
            )}
            onclick={() => {
              if (!option.disabled) {
                option.onClick?.();
                isOpen = false;
              }
            }}
            disabled={option.disabled}
            role="menuitem"
          >
            {#if option.icon}
              {@const IconComponent = option.icon}
              <IconComponent class="h-4 w-4 flex-shrink-0 {option.iconClass || ''}" />
            {/if}
            <span class="truncate font-medium">{option.label}</span>
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .menu-panel {
    transform-origin: top right;
    animation: menu-in 180ms var(--ease-out);
  }

  @keyframes menu-in {
    from {
      opacity: 0;
      transform: translateY(-4px) scale(0.97);
    }
  }
</style>
