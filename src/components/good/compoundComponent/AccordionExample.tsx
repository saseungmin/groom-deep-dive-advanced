import Accordion from '@/components/good/compoundComponent/Accordion';

function AccordionExample() {
  return (
    <Accordion allowMultiple={false} defaultOpenItems={['item1']}>
      <Accordion.Item id="item1">
        <Accordion.Header itemId="item1">
          <h3>질문 1: React란 무엇인가요?</h3>
        </Accordion.Header>
        <Accordion.Content itemId="item1">
          <p>
            React는 Facebook에서 개발한 사용자 인터페이스를 구축하기 위한
            JavaScript 라이브러리입니다.
          </p>
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item id="item2">
        <Accordion.Header itemId="item2">
          <h3>질문 2: 컴포넌트란 무엇인가요?</h3>
        </Accordion.Header>
        <Accordion.Content itemId="item2">
          <p>
            컴포넌트는 UI를 독립적이고 재사용 가능한 조각으로 나누는 방법입니다.
          </p>
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item id="item3">
        <Accordion.Header itemId="item3">
          <h3>질문 3: Props는 무엇인가요?</h3>
        </Accordion.Header>
        <Accordion.Content itemId="item3">
          <p>
            Props는 부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달하는
            방법입니다.
          </p>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}

export default AccordionExample;
