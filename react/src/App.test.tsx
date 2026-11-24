import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

function setup() {
  const user = userEvent.setup();
  render(<App />);
  return { user };
}

const itemTexts = () =>
  within(screen.getByRole('list', { name: 'Items' }))
    .getAllByRole('listitem')
    .map((item) => item.textContent);

const button = (name: string) => screen.getByRole('button', { name });

describe('App', () => {
  it('starts with the initial items and nothing to delete or undo', () => {
    setup();

    expect(itemTexts()).toEqual(['Item 1', 'Item 2', 'Item 3', 'Item 4']);
    expect(button('Delete')).toBeDisabled();
    expect(button('Undo')).toBeDisabled();
  });

  it('adds a new item from the dialog', async () => {
    const { user } = setup();

    await user.click(button('Add'));
    const dialog = screen.getByRole('dialog', { name: 'Add item to list' });
    const confirm = within(dialog).getByRole('button', { name: 'Add' });
    expect(confirm).toBeDisabled();

    await user.type(within(dialog).getByRole('textbox'), 'Item 5');
    await user.click(confirm);

    expect(itemTexts()).toEqual(['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5']);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not allow adding blank entries', async () => {
    const { user } = setup();

    await user.click(button('Add'));
    const dialog = screen.getByRole('dialog');
    await user.type(within(dialog).getByRole('textbox'), '   {Enter}');

    expect(within(dialog).getByRole('button', { name: 'Add' })).toBeDisabled();
    expect(itemTexts()).toHaveLength(4);
  });

  it('closes the dialog without adding when cancelled', async () => {
    const { user } = setup();

    await user.click(button('Add'));
    await user.type(screen.getByRole('textbox'), 'Discarded');
    await user.click(button('Cancel'));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(itemTexts()).toHaveLength(4);
  });

  it('deletes every selected item', async () => {
    const { user } = setup();

    await user.click(button('Item 2'));
    await user.click(button('Item 4'));
    expect(button('Item 2')).toHaveAttribute('aria-pressed', 'true');

    await user.click(button('Delete'));

    expect(itemTexts()).toEqual(['Item 1', 'Item 3']);
    expect(button('Delete')).toBeDisabled();
  });

  it('deletes an item on double click', async () => {
    const { user } = setup();

    await user.dblClick(button('Item 3'));

    expect(itemTexts()).toEqual(['Item 1', 'Item 2', 'Item 4']);
  });

  it('selects items with the keyboard', async () => {
    const { user } = setup();

    await user.tab();
    await user.keyboard('{Enter}');

    expect(button('Item 1')).toHaveAttribute('aria-pressed', 'true');
  });

  it('undoes the last changes', async () => {
    const { user } = setup();

    await user.dblClick(button('Item 1'));
    await user.dblClick(button('Item 2'));
    expect(itemTexts()).toEqual(['Item 3', 'Item 4']);

    await user.click(button('Undo'));
    expect(itemTexts()).toEqual(['Item 2', 'Item 3', 'Item 4']);

    await user.click(button('Undo'));
    expect(itemTexts()).toEqual(['Item 1', 'Item 2', 'Item 3', 'Item 4']);
    expect(button('Undo')).toBeDisabled();
  });
});
