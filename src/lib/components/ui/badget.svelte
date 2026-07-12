<script lang="ts">
  import { cn } from '$lib/utils';

  interface Props {
    title: string;
  }

  let { title = '' }: Props = $props();
</script>

<span
  class={cn(
    'rounded border px-1.5 py-0.5 font-mono text-xs',
    'border-foreground/12 bg-primary text-foreground/70'
  )}
>
  {title}
</span>
