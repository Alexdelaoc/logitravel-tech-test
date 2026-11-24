import { useState } from 'react';
import { useItemList } from './hooks/useItemList';
import ItemList from './components/ItemList';
import AddItemDialog from './components/AddItemDialog';
import UndoIcon from './components/UndoIcon';

export default function App() {
  const { items, selectedIds, canUndo, add, remove, removeSelected, toggle, undo } = useItemList();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <main className="card">
        <h1>This is a technical proof</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipiscing, elit mus primis nec inceptos. Lacinia
          habitasse arcu molestie maecenas cursus quam nunc, hendrerit posuere augue fames dictumst
          placerat porttitor, dis mi pharetra vestibulum venenatis phasellus.
        </p>

        <ItemList items={items} selectedIds={selectedIds} onToggle={toggle} onRemove={remove} />

        <div className="actions">
          <button
            type="button"
            className="btn btn-outline undo"
            aria-label="Undo"
            disabled={!canUndo}
            onClick={undo}
          >
            <UndoIcon />
          </button>
          <button
            type="button"
            className="btn btn-outline"
            disabled={selectedIds.length === 0}
            onClick={removeSelected}
          >
            Delete
          </button>
          <button type="button" className="btn btn-primary" onClick={() => setIsDialogOpen(true)}>
            Add
          </button>
        </div>
      </main>

      {isDialogOpen && <AddItemDialog onAdd={add} onClose={() => setIsDialogOpen(false)} />}
    </>
  );
}
