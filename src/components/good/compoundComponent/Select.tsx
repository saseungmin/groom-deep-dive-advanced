import { createContext, useContext, useState } from 'react';

const SelectContext = createContext<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectOption: (optionValue: string, label: string) => void;
  selectedValue: string;
} | null>(null);

const useSelect = () => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error('Select 컴포넌트는 Select 내부에서만 사용할 수 있습니다.');
  }
  return context;
};

const Select = ({
  children,
  value,
  onChange,
  placeholder = '선택하세요',
}: {
  children: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');
  const selectOption = (optionValue: string, label: string) => {
    onChange(optionValue);
    setSelectedLabel(label);
    setIsOpen(false);
  };

  return (
    <SelectContext.Provider
      value={{
        isOpen,
        setIsOpen,
        selectOption,
        selectedValue: value,
      }}
    >
      <div className="select-container">
        <div
          className="select-trigger"
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {selectedLabel || placeholder}
          <span className="select-arrow">{isOpen ? '▲' : '▼'}</span>
        </div>

        {isOpen && <div className="select-dropdown">{children}</div>}
      </div>
    </SelectContext.Provider>
  );
};

Select.Option = ({
  children,
  value,
}: {
  children: string;
  value: string;
}) => {
  const { selectOption, selectedValue } = useSelect();
  const isSelected = selectedValue === value;

  return (
    <div
      className={`select-option ${isSelected ? 'selected' : ''}`}
      onClick={() => selectOption(value, children)}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
};

export default Select;
