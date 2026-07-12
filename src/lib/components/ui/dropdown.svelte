<script lang="ts">
  import { cn } from '$lib/utils';
  import { onMount } from 'svelte';

  interface DropdownOption {
    value: string;
    label: string;
    icon?: any;
    iconClass?: string;
    disabled?: boolean;
  }

  interface Props {
    options: DropdownOption[];
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    id?: string;
    className?: string;
    dropdownClass?: string;
    optionClass?: string;
    maxHeight?: string;
    onselect?: (detail: { value: string; option: DropdownOption }) => void;
    onopen?: () => void;
    onclose?: () => void;
  }

  let {
    options,
    value = $bindable(''),
    placeholder = 'Select an option',
    disabled = false,
    id = '',
    className = '',
    dropdownClass = '',
    optionClass = '',
    maxHeight = 'max-h-64',
    onselect,
    onopen,
    onclose
  }: Props = $props();

  let isOpen = $state(false);
  let triggerElement = $state<HTMLButtonElement>();

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (
      triggerElement &&
      !triggerElement.contains(target) &&
      !target.closest('[data-dropdown-content]')
    ) {
      if (isOpen) {
        isOpen = false;
        onclose?.();
      }
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
    if (isOpen) {
      onopen?.();
    } else {
      onclose?.();
    }
  }

  function handleSelect(option: DropdownOption) {
    if (option.disabled) return;
    value = option.value;
    isOpen = false;
    onselect?.({ value: option.value, option });
    onclose?.();
  }

  function handleTriggerKeyDown(event: KeyboardEvent) {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        toggle();
        break;
      case 'Escape':
        if (isOpen) {
          event.preventDefault();
          isOpen = false;
          onclose?.();
        }
        break;
      case 'ArrowDown':
        if (!isOpen) {
          event.preventDefault();
          isOpen = true;
          onopen?.();
        }
        break;
      case 'ArrowUp':
        if (isOpen) {
          event.preventDefault();
          isOpen = false;
          onclose?.();
        }
        break;
    }
  }

  function handleOptionKeyDown(event: KeyboardEvent, option: DropdownOption) {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleSelect(option);
        break;
      case 'Escape':
        event.preventDefault();
        isOpen = false;
        onclose?.();
        triggerElement?.focus();
        break;
    }
  }

  const selectedOption = $derived(options.find((opt) => opt.value === value));
  const displayText = $derived(selectedOption?.label || placeholder);
</script>

<div class="relative {className}">
  <button
    bind:this={triggerElement}
    {id}
    type="button"
    class={cn(
      'flex min-h-10 w-full cursor-pointer items-center justify-between rounded-lg border border-foreground/12 bg-background px-3 py-2 text-sm text-foreground outline-none transition-[border-color,box-shadow,transform] duration-150 ease-[var(--ease-out)] active:scale-[0.99] hover:border-foreground/25 focus-visible:border-foreground/30 focus-visible:ring-2 focus-visible:ring-foreground/15',
      disabled && 'cursor-not-allowed opacity-40 active:scale-100'
    )}
    {disabled}
    onclick={toggle}
    onkeydown={handleTriggerKeyDown}
    aria-haspopup="listbox"
    aria-expanded={isOpen}
    aria-label="Select option"
  >
    <div class="flex min-w-0 flex-1 items-center gap-3">
      {#if selectedOption?.icon}
        {@const IconComponent = selectedOption.icon}
        <IconComponent class="h-4 w-4 flex-shrink-0 {selectedOption.iconClass || ''}" />
      {/if}
      <span class="truncate text-left font-medium">
        {displayText}
      </span>
    </div>

    <svg
      class="h-4 w-4 flex-shrink-0 text-foreground/45 transition-transform duration-180 ease-[var(--ease-out)] {isOpen
        ? 'rotate-180'
        : ''}"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  {#if isOpen}
    <div
      data-dropdown-content
      class={cn(
        'dropdown-panel absolute top-full right-0 left-0 z-50 mt-1 overflow-y-auto rounded-xl border border-foreground/10 bg-background p-1 shadow-xl',
        maxHeight,
        dropdownClass
      )}
    >
      <div role="listbox" aria-label="Options">
        {#each options as option (option.value)}
          <button
            type="button"
            class={cn(
              'flex min-h-10 w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-foreground outline-none transition-colors duration-150 hover:bg-primary focus-visible:bg-primary',
              option.value === value && 'bg-primary',
              option.disabled && 'cursor-not-allowed opacity-40 hover:bg-transparent',
              optionClass
            )}
            disabled={option.disabled}
            onclick={() => handleSelect(option)}
            onkeydown={(e) => handleOptionKeyDown(e, option)}
            role="option"
            aria-selected={option.value === value}
          >
            <div class="flex min-w-0 flex-1 items-center gap-3">
              {#if option.icon}
                {@const IconComponent = option.icon}
                <IconComponent class="h-4 w-4 flex-shrink-0 {option.iconClass || ''}" />
              {/if}
              <span class="truncate font-medium">
                {option.label}
              </span>
            </div>
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .dropdown-panel {
    transform-origin: top center;
    animation: dropdown-in 180ms var(--ease-out);
  }

  @keyframes dropdown-in {
    from {
      opacity: 0;
      transform: translateY(-4px) scale(0.98);
    }
  }
</style>
