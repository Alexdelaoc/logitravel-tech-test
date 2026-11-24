import { useReducer } from 'react';
import { initialState, listReducer } from '../listReducer';

export function useItemList() {
  const [{ items, selectedIds, history }, dispatch] = useReducer(listReducer, initialState);

  return {
    items,
    selectedIds,
    canUndo: history.length > 0,
    add: (text: string) => dispatch({ type: 'add', text }),
    remove: (id: number) => dispatch({ type: 'remove', ids: [id] }),
    removeSelected: () => dispatch({ type: 'remove', ids: selectedIds }),
    toggle: (id: number) => dispatch({ type: 'toggle', id }),
    undo: () => dispatch({ type: 'undo' }),
  };
}
