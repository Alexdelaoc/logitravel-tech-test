(function () {
  'use strict';

  const INITIAL_TEXTS = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

  const state = {
    items: INITIAL_TEXTS.map((text, id) => ({ id: String(id), text })),
    selectedIds: new Set(),
    history: [],
    nextId: INITIAL_TEXTS.length,
  };

  const list = document.getElementById('list');
  const undoBtn = document.getElementById('undo-btn');
  const deleteBtn = document.getElementById('delete-btn');
  const addBtn = document.getElementById('add-btn');
  const dialog = document.getElementById('add-dialog');
  const form = document.getElementById('add-form');
  const input = document.getElementById('add-input');
  const confirmBtn = document.getElementById('confirm-btn');
  const cancelBtn = document.getElementById('cancel-btn');

  function setItems(items) {
    state.history.push(state.items);
    state.items = items;
    dropMissingSelection();
    render();
  }

  function addItem(text) {
    const value = text.trim();
    if (!value) return false;
    setItems([...state.items, { id: String(state.nextId++), text: value }]);
    return true;
  }

  function removeItems(ids) {
    const items = state.items.filter((item) => !ids.has(item.id));
    if (items.length === state.items.length) return;
    setItems(items);
  }

  function undo() {
    if (state.history.length === 0) return;
    state.items = state.history.pop();
    dropMissingSelection();
    render();
  }

  function toggleSelection(id) {
    if (state.selectedIds.has(id)) {
      state.selectedIds.delete(id);
    } else {
      state.selectedIds.add(id);
    }
    renderSelection();
  }

  function dropMissingSelection() {
    const existing = new Set(state.items.map((item) => item.id));
    state.selectedIds.forEach((id) => {
      if (!existing.has(id)) state.selectedIds.delete(id);
    });
  }

  function render() {
    list.replaceChildren(...state.items.map(createItemElement));
    renderSelection();
    undoBtn.disabled = state.history.length === 0;
  }

  // Doesn't rebuild the list: replacing the buttons would break double click and focus.
  function renderSelection() {
    for (const button of list.querySelectorAll('button')) {
      button.setAttribute('aria-pressed', String(state.selectedIds.has(button.dataset.id)));
    }
    deleteBtn.disabled = state.selectedIds.size === 0;
  }

  function createItemElement(item) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.id = item.id;
    button.textContent = item.text;

    const element = document.createElement('li');
    element.append(button);
    return element;
  }

  function getItemId(event) {
    return event.target.closest('button')?.dataset.id;
  }

  list.addEventListener('click', (event) => {
    const id = getItemId(event);
    if (id) toggleSelection(id);
  });

  list.addEventListener('dblclick', (event) => {
    const id = getItemId(event);
    if (id) removeItems(new Set([id]));
  });

  undoBtn.addEventListener('click', undo);

  deleteBtn.addEventListener('click', () => removeItems(new Set(state.selectedIds)));

  addBtn.addEventListener('click', () => {
    form.reset();
    confirmBtn.disabled = true;
    dialog.showModal();
  });

  input.addEventListener('input', () => {
    confirmBtn.disabled = input.value.trim() === '';
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!addItem(input.value)) return;
    dialog.close();
    list.scrollTop = list.scrollHeight;
  });

  cancelBtn.addEventListener('click', () => dialog.close());

  // A click on the backdrop has the dialog itself as target.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  render();
})();
