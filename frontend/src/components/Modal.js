import React from 'react';
import './styles.css';

export default function Modal({ isOpen, title, children, onClose, onConfirm, confirmText = 'OK', cancelText = 'Cancel', showCancel = true }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div role="dialog" aria-modal="true" className="modal-box">
        {title && <h3 className="modal-title">{title}</h3>}
        <div className="modal-body">{children}</div>
        <div className="modal-actions">
          {showCancel && <button className="modal-btn neutral" onClick={onClose}>{cancelText}</button>}
          <button className="modal-btn primary" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
