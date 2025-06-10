import type { User, UserFormData } from '@/types/type';
import { useEffect, useState } from 'react';

const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const createUser = async (user: UserFormData) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const newUser = await response.json();
        setUsers((prev) => [...prev, newUser]);

        return { success: true, user: newUser };
      }
    } catch (err) {
      setError('사용자 생성에 실패했습니다.');

      return { success: false, error: '사용자 생성에 실패했습니다.' };
    }
  };

  const updateUser = async (userId: string, user: UserFormData) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers((prev) =>
          prev.map((user) => (user.id === userId ? updatedUser : user)),
        );

        return { success: true, user: updatedUser };
      }
    } catch (err) {
      setError('사용자 업데이트에 실패했습니다.');

      return { success: false, error: '사용자 업데이트에 실패했습니다.' };
    }
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    try {
      await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      setUsers((prev) => prev.filter((user) => user.id !== userId));

      return { success: true };
    } catch (err) {
      setError('삭제에 실패했습니다.');

      return { success: false, error: '삭제에 실패했습니다.' };
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    deleteUser,
    createUser,
    updateUser,
  };
};

export default useUsers;
