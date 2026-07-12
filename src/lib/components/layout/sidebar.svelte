<script lang="ts">
  import { showSidebar } from '$lib/stores/ui';
  import InputEditor from '$lib/components/input-editor.svelte';
  import VisualEditor from '$lib/components/visual-editor.svelte';
  import { Code, Settings, ChevronLeft, ChevronRight } from '@lucide/svelte';
  import Button from '$lib/components/ui/button.svelte';
  import { cn } from '$lib/utils';

  let activeTab = $state('sql');

  function setActiveTab(tab: string): void {
    activeTab = tab;
  }

  function toggleSidebar(): void {
    showSidebar.set(!$showSidebar);
  }
</script>

{#if $showSidebar}
  <aside
    class="absolute inset-y-0 left-0 z-[2000] w-full flex-shrink-0 border-r border-foreground/10 bg-background sm:relative sm:z-auto sm:w-80 md:w-96"
  >
    <Button
      onClick={toggleSidebar}
      variant="icon"
      class="absolute top-1/2 right-2 z-50 h-8 min-h-8 w-8 min-w-8 -translate-y-1/2 rounded-full border border-foreground/10 bg-background shadow-md sm:-right-3 sm:h-6 sm:min-h-6 sm:w-6 sm:min-w-6"
      title="Hide sidebar"
    >
      <ChevronLeft class="h-4 w-4 text-foreground/60" />
    </Button>

    <div class="flex h-full flex-col">
      <nav class="flex border-b border-foreground/10 bg-background" aria-label="Editor modes">
        <Button
          variant="ghost"
          onClick={() => setActiveTab('sql')}
          class={cn(
            'flex-1 cursor-pointer rounded-none border-b px-4 py-3 text-xs font-medium transition-colors duration-150',
            activeTab === 'sql'
              ? 'border-foreground bg-primary text-foreground'
              : 'border-transparent text-foreground/45 hover:bg-primary hover:text-foreground/75'
          )}
        >
          <div class="flex items-center justify-center gap-2">
            <Code class="h-4 w-4" />
            <span>SQL Editor</span>
          </div>
        </Button>
        <Button
          variant="ghost"
          onClick={() => setActiveTab('visual')}
          class={cn(
            'flex-1 cursor-pointer rounded-none border-b px-4 py-3 text-xs font-medium transition-colors duration-150',
            activeTab === 'visual'
              ? 'border-foreground bg-primary text-foreground'
              : 'border-transparent text-foreground/45 hover:bg-primary hover:text-foreground/75'
          )}
        >
          <div class="flex items-center justify-center gap-2">
            <Settings class="h-4 w-4" />
            <span>Visual Editor</span>
          </div>
        </Button>
      </nav>

      <div class="h-full flex-1 overflow-hidden bg-background p-3 sm:p-4">
        {#if activeTab === 'sql'}
          <InputEditor />
        {:else if activeTab === 'visual'}
          <VisualEditor />
        {/if}
      </div>
    </div>
  </aside>
{:else}
  <div class="relative z-[2000] sm:z-auto">
    <div class="h-full w-3 bg-background sm:w-6"></div>
    <Button
      onClick={toggleSidebar}
      variant="icon"
      class="absolute top-1/2 -right-3 z-50 h-6 min-h-6 w-6 min-w-6 -translate-y-1/2 rounded-full border border-foreground/10 bg-background shadow-md"
      title="Show sidebar"
    >
      <ChevronRight class="h-4 w-4 text-foreground/60" />
    </Button>
  </div>
{/if}
