export type Item = {
  id: number;
  text: string;
};

export type ListState = {
  items: Item[];
  selectedIds: number[];
  history: Item[][];
  nextId: number;
};

export type ListAction =
  | { type: 'add'; text: string }
  | { type: 'remove'; ids: number[] }
  | { type: 'toggle'; id: number }
  | { type: 'undo' };

const INITIAL_TEXTS = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

export const initialState: ListState = {
  items: INITIAL_TEXTS.map((text, id) => ({ id, text })),
  selectedIds: [],
  history: [],
  nextId: INITIAL_TEXTS.length,
};

export function listReducer(state: ListState, action: ListAction): ListState {
  switch (action.type) {
    case 'add': {
      const text = action.text.trim();
      if (!text) return state;
      const items = [...state.items, { id: state.nextId, text }];
      return { ...withItems(state, items), nextId: state.nextId + 1 };
    }
    case 'remove': {
      const items = state.items.filter((item) => !action.ids.includes(item.id));
      if (items.length === state.items.length) return state;
      return withItems(state, items);
    }
    case 'toggle': {
      const selectedIds = state.selectedIds.includes(action.id)
        ? state.selectedIds.filter((id) => id !== action.id)
        : [...state.selectedIds, action.id];
      return { ...state, selectedIds };
    }
    case 'undo': {
      const items = state.history.at(-1);
      if (!items) return state;
      return {
        ...state,
        items,
        history: state.history.slice(0, -1),
        selectedIds: keepExisting(state.selectedIds, items),
      };
    }
  }
}

function withItems(state: ListState, items: Item[]): ListState {
  return {
    ...state,
    items,
    history: [...state.history, state.items],
    selectedIds: keepExisting(state.selectedIds, items),
  };
}

function keepExisting(selectedIds: number[], items: Item[]) {
  return selectedIds.filter((id) => items.some((item) => item.id === id));
}
