import { describe, expect, it } from 'vitest';
import { initialState, listReducer, type ListAction, type ListState } from './listReducer';

const texts = (state: ListState) => state.items.map((item) => item.text);

const run = (...actions: ListAction[]) => actions.reduce(listReducer, initialState);

describe('listReducer', () => {
  it('adds a trimmed item at the end', () => {
    const state = run({ type: 'add', text: '  New item  ' });

    expect(texts(state)).toEqual(['Item 1', 'Item 2', 'Item 3', 'Item 4', 'New item']);
  });

  it('ignores empty or blank entries', () => {
    expect(run({ type: 'add', text: '' })).toBe(initialState);
    expect(run({ type: 'add', text: '   ' })).toBe(initialState);
  });

  it('gives every new item a unique id, even after undo', () => {
    const state = run(
      { type: 'add', text: 'A' },
      { type: 'undo' },
      { type: 'add', text: 'B' },
    );
    const ids = state.items.map((item) => item.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('toggles the selection of an item', () => {
    const selected = run({ type: 'toggle', id: 1 }, { type: 'toggle', id: 3 });
    expect(selected.selectedIds).toEqual([1, 3]);

    const unselected = listReducer(selected, { type: 'toggle', id: 1 });
    expect(unselected.selectedIds).toEqual([3]);
  });

  it('removes several items at once and clears their selection', () => {
    const state = run(
      { type: 'toggle', id: 0 },
      { type: 'toggle', id: 2 },
      { type: 'remove', ids: [0, 2] },
    );

    expect(texts(state)).toEqual(['Item 2', 'Item 4']);
    expect(state.selectedIds).toEqual([]);
  });

  it('keeps the selection of items that were not removed', () => {
    const state = run({ type: 'toggle', id: 0 }, { type: 'remove', ids: [3] });

    expect(state.selectedIds).toEqual([0]);
  });

  it('does nothing when there is nothing to remove', () => {
    expect(run({ type: 'remove', ids: [] })).toBe(initialState);
    expect(run({ type: 'remove', ids: [99] })).toBe(initialState);
  });

  it('undoes changes one by one', () => {
    const changed = run({ type: 'add', text: 'New item' }, { type: 'remove', ids: [0] });
    expect(texts(changed)).toEqual(['Item 2', 'Item 3', 'Item 4', 'New item']);

    const undoneOnce = listReducer(changed, { type: 'undo' });
    expect(texts(undoneOnce)).toEqual(['Item 1', 'Item 2', 'Item 3', 'Item 4', 'New item']);

    const undoneTwice = listReducer(undoneOnce, { type: 'undo' });
    expect(texts(undoneTwice)).toEqual(['Item 1', 'Item 2', 'Item 3', 'Item 4']);
    expect(undoneTwice.history).toEqual([]);
  });

  it('drops the selection of an item whose addition is undone', () => {
    const state = run(
      { type: 'add', text: 'New item' },
      { type: 'toggle', id: 4 },
      { type: 'toggle', id: 0 },
      { type: 'undo' },
    );

    expect(state.selectedIds).toEqual([0]);
  });

  it('does nothing when there is nothing to undo', () => {
    expect(run({ type: 'undo' })).toBe(initialState);
  });
});
