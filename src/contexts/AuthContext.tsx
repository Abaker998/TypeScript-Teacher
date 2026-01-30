'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (username: string, password: string) => Promise<{ error: { message: string } | null }>;
  signIn: (username: string, password: string) => Promise<{ error: { message: string } | null }>;
  signOut: () => Promise<void>;
}

const AUTH_STORAGE_KEY = 'typescript-teacher-auth';
const USERS_STORAGE_KEY = 'typescript-teacher-users';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getStoredUsers(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, string>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch {
    // Ignore storage errors
  }
}

function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);
    setLoading(false);
  }, []);

  const signUp = useCallback(async (username: string, password: string) => {
    const users = getStoredUsers();

    if (users[username]) {
      return { error: { message: 'This username is already taken.' } };
    }

    if (username.length < 3) {
      return { error: { message: 'Username must be at least 3 characters.' } };
    }

    if (password.length < 6) {
      return { error: { message: 'Password must be at least 6 characters.' } };
    }

    // Store the user (simple hash - not secure, but fine for local demo)
    users[username] = btoa(password);
    saveUsers(users);

    return { error: null };
  }, []);

  const signIn = useCallback(async (username: string, password: string) => {
    const users = getStoredUsers();

    if (!users[username]) {
      return { error: { message: 'No account found with this username.' } };
    }

    if (users[username] !== btoa(password)) {
      return { error: { message: 'Incorrect password.' } };
    }

    const newUser = { username };
    setUser(newUser);
    saveUser(newUser);

    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    setUser(null);
    saveUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
