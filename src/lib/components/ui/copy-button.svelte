<script lang="ts">
  import { Check, Copy } from '@lucide/svelte';
  import Button from './button.svelte';
  import Tooltip from './tooltip.svelte';
  import { toast } from 'svelte-sonner';

  interface Props {
    text: string;
    variant?: 'default' | 'ghost' | 'icon';
    size?: 'sm' | 'md' | 'lg';
    title?: string;
    disabled?: boolean;
    [key: string]: any;
  }

  let {
    text = '',
    variant = 'icon',
    size = 'sm',
    title = 'Copy to clipboard',
    disabled = false,
    ...restProps
  }: Props = $props();

  let isCopied = $state(false);

  async function copyToClipboard() {
    if (!text.trim() || disabled) return;

    toast.promise(navigator.clipboard.writeText(text), {
      loading: 'Copying to clipboard...',
      success: () => {
        isCopied = true;
        setTimeout(() => {
          isCopied = false;
        }, 2000);
        return 'Copied to clipboard!';
      },
      error: 'Failed to copy to clipboard.'
    });
  }
</script>

<Tooltip content={title} position="bottom">
  <Button {variant} {size} aria-label={title} {disabled} onClick={copyToClipboard} {...restProps}>
    <span class="relative h-4 w-4">
      <Check
        class="absolute inset-0 h-4 w-4 transition-[opacity,filter,scale] duration-200 ease-[var(--ease-out)] {isCopied
          ? 'scale-100 opacity-100 blur-0'
          : 'scale-[0.25] opacity-0 blur-[4px]'}"
      />
      <Copy
        class="absolute inset-0 h-4 w-4 transition-[opacity,filter,scale] duration-200 ease-[var(--ease-out)] {isCopied
          ? 'scale-[0.25] opacity-0 blur-[4px]'
          : 'scale-100 opacity-100 blur-0'}"
      />
    </span>
  </Button>
</Tooltip>
