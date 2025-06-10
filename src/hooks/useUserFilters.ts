import type { User } from '@/types/type';
import { useState } from 'react';

const useUserFilters = (users: User[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');

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

  return {
    searchTerm,
    sortBy,
    filterBy,
    setSearchTerm,
    setSortBy,
    setFilterBy,
    filteredUsers: filteredAndSortedUsers,
  };
};

export default useUserFilters;
