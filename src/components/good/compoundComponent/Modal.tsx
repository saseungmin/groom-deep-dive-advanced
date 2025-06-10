import { createContext, useContext } from 'react';

/*
😊 Compound Component 패턴의 장점:

1. ✅ 유연성: 각 부분을 선택적으로 사용 가능
2. ✅ 가독성: JSX 구조가 실제 UI 구조와 일치
3. ✅ 재사용성: 다양한 조합으로 재사용 가능
4. ✅ 캡슐화: 관련된 컴포넌트들이 함께 묶임
5. ✅ API 단순화: 복잡한 props 대신 컴포넌트 조합으로 제어
6. ✅ 확장성: 새로운 서브 컴포넌트 쉽게 추가 가능

사용하기 좋은 경우:
- Modal, Accordion, Tabs, Select 같은 복합 UI 컴포넌트
- 여러 부분으로 구성되지만 함께 동작해야 하는 컴포넌트
- 사용자가 구조를 커스터마이징할 수 있어야 하는 컴포넌트
*/

const ModalContext = createContext<{ onClose: () => void } | null>(null);

const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Modal 컴포넌트는 Modal 내부에서만 사용할 수 있습니다.');
  }
  return context;
};

type ModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  size?: 'small' | 'medium' | 'large';
};

const Modal = ({ children, isOpen, onClose, size = 'medium' }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <ModalContext.Provider value={{ onClose }}>
      <div className="modal-overlay" onClick={onClose} onKeyDown={onClose}>
        <div
          className={`modal modal-${size}`}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );
};

Modal.Header = ({
  children,
  showCloseButton = true,
}: {
  children: React.ReactNode;
  showCloseButton?: boolean;
}) => {
  const { onClose } = useModal();

  return (
    <div className="modal-header">
      <div className="modal-title">{children}</div>
      {showCloseButton && (
        <button type="button" className="close-button" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
};

Modal.Body = ({ children }: { children: React.ReactNode }) => {
  return <div className="modal-body">{children}</div>;
};

Modal.Footer = ({ children }: { children: React.ReactNode }) => {
  return <div className="modal-footer">{children}</div>;
};

Modal.CloseButton = ({
  children = '닫기',
  ...props
}: {
  children?: React.ReactNode;
  props?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}) => {
  const { onClose } = useModal();

  return (
    <button type="button" onClick={onClose} {...props}>
      {children}
    </button>
  );
};

export default Modal;
