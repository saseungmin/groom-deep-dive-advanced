import type { User } from '@/types/propsDrilling';
import { createContext, useContext, useState } from 'react';

const UserContext = createContext<{
  user: User;
  updateUserProfile: (newData: Partial<User>) => void;
} | null>(null);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>({
    id: 1,
    name: '김철수',
    role: 'admin',
    theme: 'dark',
    language: 'ko',
    notifications: true,
  });

  const updateUserProfile = (newData: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...newData }));
  };

  return (
    <UserContext.Provider value={{ user, updateUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export default UserProvider;
