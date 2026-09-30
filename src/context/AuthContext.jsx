// BHUMI SETU 360° - Authentication & Role Context
import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_USERS, USER_ROLES } from '../data/mockData';
import { auditService } from '../services/dataService';

const AuthContext = createContext();

const AUTH_STORAGE_KEY = 'bhumi_auth_user_v1';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error reading auth state', e);
    }
    // Default demo user: Revenue Officer
    return DEMO_USERS[0];
  });

  useEffect(() => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } catch (e) {
      console.error('Error saving auth state', e);
    }
  }, [currentUser]);

  const login = (role, customName = '') => {
    const matched = DEMO_USERS.find((u) => u.role === role) || DEMO_USERS[0];
    const userToSet = customName ? { ...matched, name: customName } : matched;
    setCurrentUser(userToSet);

    auditService.log({
      user: userToSet.name,
      role: userToSet.role,
      action: `Logged In to BHUMI SETU 360°`,
      module: 'Authentication',
      recordId: userToSet.id,
      status: 'Success',
      details: `Session initiated for role ${userToSet.role}`,
    });

    return userToSet;
  };

  const switchPersona = (role) => {
    return login(role);
  };

  const logout = () => {
    auditService.log({
      user: currentUser.name,
      role: currentUser.role,
      action: `Logged Out`,
      module: 'Authentication',
      recordId: currentUser.id,
      status: 'Success',
    });
    // For demo purposes, we can fall back to citizen or show logged out
    const defaultCitizen = DEMO_USERS.find((u) => u.role === USER_ROLES.CITIZEN);
    setCurrentUser(defaultCitizen);
  };

  // Helper getters
  const isCitizen = currentUser?.role === USER_ROLES.CITIZEN;
  const isRevenueOfficer = currentUser?.role === USER_ROLES.REVENUE_OFFICER;
  const isSurveyOfficer = currentUser?.role === USER_ROLES.SURVEY_OFFICER;
  const isDisputeAuthority = currentUser?.role === USER_ROLES.DISPUTE_AUTHORITY;
  const isAdmin = currentUser?.role === USER_ROLES.ADMINISTRATOR;
  const isPolicymaker = currentUser?.role === USER_ROLES.POLICYMAKER;
  const isSystemAuditor = currentUser?.role === USER_ROLES.SYSTEM_AUDITOR;

  // General official check
  const isOfficerOrAdmin = !isCitizen;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        switchPersona,
        USER_ROLES,
        DEMO_USERS,
        isCitizen,
        isRevenueOfficer,
        isSurveyOfficer,
        isDisputeAuthority,
        isAdmin,
        isPolicymaker,
        isSystemAuditor,
        isOfficerOrAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
