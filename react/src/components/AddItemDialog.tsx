import { useEffect, useId, useRef, useState } from 'react';

type AddItemDialogProps = {
  onAdd: (text: string) => void;
  onClose: () => void;
};

export default function AddItemDialog({ onAdd, onClose }: AddItemDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const labelId = useId();
  const inputId = useId();
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  // dialog.close() and Escape fire the close event, which calls onClose.
  const close = () => dialogRef.current?.close();

  const addItem = (formData: FormData) => {
    onAdd(String(formData.get('text')));
    close();
  };

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby={labelId}
      onClose={onClose}
      onClick={(event) => {
        // A click on the backdrop has the dialog itself as target.
        if (event.target === event.currentTarget) close();
      }}
    >
      <form action={addItem}>
        <label id={labelId} htmlFor={inputId}>
          Add item to list
        </label>
        <input
          id={inputId}
          name="text"
          type="text"
          placeholder="Type the text here..."
          autoComplete="off"
          onChange={(event) => setIsEmpty(event.target.value.trim() === '')}
        />
        <div className="modal-actions">
          <button type="submit" className="btn btn-primary" disabled={isEmpty}>
            Add
          </button>
          <button type="button" className="btn btn-outline" onClick={close}>
            Cancel
          </button>
        </div>
      </form>
    </dialog>
  );
}
