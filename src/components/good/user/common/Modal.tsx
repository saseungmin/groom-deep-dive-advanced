function Modal({
  children,
  onClose,
}: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={onClose} onKeyDown={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onClose}
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;
