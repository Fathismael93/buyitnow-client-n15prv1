'use client';

import { createContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        updated,
        setUpdated,
        setUser,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
