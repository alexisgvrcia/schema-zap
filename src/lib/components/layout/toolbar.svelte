<script lang="ts">
  import { RotateCcw, ZoomIn, ZoomOut, Tag } from '@lucide/svelte';
  import { canvasState } from '$lib/stores/app';
  import { showBadgets } from '$lib/stores/ui';
  import Button from '$lib/components/ui/button.svelte';
  import { cn } from '$lib/utils';

  function resetCanvas(): void {
    canvasState.set({
      zoom: 1,
      panX: 0,
      panY: 0,
      selectedTable: undefined,
      draggedTable: undefined
    });
  }

  function zoomIn(): void {
    const newZoom = Math.min($canvasState.zoom * 1.2, 3);
    canvasState.set({ ...$canvasState, zoom: newZoom });
  }

  function zoomOut(): void {
    const newZoom = Math.max($canvasState.zoom / 1.2, 0.1);
    canvasState.set({ ...$canvasState, zoom: newZoom });
  }

  function toggleBadgets(): void {
    showBadgets.set(!$showBadgets);
  }

  const zoomPercentage = $derived(Math.round($canvasState.zoom * 100));
</script>

<div
  class="absolute bottom-3 left-1/2 z-[1000] max-w-[calc(100vw-1rem)] -translate-x-1/2 rounded-xl border border-foreground/10 bg-background/85 p-1 shadow-xl backdrop-blur-md sm:bottom-4"
>
  <div class="flex items-center gap-0.5 sm:gap-1">
    <Button variant="icon" size="md" onClick={resetCanvas} title="Reset view">
      <RotateCcw class="h-4 w-4 sm:h-5 sm:w-5" />
    </Button>

    <div class="mx-1 h-6 w-px bg-foreground/10"></div>

    <Button
      variant="icon"
      size="md"
      onClick={zoomOut}
      title="Zoom out"
      disabled={$canvasState.zoom <= 0.1}
    >
      <ZoomOut class="h-4 w-4 sm:h-5 sm:w-5" />
    </Button>

    <div
      class="flex h-11 min-w-14 items-center justify-center rounded-lg px-2 text-xs font-medium text-foreground/65 tabular-nums sm:h-10 sm:px-3"
    >
      {zoomPercentage}%
    </div>

    <Button
      variant="icon"
      size="md"
      onClick={zoomIn}
      title="Zoom in"
      disabled={$canvasState.zoom >= 3}
    >
      <ZoomIn class="h-4 w-4 sm:h-5 sm:w-5" />
    </Button>

    <div class="mx-1 h-6 w-px bg-foreground/10"></div>

    <Button
      onClick={toggleBadgets}
      title={$showBadgets ? 'Hide badges' : 'Show badges'}
      class={cn(
        'flex h-11 w-11 items-center justify-center rounded-lg transition-[color,background-color,transform] duration-150 sm:h-10 sm:w-10',
        $showBadgets
          ? 'bg-foreground text-background'
          : 'bg-transparent text-foreground/50 hover:bg-primary hover:text-foreground'
      )}
    >
      <Tag class="h-4 w-4 sm:h-5 sm:w-5" />
    </Button>
  </div>
</div>
