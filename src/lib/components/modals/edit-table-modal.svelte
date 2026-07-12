<script lang="ts">
  import Modal from '$lib/components/ui/modal.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import { isValidTableName } from '$lib/utils/validators';
  import type { Table } from '$lib/types';

  interface EditTableForm {
    originalName: string;
    name: string;
    isVisible: boolean;
  }

  interface Props {
    editTableForm: EditTableForm;
    visualTables: Table[];
    onClose: () => void;
    onSaveChanges: () => void;
    onUpdateName: (name: string) => void;
  }

  let { editTableForm, visualTables, onClose, onSaveChanges, onUpdateName }: Props = $props();

  function handleSaveChanges(): void {
    if (!isValidTableName(editTableForm.name, visualTables)) return;
    onSaveChanges();
  }
</script>

<Modal open={editTableForm.isVisible} size="md" {onClose}>
  {#snippet title()}
    <span>Edit Table</span>
  {/snippet}

  <div>
    <label for="edit-table-name" class="mb-1.5 block text-xs font-medium text-foreground/60">
      Table name
    </label>
    <input
      id="edit-table-name"
      type="text"
      value={editTableForm.name}
      class="min-h-11 w-full rounded-lg border border-foreground/12 bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-foreground/35 focus:border-foreground/30 focus:ring-2 focus:ring-foreground/15 sm:min-h-10"
      onkeydown={(e) => e.key === 'Enter' && handleSaveChanges()}
      oninput={(e) => onUpdateName((e.target as HTMLInputElement).value)}
    />
  </div>

  {#snippet footer()}
    <Button variant="ghost" onClick={onClose}>Cancel</Button>
    <Button
      variant="default"
      disabled={editTableForm.originalName === editTableForm.name ||
        !isValidTableName(editTableForm.name, visualTables)}
      onClick={handleSaveChanges}>Save Changes</Button
    >
  {/snippet}
</Modal>
