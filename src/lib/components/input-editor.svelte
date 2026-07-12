<script lang="ts">
  import { onMount } from 'svelte';
  import { SQLDialect } from '$lib/types';
  import { SQL_EXAMPLES } from '$lib/constants';
  import { RotateCcw, CircleAlert, Check, Database } from '@lucide/svelte';
  import Button from '$lib/components/ui/button.svelte';
  import CopyButton from '$lib/components/ui/copy-button.svelte';
  import DeleteButton from '$lib/components/ui/delete-button.svelte';
  import Dropdown from '$lib/components/ui/dropdown.svelte';
  import SQLInput from '$lib/components/sql/sql-input.svelte';
  import { sqlInput, selectedDialect } from '$lib/stores/app';
  import { handleParseSQL } from '$lib/handlers/sqlHandler';
  import { hasMounted } from '$lib/stores/ui';

  onMount(() => {
    if (!$hasMounted) {
      handleParse(true, true);
      hasMounted.set(true);
      return;
    }

    handleParse();
  });

  function handleSQLChange(
    value: string,
    resetZoom: boolean = false,
    resetPosition: boolean = false
  ): void {
    sqlInput.set(value);
    handleParse(resetZoom, resetPosition);
  }

  let isParsingError = $state(false);
  let errorMessage = $state('');
  let isValidSQL = $state(false);
  let errorStatementIndex = $state(-1);

  const dialects = Object.values(SQLDialect);

  function getDialectColor(dialect: SQLDialect): string {
    return dialect ? 'text-foreground/55' : 'text-foreground/40';
  }

  let currentDialect = $state($selectedDialect);

  function handleParse(resetZoom: boolean = false, resetPosition: boolean = false): void {
    const result = handleParseSQL(resetZoom, resetPosition);

    if (result.success) clearError();
    else setError(result.error || 'Failed to parse SQL', (result.statementIndex ?? 0) - 1);
  }

  function setError(message: string, statementIndex: number = -1): void {
    isParsingError = true;
    errorMessage = message;
    errorStatementIndex = statementIndex;
    isValidSQL = false;
  }

  function clearError(): void {
    isParsingError = false;
    errorMessage = '';
    errorStatementIndex = -1;
    isValidSQL = true;
  }

  function handleInputChange(value: string): void {
    isParsingError = false;
    errorMessage = '';
    errorStatementIndex = -1;
    handleSQLChange(value);
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'Enter':
          event.preventDefault();
          handleParse(false, false);
          break;
        case 'a':
          break;
      }
    }
  }

  function clearInput(): void {
    handleSQLChange('');
    isParsingError = false;
    errorMessage = '';
    errorStatementIndex = -1;
    isValidSQL = false;
  }

  function loadSample(): void {
    const sampleSQL = SQL_EXAMPLES[$selectedDialect] || '';
    handleSQLChange(sampleSQL, true, true);
    clearError();
  }
</script>

<div class="flex h-full flex-col">
  <div class="mb-3 flex-shrink-0">
    <label for="sql-dialect-selector" class="mb-1.5 block text-xs font-medium text-foreground/60">
      SQL Dialect
    </label>

    <Dropdown
      id="sql-dialect-selector"
      options={dialects.map((dialect) => ({
        value: dialect,
        label: dialect,
        icon: Database,
        iconClass: getDialectColor(dialect)
      }))}
      bind:value={currentDialect}
      onselect={(detail) => {
        selectedDialect.set(detail.value as SQLDialect);
        handleParse(true, true);
      }}
    />
  </div>

  <div
    class="flex flex-1 flex-col overflow-hidden rounded-xl border border-foreground/10 bg-background shadow-sm"
  >
    <div
      class="flex flex-shrink-0 items-center justify-between border-b border-foreground/10 bg-primary/60 px-3 py-2"
      aria-live="polite"
    >
      <div class="flex min-w-0 flex-1 items-center gap-2 text-xs">
        {#if isParsingError}
          <CircleAlert class="h-4 w-4 flex-shrink-0 text-foreground" />
          <span class="truncate text-foreground/70">{errorMessage}</span>
        {:else if isValidSQL}
          <Check class="h-4 w-4 flex-shrink-0 text-foreground" />
          <span class="text-foreground/65">Valid SQL</span>
        {:else}
          <span class="text-foreground/50">Enter schema SQL</span>
        {/if}
      </div>

      <div class="flex flex-shrink-0 items-center gap-1">
        <Button variant="icon" size="sm" title="Load sample SQL" onClick={loadSample}>
          <RotateCcw class="h-4 w-4" />
        </Button>

        <CopyButton text={$sqlInput} disabled={!$sqlInput} />

        <DeleteButton title="Clear input" disabled={!$sqlInput} onConfirm={clearInput} />
      </div>
    </div>

    <SQLInput
      bind:value={$sqlInput}
      selectedDialect={$selectedDialect}
      {errorStatementIndex}
      onchange={handleInputChange}
      onkeydown={handleKeyDown}
    />
  </div>
</div>
