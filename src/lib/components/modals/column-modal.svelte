<script lang="ts">
  import Modal from '$lib/components/ui/modal.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import Dropdown from '$lib/components/ui/dropdown.svelte';
  import { selectedDialect } from '$lib/stores/app';
  import { SQL_DATA_TYPES } from '$lib/constants';
  import {
    requiresLength,
    canHaveLength,
    isFeatureSupported,
    tableHasPrimaryKey
  } from '$lib/utils/validators';
  import { getCompatiblePrimaryKeys } from '$lib/utils/column-helpers';
  import type { Table } from '$lib/types';

  interface ColumnForm {
    isEdit: boolean;
    originalName: string;
    tableName: string;
    name: string;
    type: string;
    nullable: boolean;
    primaryKey: boolean;
    foreignKey: { table: string; column: string } | undefined;
    defaultValue: string;
    autoIncrement: boolean;
    unique: boolean;
    length: number | undefined;
  }

  interface Props {
    open: boolean;
    columnForm: ColumnForm;
    visualTables: Table[];
    onClose: () => void;
    onSaveColumn: () => void;
    onUpdateColumnForm: (updates: Partial<ColumnForm>) => void;
  }

  let { open, columnForm, visualTables, onClose, onSaveColumn, onUpdateColumnForm }: Props =
    $props();

  const SQL_TYPES = $derived(SQL_DATA_TYPES[$selectedDialect]);

  function handleSaveColumn(): void {
    if (!isColumnValid) return;
    onSaveColumn();
  }

  function updateField<K extends keyof ColumnForm>(field: K, value: ColumnForm[K]): void {
    onUpdateColumnForm({ [field]: value });
  }

  function handleForeignKeyChange(value: string): void {
    if (value) {
      const [table, column] = value.split('.');
      updateField('foreignKey', { table, column });
    } else {
      updateField('foreignKey', undefined);
    }
  }

  const compatiblePKs = $derived(
    getCompatiblePrimaryKeys(
      visualTables,
      columnForm.tableName,
      columnForm.type,
      columnForm.length,
      $selectedDialect
    )
  );

  const dataTypeOptions = $derived(
    SQL_TYPES.map((type) => ({
      value: type,
      label: type
    }))
  );

  const foreignKeyOptions = $derived([
    { value: '', label: 'none' },
    ...compatiblePKs.map((pk) => ({
      value: `${pk.table}.${pk.column}`,
      label: `${pk.table}.${pk.column} (${pk.type}${pk.length ? `(${pk.length})` : ''})`
    }))
  ]);

  const isColumnValid = $derived(
    Boolean(columnForm.name.trim()) &&
      Boolean(columnForm.type) &&
      !visualTables.some(
        (table) =>
          table.name === columnForm.tableName &&
          table.columns.some(
            (column) =>
              column.name.toLowerCase() === columnForm.name.trim().toLowerCase() &&
              (!columnForm.isEdit || column.name !== columnForm.originalName)
          )
      ) &&
      (!requiresLength(columnForm.type, $selectedDialect) || Boolean(columnForm.length))
  );
</script>

<Modal {open} size="lg" {onClose}>
  {#snippet title()}
    <span>{columnForm.isEdit ? 'Edit' : 'New'} Column</span>
  {/snippet}

  <div>
    <label for="column-name" class="mb-1.5 block text-xs font-medium text-foreground/60">
      Column name
    </label>
    <input
      id="column-name"
      type="text"
      value={columnForm.name}
      class="w-full rounded-lg border border-foreground/12 bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-foreground/35 focus:border-foreground/30 focus:ring-2 focus:ring-foreground/15"
      placeholder="id, name, email, etc."
      onkeydown={(e) => e.key === 'Enter' && handleSaveColumn()}
      oninput={(e) => updateField('name', (e.target as HTMLInputElement).value)}
    />
  </div>

  <div>
    <label for="column-type" class="mb-1.5 block text-xs font-medium text-foreground/60">
      Data type
    </label>
    <Dropdown
      id="column-type"
      options={dataTypeOptions}
      value={columnForm.type}
      placeholder="Select type..."
      onselect={(e) => updateField('type', e.value)}
      className="w-full"
    />
  </div>

  {#if columnForm.type && canHaveLength(columnForm.type, $selectedDialect)}
    <div>
      <label for="column-length" class="mb-1.5 block text-xs font-medium text-foreground/60">
        Length {requiresLength(columnForm.type, $selectedDialect) ? '(required)' : '(optional)'}
      </label>
      <input
        id="column-length"
        type="number"
        min="1"
        max="65535"
        value={columnForm.length || ''}
        class="w-full rounded-lg border border-foreground/12 bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-foreground/35 focus:border-foreground/30 focus:ring-2 focus:ring-foreground/15"
        placeholder="e.g. 255, 50, 100"
        required={requiresLength(columnForm.type, $selectedDialect)}
        oninput={(e) => {
          const target = e.target as HTMLInputElement;
          target.value = target.value.replace(/[^0-9]/g, '');
          const numValue = parseInt(target.value);
          updateField('length', isNaN(numValue) ? undefined : numValue);
        }}
        onkeydown={(e) => {
          if (e.ctrlKey || e.metaKey) return;
          const allowedKeys = [
            'Backspace',
            'Delete',
            'ArrowLeft',
            'ArrowRight',
            'ArrowUp',
            'ArrowDown',
            'Tab',
            'Enter'
          ];
          const isNumber = /^[0-9]$/.test(e.key);
          if (!isNumber && !allowedKeys.includes(e.key)) {
            e.preventDefault();
          }
        }}
      />
      {#if requiresLength(columnForm.type, $selectedDialect) && (!columnForm.length || columnForm.length <= 0)}
        <p class="mt-1 text-xs text-foreground/65">This data type requires specifying a length</p>
      {/if}
    </div>
  {/if}

  <div class="grid grid-cols-2 gap-4">
    <label
      class="flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-colors duration-150 hover:bg-primary {tableHasPrimaryKey(
        columnForm.tableName,
        visualTables,
        columnForm.originalName
      ) && !columnForm.primaryKey
        ? 'opacity-50'
        : ''}"
    >
      <input
        type="checkbox"
        checked={columnForm.primaryKey}
        class="h-4 w-4 accent-foreground focus:ring-2 focus:ring-foreground/20"
        disabled={tableHasPrimaryKey(columnForm.tableName, visualTables, columnForm.originalName) &&
          !columnForm.primaryKey}
        onchange={(e) => updateField('primaryKey', (e.target as HTMLInputElement).checked)}
      />
      <span class="text-sm font-medium text-foreground/70">
        Primary Key
        {#if tableHasPrimaryKey(columnForm.tableName, visualTables, columnForm.originalName) && !columnForm.primaryKey}
          <span class="block text-xs text-foreground/45">(A primary key already exists)</span>
        {/if}
      </span>
    </label>

    {#if isFeatureSupported('autoIncrement', $selectedDialect)}
      <label
        class="flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-colors duration-150 hover:bg-primary {!columnForm.primaryKey
          ? 'opacity-50'
          : ''}"
      >
        <input
          type="checkbox"
          checked={columnForm.autoIncrement}
          class="h-4 w-4 accent-foreground focus:ring-2 focus:ring-foreground/20"
          disabled={!columnForm.primaryKey}
          onchange={(e) => updateField('autoIncrement', (e.target as HTMLInputElement).checked)}
        />
        <span class="text-sm font-medium text-foreground/70">Auto Increment</span>
      </label>
    {/if}

    <label
      class="flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-colors duration-150 hover:bg-primary {columnForm.primaryKey
        ? 'opacity-50'
        : ''}"
    >
      <input
        type="checkbox"
        checked={columnForm.nullable}
        class="h-4 w-4 accent-foreground focus:ring-2 focus:ring-foreground/20"
        disabled={columnForm.primaryKey}
        onchange={(e) => updateField('nullable', (e.target as HTMLInputElement).checked)}
      />
      <span class="text-sm font-medium text-foreground/70">Nullable</span>
    </label>

    <label
      class="flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-colors duration-150 hover:bg-primary {columnForm.primaryKey
        ? 'opacity-50'
        : ''}"
    >
      <input
        type="checkbox"
        checked={columnForm.unique}
        class="h-4 w-4 accent-foreground focus:ring-2 focus:ring-foreground/20"
        disabled={columnForm.primaryKey}
        onchange={(e) => updateField('unique', (e.target as HTMLInputElement).checked)}
      />
      <span class="text-sm font-medium text-foreground/70">Unique</span>
    </label>
  </div>

  <div>
    {#if columnForm.type && compatiblePKs.length > 0}
      <label for="foreign-key-select" class="mb-1.5 block text-xs font-medium text-foreground/60">
        Foreign Key
      </label>
      <Dropdown
        id="foreign-key-select"
        options={foreignKeyOptions}
        value={columnForm.foreignKey
          ? `${columnForm.foreignKey.table}.${columnForm.foreignKey.column}`
          : ''}
        placeholder="Select foreign key..."
        onselect={(e) => handleForeignKeyChange(e.value)}
        className="w-full"
      />
    {/if}
  </div>

  {#snippet footer()}
    <Button variant="ghost" onClick={onClose}>Cancel</Button>
    <Button variant="default" onClick={handleSaveColumn} disabled={!isColumnValid}>
      {columnForm.isEdit ? 'Save' : 'Add'} Column
    </Button>
  {/snippet}
</Modal>
