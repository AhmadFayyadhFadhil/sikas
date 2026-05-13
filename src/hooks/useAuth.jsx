import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext({});

// Helper untuk cek apakah user adalah admin
// Admin bisa ditentukan dari metadata custom claim atau daftar email admin
const checkIsAdmin = (user) => {
  if (!user) return false;
  
  // Cek dari custom claim di user metadata
  const role = user?.user_metadata?.role;
  if (role === 'admin') return true;
  
  // Atau cek dari daftar email admin (untuk development)
  const adminEmails = [
    'admin@rt.com',
    'pengurus@rt.com'
    // Tambahkan email admin lainnya di sini
  ];
  
  return adminEmails.includes(user?.email);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 1. Dapatkan sesi pertama kali
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      const userData = session?.user ?? null;
      setUser(userData);
      setIsAdmin(checkIsAdmin(userData));
      setLoading(false);
    });

    // 2. Dengarkan perubahan state autentikasi (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const userData = session?.user ?? null;
        setSession(session);
        setUser(userData);
        setIsAdmin(checkIsAdmin(userData));
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const logout = async () => {
    return supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, login, logout, loading, isAdmin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
