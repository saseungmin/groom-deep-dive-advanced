import Modal from '@/components/bad/compoundComponent/Modal';
import { useState } from 'react';

function ModalUsage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button type="button" onClick={() => setIsOpen(true)}>
        모달 열기
      </button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="사용자 정보"
        showCloseButton={true}
        showFooter={true}
        size="large"
        footerContent={
          <div>
            <button type="button" onClick={() => setIsOpen(false)}>
              취소
            </button>
            <button type="button" onClick={() => setIsOpen(false)}>
              확인
            </button>
          </div>
        }
      >
        <p>사용자 정보를 입력하세요.</p>
        <input type="text" placeholder="이름" />
        <input type="email" placeholder="이메일" />
      </Modal>
    </div>
  );
}

export default ModalUsage;
