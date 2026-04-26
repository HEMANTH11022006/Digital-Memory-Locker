import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locked, setLocked] = useState(true);

  useEffect(() => {
    // Mock user for UI demonstration if Firebase isn't configured
    const savedUser = localStorage.getItem('locker_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // In production: signInWithEmailAndPassword(auth, email, password)
    const mockUser = { uid: '123', email };
    localStorage.setItem('locker_user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const signup = (email, password) => {
    // In production: createUserWithEmailAndPassword(auth, email, password)
    const mockUser = { uid: '123', email };
    localStorage.setItem('locker_user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const logout = () => {
    // In production: auth.signOut()
    localStorage.removeItem('locker_user');
    setUser(null);
    setLocked(true);
  };

  const unlock = () => setLocked(false);
  const lock = () => setLocked(true);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, locked, unlock, lock, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
