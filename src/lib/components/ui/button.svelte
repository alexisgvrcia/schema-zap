<script lang="ts">
  import { cn } from '$lib/utils';
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'default' | 'ghost' | 'icon' | 'table';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    title?: string;
    type?: 'button' | 'submit' | 'reset';
    onClick?: () => void;
    children: Snippet;
    [key: string]: any;
  }

  let {
    variant = 'default',
    size = 'md',
    disabled = false,
    title = '',
    type = 'button',
    onClick = undefined,
    children,
    ...restProps
  }: Props = $props();

  const variantClasses = {
    default: 'bg-foreground text-background hover:bg-foreground/80',
    ghost: 'bg-transparent text-foreground/70 hover:bg-primary hover:text-foreground',
    icon: 'text-foreground/65 hover:bg-primary hover:text-foreground',
    table: 'text-foreground/65 hover:bg-primary hover:text-foreground'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const baseClasses = {
    default:
      'inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg outline-none transition-[color,background-color,transform] duration-150 ease-[var(--ease-out)] active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-foreground/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 sm:min-h-10',
    ghost:
      'inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg outline-none transition-[color,background-color,transform] duration-150 ease-[var(--ease-out)] active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-foreground/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 sm:min-h-10',
    icon: 'flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg outline-none transition-[color,background-color,transform] duration-150 ease-[var(--ease-out)] active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-foreground/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 sm:min-h-10 sm:min-w-10',
    table:
      'flex cursor-pointer items-center justify-center rounded outline-none transition-[color,background-color,transform] duration-150 ease-[var(--ease-out)] active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-foreground/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100'
  };
</script>

<button
  class={cn(baseClasses[variant], variantClasses[variant], sizeClasses[size])}
  {type}
  {title}
  aria-label={title || undefined}
  {disabled}
  onclick={onClick}
  {...restProps}
>
  {@render children()}
</button>
