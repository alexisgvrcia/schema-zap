<script lang="ts">
  import Modal from '$lib/components/ui/modal.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import { isValidTableName } from '$lib/utils/validators';
  import type { Table } from '$lib/types';

  interface Props {
    open: boolean;
    visualTables: Table[];
    onClose: () => void;
    onAddTable: (tableName: string) => void;
  }

  let { open, visualTables, onClose, onAddTable }: Props = $props();
  let newTableName = $state('');

  function handleAddTable(): void {
    if (!isValidTableName(newTableName, visualTables)) return;
    onAddTable(newTableName.trim());
    newTableName = '';
  }

  function handleClose(): void {
    newTableName = '';
    onClose();
  }
</script>

<Modal {open} size="md" onClose={handleClose}>
  {#snippet title()}
    <span>New Table</span>
  {/snippet}

  <div>
    <label for="table-name" class="mb-1.5 block text-xs font-medium text-foreground/60">
      Table name
    </label>
    <input
      id="table-name"
      type="text"
      bind:value={newTableName}
      class="w-full rounded-lg border border-foreground/12 bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-foreground/35 focus:border-foreground/30 focus:ring-2 focus:ring-foreground/15"
      placeholder="users, products, etc."
      onkeydown={(e) => e.key === 'Enter' && handleAddTable()}
    />
  </div>

  {#snippet footer()}
    <Button variant="ghost" onClick={handleClose}>Cancel</Button>
    <Button
      variant="default"
      onClick={handleAddTable}
      disabled={!isValidTableName(newTableName, visualTables)}
    >
      Create Table
    </Button>
  {/snippet}
</Modal>
