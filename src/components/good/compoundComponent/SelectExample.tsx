import Select from '@/components/good/compoundComponent/Select';
import { useState } from 'react';

const SelectExample = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  return (
    <div>
      <h3>도시 선택</h3>
      <Select
        value={selectedCity}
        onChange={setSelectedCity}
        placeholder="도시를 선택하세요"
      >
        <Select.Option value="seoul">서울</Select.Option>
        <Select.Option value="busan">부산</Select.Option>
        <Select.Option value="incheon">인천</Select.Option>
        <Select.Option value="daegu">대구</Select.Option>
      </Select>

      <h3>역할 선택</h3>
      <Select
        value={selectedRole}
        onChange={setSelectedRole}
        placeholder="역할을 선택하세요"
      >
        <Select.Option value="admin">관리자</Select.Option>
        <Select.Option value="user">사용자</Select.Option>
        <Select.Option value="guest">게스트</Select.Option>
      </Select>

      <div>
        <p>선택된 도시: {selectedCity}</p>
        <p>선택된 역할: {selectedRole}</p>
      </div>
    </div>
  );
};

export default SelectExample;
