<script lang="ts">
  import { Download } from '@lucide/svelte';
  import { schema, canvasState } from '$lib/stores/app';

  import { toPng } from 'html-to-image';
  import { getBackground } from '$lib/utils/background';
  import Button from '$lib/components/ui/button.svelte';
  import Tooltip from '$lib/components/ui/tooltip.svelte';
  import ToggleTheme from '$lib/components/ui/toggle-theme.svelte';
  import { mode } from 'mode-watcher';
  import { cn } from '$lib/utils';
  import GithubIcon from '$lib/assets/github-icon.svelte';
  import { toast } from 'svelte-sonner';

  async function exportSchema(): Promise<void> {
    const canvas = document.querySelector('.canvas-container') as unknown as HTMLElement;

    if (!canvas) return;

    await document.fonts.ready;

    const background = getBackground($canvasState, mode.current === 'dark');

    const date = new Date();

    const dataUrl = toPng(canvas as HTMLElement, {
      skipFonts: true,
      style: background,
      filter: (node) => {
        return !node.classList?.contains('info');
      }
    });

    toast.promise(dataUrl, {
      loading: 'Generating image...',
      success: (data) => {
        const link = document.createElement('a');
        const pad = (n: number): string => n.toString().padStart(2, '0');
        const formattedDate = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}_${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`;
        link.download = `diagram-${formattedDate}.png`;
        link.href = data;
        link.click();
        return 'Downloaded successfully!';
      },
      error: 'Error generating image'
    });
  }
</script>

<header
  class={cn(
    'flex h-14 flex-shrink-0 items-center justify-between border-b px-3 sm:px-5',
    'border-foreground/10 bg-background/90 backdrop-blur-md'
  )}
>
  <div class="flex items-center gap-2 md:gap-3">
    <img src="/icon.svg" alt="" class="h-7 w-7" />
    <span class="schema-title text-base font-semibold tracking-tight md:text-lg">SchemaZap</span>
  </div>

  <div class="flex items-center gap-1 md:gap-2">
    <Tooltip content="GitHub repository" position="bottom">
      <a
        class="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-foreground/65 outline-none transition-[color,background-color,transform] duration-150 ease-[var(--ease-out)] active:scale-[0.96] hover:bg-primary hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/30 sm:min-h-10 sm:min-w-10"
        href="https://github.com/alexisgvrcia/schema-zap"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub repository"
      >
        <GithubIcon class="h-4 w-4" />
      </a>
    </Tooltip>

    <Tooltip
      content={mode.current === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      position="bottom"
    >
      <ToggleTheme />
    </Tooltip>

    <Tooltip content="Export to PNG" position="left">
      <Button
        variant="icon"
        size="sm"
        onClick={exportSchema}
        aria-label="Export to PNG"
        disabled={$schema.tables.length === 0}
      >
        <Download class="h-4 w-4" />
      </Button>
    </Tooltip>
  </div>
</header>

<style>
  .schema-title {
    color: var(--foreground);
  }

  @supports ((-webkit-background-clip: text) or (background-clip: text)) {
    .schema-title {
      background-image: linear-gradient(
        105deg,
        var(--foreground) 42%,
        var(--primary) 50%,
        var(--foreground) 58%
      );
      background-repeat: no-repeat;
      background-size: 250% 100%;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: title-shimmer 2.5s var(--ease-in-out) infinite;
    }
  }

  @keyframes title-shimmer {
    from {
      background-position: 100% center;
    }

    to {
      background-position: 0 center;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .schema-title {
      animation: none;
    }
  }
</style>
