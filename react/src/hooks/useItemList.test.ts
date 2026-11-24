import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useItemList } from './useItemList';

describe('useItemList', () => {
  it('removes the selected items', () => {
    const { result } = renderHook(() => useItemList());

    act(() => result.current.toggle(0));
    act(() => result.current.toggle(2));
    act(() => result.current.removeSelected());

    expect(result.current.items.map((item) => item.text)).toEqual(['Item 2', 'Item 4']);
    expect(result.current.selectedIds).toEqual([]);
  });

  it('allows undo only after a change', () => {
    const { result } = renderHook(() => useItemList());
    expect(result.current.canUndo).toBe(false);

    act(() => result.current.add('Item 5'));
    expect(result.current.canUndo).toBe(true);

    act(() => result.current.undo());
    expect(result.current.canUndo).toBe(false);
  });
});
