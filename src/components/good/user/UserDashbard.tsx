import UserFilters from '@/components/good/user/UserFilters';
import UserForm from '@/components/good/user/UserForm';
import UserTable from '@/components/good/user/UserTable';
import Modal from '@/components/good/user/common/Modal';
import useUserFilters from '@/hooks/useUserFilters';
import useUsers from '@/hooks/useUsers';
import type { User, UserFormData } from '@/types/type';
import { useState } from 'react';

function UserDashboard() {
  const { users, loading, error, createUser, updateUser, deleteUser } =
    useUsers();
  const {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
    filteredUsers,
  } = useUserFilters(users);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleAddUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleFormSubmit = async (formData: UserFormData) => {
    const result = editingUser
      ? await updateUser(editingUser.id, formData)
      : await createUser(formData);

    if (result?.success) {
      setShowModal(false);
      setEditingUser(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    await deleteUser(userId);
  };

  if (loading) return <div className="loading">로딩 중...</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>사용자 관리 대시보드</h1>
      </header>

      {error && <div className="error">{error}</div>}

      <UserFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        filterBy={filterBy}
        onFilterChange={setFilterBy}
        onAddUser={handleAddUser}
      />

      <UserTable
        users={filteredUsers}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onSort={setSortBy}
      />

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <UserForm
            user={editingUser}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowModal(false)}
          />
        </Modal>
      )}
    </div>
  );
}

export default UserDashboard;
