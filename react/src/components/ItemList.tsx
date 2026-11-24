import { useEffect, useRef } from 'react';
import type { Item } from '../listReducer';

type ItemListProps = {
  items: Item[];
  selectedIds: number[];
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
};

export default function ItemList({ items, selectedIds, onToggle, onRemove }: ItemListProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const lastId = items.at(-1)?.id;

  // Scroll down when a new item is added.
  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [lastId]);

  return (
    <ul ref={listRef} className="list" aria-label="Items">
      {items.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            aria-pressed={selectedIds.includes(item.id)}
            onClick={() => onToggle(item.id)}
            onDoubleClick={() => onRemove(item.id)}
          >
            {item.text}
          </button>
        </li>
      ))}
    </ul>
  );
}
