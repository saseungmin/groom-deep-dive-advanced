# ⚡ React 성능 최적화

## 🔍 성능 문제 진단하기

### 성능 문제의 신호들

#### 🚨 이런 증상이 나타나면 최적화 필요
- **느린 렌더링**: 버튼 클릭 후 반응이 늦음
- **끊기는 스크롤**: 리스트 스크롤이 버벅거림
- **메모리 누수**: 페이지를 오래 사용하면 느려짐
- **큰 번들 크기**: 초기 로딩이 오래 걸림
- **불필요한 API 호출**: 같은 요청이 반복됨

#### 📊 성능 측정 기준
- [core web vitals](https://web.dev/articles/vitals?hl=ko)

### 🛠️ 성능 문제 찾는 방법

#### 1. React DevTools Profiler 사용
```js
// 1. 개발 모드에서 React DevTools 설치
// 2. Profiler 탭에서 녹화 시작
// 3. 앱 사용하며 성능 측정
// 4. 느린 컴포넌트 확인

// 성능 문제가 있는 컴포넌트 예시
const SlowComponent = () => {
  console.log('SlowComponent 렌더링!'); // 너무 자주 나타나면 문제
  
  // 무거운 계산
  const expensiveValue = heavyCalculation();
  
  return <div>{expensiveValue}</div>;
};
```

#### 2. Chrome DevTools Performance 탭
```javascript
// 1. F12 → Performance 탭
// 2. 녹화 시작 → 앱 사용 → 녹화 중지
// 3. Main 스레드에서 긴 작업 확인
// 4. 노란색/빨간색 영역이 성능 병목
```

---

## 🎯 렌더링 최적화

### React.memo: 불필요한 리렌더링 방지

#### ✅ 언제 사용하면 좋을까?
```javascript
// 1. 무거운 연산을 하는 컴포넌트
const ExpensiveComponent = React.memo(({ data }) => {
  const processedData = data.map(item => {
    // 복잡한 계산...
    return heavyProcessing(item);
  });
  
  return <div>{processedData}</div>;
});

// 2. 자주 변경되지 않는 컴포넌트
const Header = React.memo(({ title, logo }) => {
  return (
    <header>
      <img src={logo} alt="logo" />
      <h1>{title}</h1>
    </header>
  );
});
```

#### ❌ 이런 경우엔 오히려 성능 저하
```javascript
// props가 자주 변경되는 컴포넌트
const Timer = React.memo(({ currentTime }) => {
  return <div>{currentTime}</div>; // 매초 변경되므로 memo 의미 없음
});

// 단순한 컴포넌트
const SimpleButton = React.memo(({ children, onClick }) => {
  return <button onClick={onClick}>{children}</button>; // 오버헤드만 추가
});
```

### useMemo: 무거운 계산 최적화

#### 🎯 적용 기준
```javascript
// ✅ 이런 경우에 사용하세요
const ExpensiveCalculation = ({ items, filter }) => {
  // 무거운 계산 (1ms 이상 소요)
  const expensiveValue = useMemo(() => {
    console.log('무거운 계산 실행!');
    return items
      .filter(item => item.category === filter)
      .map(item => complexCalculation(item))
      .reduce((sum, value) => sum + value, 0);
  }, [items, filter]); // items나 filter가 변경될 때만 재계산

  // 객체/배열 생성도 메모이제이션
  const chartData = useMemo(() => ({
    labels: items.map(item => item.name),
    datasets: [{
      data: items.map(item => item.value)
    }]
  }), [items]);

  return <Chart data={chartData} total={expensiveValue} />;
};

// ❌ 이런 경우엔 불필요
const SimpleComponent = ({ a, b }) => {
  // 단순한 계산은 useMemo 불필요
  const sum = useMemo(() => a + b, [a, b]); // 오버헤드만 추가
  
  return <div>{sum}</div>;
};
```

#### 🚨 useMemo/useCallback의 가장 흔한 실수
```js
// ❌ 매번 새로운 객체/배열을 dependency로 사용
const BadComponent = () => {
  const [count, setCount] = useState(0);
  
  // 😱 매번 새로운 배열 생성
  const items = [{ id: 1, name: 'item1' }, { id: 2, name: 'item2' }];
  
  // 😱 items가 매번 새로운 참조이므로 useMemo 무효화
  const expensiveValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.id, 0);
  }, [items]); // 매번 실행됨!
  
  return <div>{expensiveValue}</div>;
};

// ✅ 올바른 해결 방법들
const GoodComponent = () => {
  const [count, setCount] = useState(0);
  
  // 방법 1: 컴포넌트 외부로 이동
  const staticItems = useMemo(() => [
    { id: 1, name: 'item1' }, 
    { id: 2, name: 'item2' }
  ], []); // 한 번만 생성
  
  // 방법 2: state로 관리
  const [dynamicItems, setDynamicItems] = useState([
    { id: 1, name: 'item1' }
  ]);
  
  // 방법 3: 원시값으로 변경
  const [itemCount, setItemCount] = useState(2);
  
  const expensiveValue = useMemo(() => {
    return staticItems.reduce((sum, item) => sum + item.id, 0);
  }, [staticItems]); // 실제로 변경될 때만 실행
  
  return <div>{expensiveValue}</div>;
};
```

#### 🎯 useMemo 적용 가이드라인
- ✅ 사용하면 좋은 경우:
  - 정말 무거운 계산 (1ms 이상)
  - 자식 컴포넌트의 props 안정화
  - 비용이 큰 객체 생성
- ❌ 사용하지 말아야 하는 경우:
  - 단순한 계산
  - 매번 변경되는 dependency
  - 이미 안정적인 값

### useCallback: 함수 메모이제이션

#### 🎯 언제 써야 할까?
```javascript
// ✅ 자식 컴포넌트에 props로 전달하는 함수
const ParentComponent = ({ users }) => {
  const [filter, setFilter] = useState('');

  // 메모이제이션된 함수
  const handleUserClick = useCallback((userId) => {
    console.log('User clicked:', userId);
    // 사용자 클릭 처리 로직
  }, []); // 의존성이 없으므로 한 번만 생성

  const handleUserDelete = useCallback((userId) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  }, []); // setUsers는 안정적이므로 의존성 제외 가능

  return (
    <div>
      {users.map(user => (
        <UserItem
          key={user.id}
          user={user}
          onClick={handleUserClick}    // 메모이제이션으로 불필요한 리렌더링 방지
          onDelete={handleUserDelete}  // 메모이제이션으로 불필요한 리렌더링 방지
        />
      ))}
    </div>
  );
};

// ✅ useEffect 의존성 안정화
const DataComponent = ({ apiUrl }) => {
  const [data, setData] = useState(null);

  const fetchData = useCallback(async () => {
    const response = await fetch(apiUrl);
    const result = await response.json();
    setData(result);
  }, [apiUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // fetchData가 안정화되어 불필요한 재호출 방지

  return <div>{data}</div>;
};
```

### 렌더링 최적화 팁

#### 1. 컴포넌트 분리로 리렌더링 범위 줄이기
```javascript
// ❌ 한 컴포넌트에서 모든 상태 관리
const App = () => {
  const [count, setCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [theme, setTheme] = useState('light');

  // count 변경 시 전체 앱이 리렌더링됨
  return (
    <div>
      <Counter count={count} setCount={setCount} />
      <UserList users={users} />        {/* 불필요한 리렌더링 */}
      <ThemeToggle theme={theme} />      {/* 불필요한 리렌더링 */}
    </div>
  );
};

// ✅ 상태를 가까운 컴포넌트로 이동
const App = () => {
  const [users, setUsers] = useState([]);
  const [theme, setTheme] = useState('light');

  return (
    <div>
      <CounterSection />              {/* count 상태가 여기 안에서만 관리 */}
      <UserList users={users} />
      <ThemeToggle theme={theme} />
    </div>
  );
};

const CounterSection = () => {
  const [count, setCount] = useState(0);
  return <Counter count={count} setCount={setCount} />;
};
```

#### 2. 조건부 렌더링 최적화
```javascript
// ❌ 매번 새로운 컴포넌트 생성
const ConditionalRender = ({ showModal, data }) => {
  return (
    <div>
      {showModal && <Modal data={data} />}  {/* 매번 새로운 Modal 생성 */}
    </div>
  );
};

// ✅ 조건부 렌더링 최적화
const ConditionalRender = ({ showModal, data }) => {
  return (
    <div>
      <Modal isOpen={showModal} data={data} />  {/* Modal은 항상 존재, 내부에서 조건 처리 */}
    </div>
  );
};
```

---

## 🧠 메모리 최적화

### useEffect cleanup: 메모리 누수 방지

#### 🚨 메모리 누수가 발생하는 패턴들
```javascript
// ❌ cleanup하지 않는 이벤트 리스너
const BadComponent = () => {
  useEffect(() => {
    const handleScroll = () => {
      console.log('스크롤 중...');
    };
    
    window.addEventListener('scroll', handleScroll);
    // cleanup 함수 없음! 메모리 누수 발생
  }, []);

  return <div>컴포넌트</div>;
};

// ❌ cleanup하지 않는 타이머
const BadTimer = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('타이머 실행');
    }, 1000);
    // cleanup 함수 없음! 메모리 누수 발생
  }, []);

  return <div>타이머</div>;
};

// ❌ cleanup하지 않는 비동기 요청
const BadAsyncComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(response => response.json())
      .then(data => setData(data)); // 컴포넌트가 언마운트되어도 setState 실행될 수 있음
  }, []);

  return <div>{data}</div>;
};
```

#### ✅ 올바른 cleanup 구현
```javascript
// ✅ 이벤트 리스너 cleanup
const GoodComponent = () => {
  useEffect(() => {
    const handleScroll = () => {
      console.log('스크롤 중...');
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return <div>컴포넌트</div>;
};

// ✅ 타이머 cleanup
const GoodTimer = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('타이머 실행');
    }, 1000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  return <div>타이머</div>;
};

// ✅ 비동기 요청 cleanup
const GoodAsyncComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        const result = await response.json();
        
        if (isMounted) {  // 컴포넌트가 마운트된 상태에서만 setState
          setData(result);
        }
      } catch (error) {
        if (isMounted) {
          console.error('데이터 로드 실패:', error);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;  // cleanup에서 플래그 변경
    };
  }, []);

  return <div>{data}</div>;
};

// ✅ AbortController 사용 (권장)
const BestAsyncComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        const response = await fetch('/api/data', {
          signal: abortController.signal
        });
        const result = await response.json();
        setData(result);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('데이터 로드 실패:', error);
        }
      }
    };

    fetchData();

    return () => {
      abortController.abort();  // 요청 자체를 취소
    };
  }, []);

  return <div>{data}</div>;
};
```

### 큰 리스트 최적화: 가상화

#### 🎯 가상화가 필요한 경우
- **1000개 이상**의 아이템
- **복잡한 아이템** 구조 (이미지, 여러 텍스트)
- **동적으로 추가**되는 리스트
- https://tanstack.com/virtual/latest

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

function App() {
  // The scrollable element for your list
  const parentRef = React.useRef(null)

  // The virtualizer
  const rowVirtualizer = useVirtualizer({
    count: 10000,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  })

  return (
    <>
      {/* The scrollable element for your list */}
      <div
        ref={parentRef}
        style={{
          height: `400px`,
          overflow: 'auto', // Make it scroll!
        }}
      >
        {/* The large inner element to hold all of the items */}
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {/* Only the visible items in the virtualizer, manually positioned to be in view */}
          {rowVirtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              Row {virtualItem.index}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
```

---

## 📦 번들 크기 최적화

### Tree Shaking: 사용하지 않는 코드 제거

#### ❌ 전체 라이브러리 import
```javascript
import _ from 'lodash';
import * as lodash from 'lodash';

import * as MUI from '@mui/material';

import moment from 'moment';

const MyComponent = () => {
  const uniqueItems = _.uniqBy(data, 'id');  // uniqBy만 사용하는데 전체 import
  return <MUI.Button>버튼</MUI.Button>;      // Button만 사용하는데 전체 import
};
```

#### ✅ 필요한 부분만 import
```javascript
import { uniqBy, groupBy, sortBy } from 'lodash-es';
import uniqBy from 'lodash-es/uniqBy';

import { Button, TextField, Dialog } from '@mui/material';
import Button from '@mui/material/Button';

import { format, parseISO } from 'date-fns';

const MyComponent = () => {
  const uniqueItems = uniqBy(data, 'id');
  const formattedDate = format(new Date(), 'yyyy-MM-dd');
  
  return <Button>버튼</Button>;
};
```

### 코드 스플리팅: 필요할 때만 로드

#### 1. 라우트 기반 스플리팅
```javascript
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// ✅ 페이지별로 코드 스플리팅
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Profile = lazy(() => import('./pages/Profile'));
const Admin = lazy(() => import('./pages/Admin'));

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>페이지 로딩 중...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
```

#### 2. 기능 기반 스플리팅
```javascript
// ✅ 무거운 컴포넌트만 필요할 때 로드
const HeavyChart = lazy(() => import('./HeavyChart'));
const VideoPlayer = lazy(() => import('./VideoPlayer'));

const Dashboard = () => {
  const [showChart, setShowChart] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div>
      <h1>대시보드</h1>
      
      <button onClick={() => setShowChart(true)}>
        차트 보기
      </button>
      
      {showChart && (
        <Suspense fallback={<div>차트 로딩 중...</div>}>
          <HeavyChart />
        </Suspense>
      )}
      
      {showVideo && (
        <Suspense fallback={<div>비디오 로딩 중...</div>}>
          <VideoPlayer />
        </Suspense>
      )}
    </div>
  );
};
```

### 번들 분석 및 최적화

#### webpack-bundle-analyzer, next/bundle-analyzer 사용

#### 최적화 우선순위
```javascript
// 1. 가장 큰 라이브러리부터 최적화
// 2. 사용하지 않는 코드 제거
// 3. 가벼운 대안으로 교체

// 예시: 무거운 라이브러리 교체
// moment.js (67KB) → date-fns (2-5KB)
// lodash (70KB) → 필요한 함수만 또는 다른라이브러리 대체 (es-toolkit)
// Material-UI → Chakra UI 또는 필요한 컴포넌트만
```

---

## 🌐 네트워크 최적화

### API 호출 최적화

#### 1. 디바운싱으로 불필요한 호출 줄이기
```javascript
// ✅ 커스텀 디바운스 훅
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// ✅ 검색 최적화
const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  const debouncedQuery = useDebounce(query, 500);  // 500ms 후에 검색

  useEffect(() => {
    if (debouncedQuery) {
      searchAPI(debouncedQuery).then(setResults);
    }
  }, [debouncedQuery]);

  return (
    <input 
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="검색어 입력..."
    />
  );
};
```

#### 2. 캐싱으로 중복 요청 방지
```javascript
// ✅ SWR 또는 React Query 사용
import useSWR from 'swr';

const UserProfile = ({ userId }) => {
  const { data, error, isLoading } = useSWR(
    `/api/users/${userId}`,
    cachedFetch,
    {
      revalidateOnFocus: false,  // 포커스 시 재검증 비활성화
      dedupingInterval: 60000,   // 1분간 같은 요청 중복 제거
    }
  );

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생</div>;
  
  return <div>{data.name}</div>;
};
```

#### 3. 병렬 요청 최적화
```javascript
// ❌ 순차적 요청 (느림)
const SequentialRequests = () => {
  const [userData, setUserData] = useState(null);
  const [postsData, setPostsData] = useState(null);
  const [commentsData, setCommentsData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const user = await fetch('/api/user').then(r => r.json());
      setUserData(user);
      
      const posts = await fetch('/api/posts').then(r => r.json());
      setPostsData(posts);
      
      const comments = await fetch('/api/comments').then(r => r.json());
      setCommentsData(comments);
    };

    fetchData();
  }, []);

  return <div>...</div>;
};

// ✅ 병렬 요청 (빠름)
const ParallelRequests = () => {
  const [userData, setUserData] = useState(null);
  const [postsData, setPostsData] = useState(null);
  const [commentsData, setCommentsData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // 모든 요청을 동시에 시작
      const [user, posts, comments] = await Promise.all([
        fetch('/api/user').then(r => r.json()),
        fetch('/api/posts').then(r => r.json()),
        fetch('/api/comments').then(r => r.json())
      ]);

      setUserData(user);
      setPostsData(posts);
      setCommentsData(comments);
    };

    fetchData();
  }, []);

  return <div>...</div>;
};
```

### 이미지 최적화

#### 1. 지연 로딩 (Lazy Loading)
```javascript
// ✅ Intersection Observer로 지연 로딩
const LazyImage = ({ src, alt, ...props }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  return (
    <div ref={imgRef} {...props}>
      {imageSrc ? (
        <img 
          src={imageSrc} 
          alt={alt}
          onLoad={() => setLoading(false)}
          style={{ opacity: loading ? 0 : 1 }}
        />
      ) : (
        <div className="image-placeholder">로딩 중...</div>
      )}
    </div>
  );
};
```

#### 2. 적응형 이미지 로딩
```javascript
// ✅ 화면 크기에 따른 이미지 크기 최적화
const ResponsiveImage = ({ src, alt }) => {
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    const updateImageSrc = () => {
      const width = window.innerWidth;
      
      if (width < 768) {
        setImageSrc(`${src}?w=400`);      // 모바일: 400px
      } else if (width < 1024) {
        setImageSrc(`${src}?w=800`);      // 태블릿: 800px
      } else {
        setImageSrc(`${src}?w=1200`);     // 데스크톱: 1200px
      }
    };

    updateImageSrc();
    window.addEventListener('resize', updateImageSrc);
    
    return () => window.removeEventListener('resize', updateImageSrc);
  }, [src]);

  return <img src={imageSrc} alt={alt} />;
};
```

---

## 📊 측정 도구와 모니터링

### 개발 도구 활용

1. React DevTools Profiler
2. Chrome DevTools 활용
3. Lighthouse 점수 개선
