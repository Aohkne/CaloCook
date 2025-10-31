import React from 'react';
import styles from './ComfirmDelete.module.scss';

export default function ComfirmDelete({
  open,
  title = 'Confirm delete',
  message = 'Are you sure?',
  onCancel,
  onConfirm
}) {
  if (!open) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.dialog}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onCancel}>
            Cancel
          </button>
          <button className={styles.confirm} onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
