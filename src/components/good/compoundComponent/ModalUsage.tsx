import Modal from '@/components/good/compoundComponent/Modal';
import { useState } from 'react';

function ModalUsage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button type="button" onClick={() => setIsOpen(true)}>
        모달 열기
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="large">
        <Modal.Header>사용자 정보</Modal.Header>

        <Modal.Body>
          <p>사용자 정보를 입력하세요.</p>
          <input type="text" placeholder="이름" />
          <input type="email" placeholder="이메일" />
        </Modal.Body>

        <Modal.Footer>
          <Modal.CloseButton>취소</Modal.CloseButton>
          <button type="button" onClick={() => setIsOpen(false)}>
            확인
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ModalUsage;
