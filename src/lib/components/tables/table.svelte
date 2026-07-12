<script lang="ts">
  import type { Table, Column } from '$lib/types';
  import {
    Table as TableIcon,
    KeyRound,
    Link,
    Hash,
    Type,
    Calendar,
    FileText,
    Binary,
    Database,
    Image,
    Mail,
    Globe,
    CheckSquare,
    DollarSign,
    Clock,
    MapPin,
    Palette,
    Shield,
    Zap,
    Package,
    Tag,
    AtSign
  } from '@lucide/svelte';
  import { canvasState } from '$lib/stores/app';
  import { showBadgets } from '$lib/stores/ui';
  import { cn } from '$lib/utils';
  import Badget from '$lib/components/ui/badget.svelte';
  import { getColumnBadges } from '$lib/utils/canvas';

  interface Props {
    table: Table;
  }

  const { table }: Props = $props();

  let box: HTMLDivElement;

  const isSelected = $derived($canvasState.selectedTable === table.name);
  const isDragging = $derived($canvasState.draggedTable === table.name);

  function getColumnTypeIcon(column: Column) {
    const type = column.type.toLowerCase();
    const name = column.name.toLowerCase();

    if (column.primaryKey) return KeyRound;
    if (column.foreignKey) return Link;

    if (type.includes('bool') || type.includes('bit')) return CheckSquare;

    if (type.includes('json') || type.includes('jsonb')) return Package;

    if (
      type.includes('blob') ||
      type.includes('binary') ||
      type.includes('varbinary') ||
      type.includes('bytea')
    )
      return Binary;

    if (type.includes('uuid') || type.includes('guid')) return Shield;

    if (type.includes('serial') || type.includes('autoincrement')) return Zap;
    if (type.includes('decimal') || type.includes('numeric') || type.includes('money'))
      return DollarSign;
    if (type.includes('float') || type.includes('double') || type.includes('real')) return Hash;
    if (
      type.includes('int') ||
      type.includes('number') ||
      type.includes('bigint') ||
      type.includes('smallint') ||
      type.includes('tinyint')
    )
      return Hash;

    if (type.includes('timestamp') || type.includes('datetime')) return Clock;
    if (type.includes('date')) return Calendar;
    if (type.includes('time')) return Clock;

    if (name.includes('email') || name.includes('mail')) return Mail;
    if (name.includes('url') || name.includes('website') || name.includes('link')) return Globe;
    if (name.includes('color') || name.includes('colour')) return Palette;
    if (name.includes('address') || name.includes('location') || name.includes('geo'))
      return MapPin;
    if (name.includes('tag') || name.includes('label') || name.includes('category')) return Tag;
    if (name.includes('username') || name.includes('user_name')) return AtSign;
    if (
      name.includes('image') ||
      name.includes('photo') ||
      name.includes('picture') ||
      name.includes('avatar')
    )
      return Image;

    if (
      type.includes('text') ||
      type.includes('clob') ||
      type.includes('longtext') ||
      type.includes('mediumtext')
    )
      return FileText;
    if (
      type.includes('varchar') ||
      type.includes('char') ||
      type.includes('nvarchar') ||
      type.includes('nchar')
    )
      return FileText;

    if (type.includes('enum') || type.includes('set')) return Database;

    return Type;
  }

  function formatColumnType(type: string): string {
    if (type.length > 20) {
      return type.substring(0, 17) + '...';
    }
    return type;
  }
</script>

<div
  id="table-{table.name.toLowerCase()}"
  class={cn(
    'table-node max-w-96 min-w-[290px] rounded-xl border bg-background/95 select-none',
    isDragging && 'dragging',
    !isSelected && !isDragging && 'border-foreground/10 shadow-lg',
    isSelected && 'border-foreground/30 shadow-none'
  )}
  style="transform: {isDragging
    ? 'translate3d(0, 0, 0) rotate(1deg) scale(1.05)'
    : 'translate3d(0, 0, 0)'};
       z-index: {isDragging ? '1000' : isSelected ? '10' : '1'};
       will-change: transform;
       contain: layout style paint;
       backface-visibility: hidden;
       transform-style: preserve-3d;"
  bind:this={box}
>
  {#if isSelected}
    <div
      class="pointer-events-none absolute inset-0 rounded-xl border-2 border-foreground/20"
    ></div>
  {/if}
  <div
    class={cn(
      'flex items-center justify-between rounded-t-xl border-b border-foreground/10 bg-primary/55 px-4 py-3'
    )}
  >
    <div class="flex items-center gap-2">
      <TableIcon class="h-4 w-4 text-foreground/55" />
      <h3
        class={cn(
          'max-w-40 min-w-40 overflow-hidden font-semibold overflow-ellipsis whitespace-nowrap',
          'text-foreground'
        )}
        title={table.name}
      >
        {table.name}
      </h3>
    </div>
    <div class="ml-2 flex-shrink-0 text-xs text-foreground/45 tabular-nums">
      ({table.columns.length})
    </div>
  </div>

  <div class={cn('table-columns max-h-[60vh] overflow-y-auto')}>
    {#each table.columns as column, index (index)}
      {@const IconComponent = getColumnTypeIcon(column)}
      <div
        class={cn(
          'bg-background/80 px-4 py-2 transition-colors duration-150 hover:bg-primary/60',
          index > 0 && 'border-t border-foreground/8'
        )}
        title="Column: {column.name} ({column.type}){column.nullable
          ? ''
          : ' - NOT NULL'}{column.defaultValue ? ` - Default: ${column.defaultValue}` : ''}"
      >
        <div class="flex items-center justify-between">
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <IconComponent class="h-3 w-3 text-foreground/50" />
              <span
                class={cn(
                  'max-w-40 min-w-40 overflow-hidden text-sm text-ellipsis whitespace-nowrap',
                  'text-foreground',
                  column.primaryKey && 'font-semibold'
                )}
              >
                {column.name}
              </span>
            </div>
            <div class={cn('flex items-center gap-2 text-xs', 'text-foreground/55')}>
              <span class="truncate">
                {formatColumnType(column.type)}
              </span>
              {#if column.foreignKey}
                <span class={cn('flex flex-shrink-0 items-center gap-1', 'text-foreground/55')}>
                  <Link class="h-2.5 w-2.5" />
                  → {column.foreignKey.table}.{column.foreignKey.column}
                </span>
              {/if}
            </div>
          </div>

          {#if $showBadgets && getColumnBadges(column).length > 0}
            <div class="ml-2 flex flex-shrink-0 flex-wrap gap-1">
              {#each getColumnBadges(column) as badge, index (index)}
                <Badget title={badge} />
              {/each}
            </div>
          {/if}
        </div>

        {#if column.defaultValue}
          <div class="mt-1 pl-5">
            <span class="text-xs text-foreground/45">
              Default: <span>{column.defaultValue}</span>
            </span>
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .table-node {
    position: relative;
    isolation: isolate;
    transform-origin: center center;
    transition: none;
  }

  .table-node:not(.dragging) {
    transition:
      transform 200ms var(--ease-in-out),
      box-shadow 180ms var(--ease-out),
      border-color 180ms var(--ease-out);
  }

  .dragging {
    cursor: grabbing !important;
    pointer-events: none;
  }

  .selected {
    isolation: isolate;
  }

  :global(.table-columns::-webkit-scrollbar) {
    width: 4px;
  }

  :global(.table-columns::-webkit-scrollbar-track) {
    background: transparent;
  }

  :global(.table-columns::-webkit-scrollbar-thumb) {
    background: color-mix(in oklab, var(--foreground) 18%, transparent);
    border-radius: 2px;
  }

  :global(.table-columns::-webkit-scrollbar-thumb:hover) {
    background: color-mix(in oklab, var(--foreground) 28%, transparent);
  }
</style>
