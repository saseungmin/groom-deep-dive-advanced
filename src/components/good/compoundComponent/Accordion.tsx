import { createContext, useContext, useState } from 'react';

const AccordionContext = createContext<{
  toggleItem: (itemId: string) => void;
  isOpen: (itemId: string) => boolean;
} | null>(null);

const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error(
      'Accordion 컴포넌트는 Accordion 내부에서만 사용할 수 있습니다.',
    );
  }
  return context;
};

const Accordion = ({
  children,
  allowMultiple = false,
  defaultOpenItems = [],
}: {
  children: React.ReactNode;
  allowMultiple?: boolean;
  defaultOpenItems?: string[];
}) => {
  const [openItems, setOpenItems] = useState(new Set(defaultOpenItems));

  const toggleItem = (itemId: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(itemId);
      }

      return newSet;
    });
  };

  const isOpen = (itemId: string) => openItems.has(itemId);

  return (
    <AccordionContext.Provider value={{ toggleItem, isOpen }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
};

Accordion.Item = ({
  children,
  id,
}: { children: React.ReactNode; id: string }) => {
  return (
    <div className="accordion-item" data-id={id}>
      {children}
    </div>
  );
};

Accordion.Header = ({
  children,
  itemId,
}: { children: React.ReactNode; itemId: string }) => {
  const { toggleItem, isOpen } = useAccordion();
  const open = isOpen(itemId);

  return (
    <div
      className={`accordion-header ${open ? 'open' : ''}`}
      onClick={() => toggleItem(itemId)}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {children}
      <span className="accordion-icon">{open ? '−' : '+'}</span>
    </div>
  );
};

Accordion.Content = ({
  children,
  itemId,
}: { children: React.ReactNode; itemId: string }) => {
  const { isOpen } = useAccordion();
  const open = isOpen(itemId);

  return (
    <div className={`accordion-content ${open ? 'open' : ''}`}>
      {open && <div className="accordion-content-inner">{children}</div>}
    </div>
  );
};

export default Accordion;
