type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  showFooter?: boolean;
  footerContent?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  className?: string;
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  showFooter = true,
  footerContent,
  size = 'medium',
  className = '',
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} onKeyDown={onClose}>
      <div
        className={`modal modal-${size} ${className}`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="modal-header">
          <h2>{title}</h2>
          {showCloseButton && (
            <button
              type="button"
              className="close-button"
              onClick={onClose}
              onKeyDown={(e) => e.stopPropagation()}
            >
              ×
            </button>
          )}
        </div>

        {/* 내용 */}
        <div className="modal-body">{children}</div>

        {/* 푸터 */}
        {showFooter && (
          <div className="modal-footer">
            {footerContent || (
              <button type="button" onClick={onClose}>
                닫기
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
