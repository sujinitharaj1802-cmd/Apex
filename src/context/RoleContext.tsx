import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../types';
import { DEMO_ROLES } from '../services/mockDataService';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  roleConfig: typeof DEMO_ROLES[UserRole];
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('operator');

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    try {
      localStorage.setItem('apex_demo_role', newRole);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('apex_demo_role') as UserRole;
      if (saved && DEMO_ROLES[saved]) {
        setRoleState(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        roleConfig: DEMO_ROLES[role],
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
