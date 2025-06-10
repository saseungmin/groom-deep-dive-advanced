import FormField from '@/components/good/user/common/FormField';
import type { User, UserFormData, ValidationErrors } from '@/types/type';
import { type FormEvent, useState } from 'react';

type UserFormProps = {
  user: User | null;
  onSubmit: (user: UserFormData) => void;
  onCancel: () => void;
};

function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState(
    user || { name: '', email: '', role: '', department: '' },
  );
  const [validation, setValidation] = useState<ValidationErrors>({});
  const isEditMode = !!user;

  const validateForm = () => {
    const errors: ValidationErrors = {};
    if (!formData.name.trim()) {
      errors.name = '이름은 필수입니다';
    }
    if (!formData.email.includes('@')) {
      errors.email = '올바른 이메일을 입력하세요';
    }
    if (!formData.role) {
      errors.role = '역할을 선택하세요';
    }

    setValidation(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validation[field as keyof ValidationErrors]) {
      setValidation((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isEditMode ? '사용자 수정' : '새 사용자 추가'}</h2>

      <FormField
        label="이름"
        type="text"
        value={formData.name}
        onChange={(value) => updateField('name', value)}
        error={validation.name}
        required
      />

      <FormField
        label="이메일"
        type="email"
        value={formData.email}
        onChange={(value) => updateField('email', value)}
        error={validation.email}
        required
      />

      <FormField
        label="역할"
        type="select"
        value={formData.role}
        onChange={(value) => updateField('role', value)}
        error={validation.role}
        options={[
          { value: '', label: '선택하세요' },
          { value: 'admin', label: '관리자' },
          { value: 'user', label: '사용자' },
          { value: 'guest', label: '게스트' },
        ]}
        required
      />

      <FormField
        label="부서"
        type="text"
        value={formData.department}
        onChange={(value) => updateField('department', value)}
      />

      <div className="form-actions">
        <button type="submit">{isEditMode ? '수정' : '추가'}</button>
        <button type="button" onClick={onCancel}>
          취소
        </button>
      </div>
    </form>
  );
}

export default UserForm;
