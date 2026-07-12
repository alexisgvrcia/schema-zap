<script lang="ts">
  import { Check, X, Trash2 } from '@lucide/svelte';
  import Button from './button.svelte';
  import Tooltip from './tooltip.svelte';

  interface Props {
    variant?: 'default' | 'ghost' | 'icon';
    size?: 'sm' | 'md' | 'lg';
    title?: string;
    disabled?: boolean;
    onConfirm?: () => void;
    [key: string]: any;
  }

  let {
    variant = 'icon',
    size = 'sm',
    title = 'delete',
    disabled = false,
    onConfirm = undefined,
    ...restProps
  }: Props = $props();

  let showConfirmation = $state(false);

  function handleDelete() {
    if (disabled) return;
    showConfirmation = true;
  }

  function handleConfirm() {
    showConfirmation = false;
    onConfirm?.();
  }

  function handleCancel() {
    showConfirmation = false;
  }
</script>

{#if showConfirmation}
  <div class="flex items-center gap-1">
    <Tooltip content="Confirm delete" position="bottom">
      <Button variant="icon" size="sm" aria-label="Confirm delete" onClick={handleConfirm}>
        <Check class="h-4 w-4" />
      </Button>
    </Tooltip>
    <Tooltip content="Cancel" position="bottom">
      <Button variant="icon" size="sm" aria-label="Cancel" onClick={handleCancel}>
        <X class="h-4 w-4" />
      </Button>
    </Tooltip>
  </div>
{:else}
  <Tooltip content={title} position="bottom">
    <Button {variant} {size} aria-label={title} {disabled} onClick={handleDelete} {...restProps}>
      <Trash2 class="h-4 w-4" />
    </Button>
  </Tooltip>
{/if}
