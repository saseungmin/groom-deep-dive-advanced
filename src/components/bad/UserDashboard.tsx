// 😱 안좋은 예시: God Component (만능 컴포넌트)
// 모든 걸 다 하려고 하는 500줄짜리 컴포넌트

import type { User, ValidationErrors } from '@/types/type';
import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';

const UserDashboard = () => {
  // 너무 많은 state들...
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
  });
  const [validation, setValidation] = useState<ValidationErrors>({});

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError('사용자 데이터를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (field: string) => {
    setSortBy(field);
  };

  const handleFilter = (filter: string) => {
    setFilterBy(filter);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = '이름은 필수입니다';
    if (!formData.email.includes('@'))
      errors.email = '올바른 이메일을 입력하세요';
    if (!formData.role) errors.role = '역할을 선택하세요';
    setValidation(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const url = editMode ? `/api/users/${selectedUser?.id}` : '/api/users';
      const method = editMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        if (editMode) {
          setUsers((prev) =>
            prev.map((user) =>
              user.id === updatedUser.id ? updatedUser : user,
            ),
          );
        } else {
          setUsers((prev) => [...prev, updatedUser]);
        }
        setShowModal(false);
        resetForm();
      }
    } catch (err) {
      setError('저장에 실패했습니다.');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', role: '', department: '' });
    setValidation({});
    setEditMode(false);
    setSelectedUser(null);
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (err) {
      setError('삭제에 실패했습니다.');
    }
  };

  // 복잡한 필터링 로직
  const filteredAndSortedUsers = users
    .filter((user) => {
      if (filterBy === 'all') return true;
      if (filterBy === 'active') return user.status === 'active';
      if (filterBy === 'inactive') return user.status === 'inactive';
      return true;
    })
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'email') return a.email.localeCompare(b.email);
      if (sortBy === 'role') return a.role.localeCompare(b.role);
      return 0;
    });

  useEffect(() => {
    fetchUsers();
  }, []);

  // 거대한 JSX 렌더링...
  return (
    <div className="dashboard">
      {/* 헤더 */}
      <header className="dashboard-header">
        <h1>사용자 관리 대시보드</h1>
      </header>

      {/* 컨트롤 패널 */}
      <div className="controls">
        <input
          type="text"
          placeholder="사용자 검색..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <select onChange={(e) => handleSort(e.target.value)} value={sortBy}>
          <option value="name">이름순</option>
          <option value="email">이메일순</option>
          <option value="role">역할순</option>
        </select>
        <select onChange={(e) => handleFilter(e.target.value)} value={filterBy}>
          <option value="all">전체</option>
          <option value="active">활성</option>
          <option value="inactive">비활성</option>
        </select>
        <button type="button" onClick={() => setShowModal(true)}>
          새 사용자 추가
        </button>
      </div>

      {/* 에러 메시지 */}
      {error && <div className="error">{error}</div>}

      {/* 로딩 */}
      {loading && <div className="loading">로딩 중...</div>}

      {/* 사용자 테이블 */}
      <div className="user-table">
        <table>
          <thead>
            <tr>
              <th
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSort('name');
                }}
                onClick={() => handleSort('name')}
              >
                이름
              </th>
              <th
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSort('email');
                }}
                onClick={() => handleSort('email')}
              >
                이메일
              </th>
              <th
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSort('role');
                }}
                onClick={() => handleSort('role')}
              >
                역할
              </th>
              <th>부서</th>
              <th>상태</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.department}</td>
                <td className={user.status}>{user.status}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUser(user);
                      setFormData(user);
                      setEditMode(true);
                      setShowModal(true);
                    }}
                  >
                    수정
                  </button>
                  <button type="button" onClick={() => handleDelete(user.id)}>
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 모달 */}
      {showModal && (
        <div
          className="modal-overlay"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setShowModal(false);
              resetForm();
            }
          }}
          onClick={() => {
            setShowModal(false);
            resetForm();
          }}
        >
          <div
            className="modal"
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.stopPropagation();
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{editMode ? '사용자 수정' : '새 사용자 추가'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">이름</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className={validation.name ? 'error' : ''}
                />
                {validation.name && (
                  <span className="error-text">{validation.name}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="email">이메일</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className={validation.email ? 'error' : ''}
                />
                {validation.email && (
                  <span className="error-text">{validation.email}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="role">역할</label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className={validation.role ? 'error' : ''}
                >
                  <option value="">선택하세요</option>
                  <option value="admin">관리자</option>
                  <option value="user">사용자</option>
                  <option value="guest">게스트</option>
                </select>
                {validation.role && (
                  <span className="error-text">{validation.role}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="department">부서</label>
                <input
                  id="department"
                  type="text"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      department: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="form-actions">
                <button type="submit">{editMode ? '수정' : '추가'}</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
