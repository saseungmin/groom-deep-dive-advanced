# 🎨 컴포넌트 설계 패턴

## 🪝 Custom Hook 패턴

### 언제 사용하면 좋을까?
- custom hook을 만들어 둔 오픈소스 라이브러리를 참고해보기

#### ✅ 이런 경우에 사용 추천!
1. 같은 로직이 여러 컴포넌트에서 반복될 때 (ex. tanstack query)

```js
const useApi = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // API 호출 로직...
  
  return { data, loading, error, refetch };
};
```

2. 복잡한 상태 관리 로직을 분리하거나 단순화하여 사용하고 싶을 때 (ex. react-use)

```js
const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => setValue(prev => !prev), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  
  return { value, toggle, setTrue, setFalse };
};
```

3. 브라우저 API를 추상화할 때

```js
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('LocalStorage 저장 실패:', error);
    }
  };

  return [storedValue, setValue];
};
```

#### ❌ 이런 경우엔 피하기

```js
// 단순한 상태 하나만 관리하는 경우
const useName = () => {
  const [name, setName] = useState('');
  return { name, setName }; // 이런 건 그냥 useState 쓰세요
};

// 한 곳에서만 사용하는 로직
const useSpecificLogic = () => {
  // 특정 컴포넌트에서만 쓰이는 로직
  // 굳이 hook으로 만들 필요 없음
};
```

### 🎯 Custom Hook 작성 팁

1. **명확한 이름을 사용하기**

```js
// ❌ 애매한 이름
const useData = () => { ... }

// ✅ 명확한 이름
const useUserProfile = () => { ... }
const useShoppingCart = () => { ... }
```

2. **반환값을 일관성 있게 구성하기**

```js
// ✅ 객체로 반환 (권장)
return { data, loading, error, actions: { create, update, delete } };

// ✅ 배열로 반환 (useState 스타일)
return [value, setValue];
```

3. **에러 처리를 내장하여 외부에서 숨기기**

```js
const useApi = (url) => {
  try {
    // API 로직
  } catch (error) {
    setError(error.message);
    // 로깅, 알림 등 공통 에러 처리
  }
};
```

---

## 🕳️ Props Drilling 문제와 해결책

### Props Drilling이 문제가 되는 상황

#### 😱 이런 경우가 위험신호
```js
// 5단계 이상 props 전달..!
<App>
  <Header user={user} onLogout={onLogout} theme={theme} />
    <Navigation user={user} onLogout={onLogout} theme={theme} />
      <UserMenu user={user} onLogout={onLogout} theme={theme} />
        <UserDropdown user={user} onLogout={onLogout} theme={theme} />
          <LogoutButton onLogout={onLogout} />
```

#### 📊 Props Drilling 판단 기준
| 상황 | 판단 | 해결책 |
|------|------|--------|
| 2-3단계 전달 | 괜찮음 | 그대로 두세요 |
| 4-5단계 전달 | 주의 | 컴포넌트 합성 고려 |
| 6단계 이상 | 위험 | Context 또는 상태관리 도구 |
| 중간 컴포넌트가 props를 안 씀 | 위험 | 즉시 해결 필요 |

### 해결책별 적용 가이드

#### 1. 컴포넌트 합성 (Component Composition)

👍 **언제 사용**: UI 구조를 유연하게 만들고 싶을 때

```js
// ❌ Props Drilling
const App = () => {
  const [user, setUser] = useState(null);
  return <Layout user={user} onLogout={() => setUser(null)} />;
};

// ✅ 컴포넌트 합성
const App = () => {
  const [user, setUser] = useState(null);
  return (
    <Layout>
      <Header>
        <UserMenu user={user} onLogout={() => setUser(null)} />
      </Header>
      <MainContent />
    </Layout>
  );
};
```

#### 2. Context API
👍 **언제 사용**: 전역적으로 필요한 데이터일 때
```js
// ✅ Context 사용이 적절한 경우
const ThemeContext = createContext(); // 앱 전체 테마
const UserContext = createContext();  // 로그인한 사용자 정보
const LocaleContext = createContext(); // 다국어 설정
```

---

## 🎯 Context API 언제 써야 할까?

### ✅ Context API 사용하기 좋은 경우
- **전역 상태**: 테마, 다국어, 로그인 사용자 정보
- **깊은 컴포넌트 트리**: 5단계 이상 props 전달
- **여러 컴포넌트에서 공유**: 같은 데이터를 많은 곳에서 사용

### ❌ Context API 피해야 하는 경우
- **자주 변경되는 데이터**: 매초 업데이트되는 타이머, 스크롤 위치
- **지역적 상태**: 특정 페이지나 섹션에서만 사용하는 데이터
- **성능이 중요한 리스트**: 수천 개 아이템을 렌더링하는 경우

### 🚨 Context API 안티패턴
```js
// ❌ 모든 걸 하나의 Context에
const AppContext = createContext({
  user: null,
  theme: 'light',
  cart: [],
  notifications: [],
  settings: {},
  // ... 모든 상태
});

// ✅ 관련있는 것끼리 분리
const UserContext = createContext();
const ThemeContext = createContext();
const ShoppingContext = createContext();
```

### 🎯 Context 설계 팁

1. **작고 집중된 Context 만들기**

```js
// 테마만 담당
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

2. **Context + useReducer 조합**

```js
const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  const actions = useMemo(() => ({
    addItem: (item) => dispatch({ type: 'ADD_ITEM', payload: item }),
    removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', payload: id }),
  }), []);
  
  return (
    <CartContext.Provider value={{ ...state, ...actions }}>
      {children}
    </CartContext.Provider>
  );
};
```

---

## 🧩 Compound Component 패턴

### 언제 사용하면 좋을까?
- 디자인 시스템 라이브러리 참고하면 좋아요. (shadcn/ui)

#### ✅ 이런 컴포넌트를 만들때 좋아요
- **Modal/Dialog**: Header, Body, Footer 구분
- **Card**: Header, Content, Actions 영역
- **Accordion/Tabs**: 여러 패널 관리
- **Form**: Field, Label, Error 그룹화
- **Table**: Header, Body, Row 구조

#### 🎯 적용 판단 기준
```js
// 이런 props가 많아지면 Compound Component 고려
<Modal
  title="제목"
  showCloseButton={true}
  showFooter={true}
  footerContent={<Button>확인</Button>}
  size="large"
  className="custom-modal"
>
  내용
</Modal>

// Compound Component로 개선
<Modal>
  <Modal.Header>제목</Modal.Header>
  <Modal.Body>내용</Modal.Body>
  <Modal.Footer>
    <Button>확인</Button>
  </Modal.Footer>
</Modal>
```

### 🛠️ 구현 패턴

#### 1. Context 기반 패턴
```js
const Modal = ({ children, isOpen, onClose }) => {
  return (
    <ModalContext.Provider value={{ onClose }}>
      {isOpen && <div className="modal">{children}</div>}
    </ModalContext.Provider>
  );
};

Modal.Header = ({ children }) => {
  const { onClose } = useContext(ModalContext);
  return (
    <div className="modal-header">
      {children}
      <button onClick={onClose}>×</button>
    </div>
  );
};
```

#### 2. Props 기반 패턴
```js
const Tabs = ({ children, activeTab, onTabChange }) => {
  const tabs = React.Children.toArray(children);
  
  return (
    <div>
      <div className="tab-headers">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => onTabChange(index)}
            className={activeTab === index ? 'active' : ''}
          >
            {tab.props.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {tabs[activeTab]}
      </div>
    </div>
  );
};

Tabs.Panel = ({ children, label }) => children;
```

### 🚨 주의사항

1. **과도한 추상화 금지**

```js
// ❌ 너무 이른 추상화
const useButtonLogic = () => {
  // 단순한 버튼을 위한 과도한 hook
};

// ✅ 필요할 때만 추상화
const useFormValidation = () => {
  // 여러 폼에서 재사용되는 복잡한 검증 로직
};
```

2. **성능 고려사항**
```js
// Context 값이 자주 변경되면 React.memo 활용
const ExpensiveComponent = React.memo(({ data }) => {
  // 비싼 렌더링 로직
});
```

3. **테스트 가능성**
```js
// Custom Hook은 따로 테스트하기 쉽게 설계
const { result } = renderHook(() => useShoppingCart());
act(() => {
  result.current.addItem({ id: 1, name: 'Product' });
});
```

### 🚀 성능 최적화 팁

1. **Context 최적화**
```js
// 메모이제이션 활용
const value = useMemo(() => ({ user, theme }), [user, theme]);
```

2. **Compound Component 최적화**
```js
// React.memo로 불필요한 리렌더링 방지
Modal.Header = React.memo(({ children }) => {
  // 구현
});
```

3. **Custom Hook 최적화**
```js
// useCallback으로 함수 안정화
const actions = useMemo(() => ({
  create: useCallback((data) => { /* */ }, []),
  update: useCallback((id, data) => { /* */ }, []),
}), []);
```
