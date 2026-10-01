import { createContext, useContext, useMemo, useState } from 'react';

const AUTH_STORAGE_KEY = 'privacyhub.auth.token';
const AUTH_SECRET = 'privacyhub-demo-secret';

const DUMMY_USERS = [
  {
    id: 'u-001',
    name: 'Aisha Patel',
    email: 'demo@privacyhub.com',
    password: 'password123',
    role: 'admin',
  },
  {
    id: 'u-002',
    name: 'Marcus Chen',
    email: 'analyst@privacyhub.com',
    password: 'securepass',
    role: 'analyst',
  },
];

const encodeBase64Url = (value) => {
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  const encoded = window.btoa(unescape(encodeURIComponent(text)));
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const decodeBase64Url = (segment) => {
  const normalized = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  const decoded = window.atob(padded);
  return decodeURIComponent(escape(decoded));
};

const createJwt = (payload) => {
  const header = encodeBase64Url({ alg: 'HS256', typ: 'JWT' });
  const body = encodeBase64Url({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
  });
  const signature = encodeBase64Url(`${AUTH_SECRET}.${header}.${body}`);

  return `${header}.${body}.${signature}`;
};

const parseJwt = (token) => {
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;
  const expectedSignature = encodeBase64Url(`${AUTH_SECRET}.${header}.${payload}`);

  if (signature !== expectedSignature) return null;

  try {
    const decodedPayload = JSON.parse(decodeBase64Url(payload));
    return decodedPayload;
  } catch {
    return null;
  }
};

const getStoredToken = () => {
  try {
    return window.localStorage.getItem(AUTH_STORAGE_KEY) || null;
  } catch {
    return null;
  }
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(() => {
    const storedToken = getStoredToken();
    const payload = parseJwt(storedToken);
    return payload ? { id: payload.sub, name: payload.name, email: payload.email, role: payload.role } : null;
  });

  const login = async (email, password) => {
    const foundUser = DUMMY_USERS.find(
      (candidate) => candidate.email.toLowerCase() === String(email).trim().toLowerCase() && candidate.password === password
    );

    if (!foundUser) {
      throw new Error('Invalid email or password. Try demo@privacyhub.com / password123');
    }

    const nextToken = createJwt({
      sub: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
    });

    setToken(nextToken);
    setUser({
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
    });

    try {
      window.localStorage.setItem(AUTH_STORAGE_KEY, nextToken);
    } catch {
      // Ignore storage failures so the app can still run in restricted environments.
    }

    return { token: nextToken, user: { ...foundUser } };
  };

  const logout = () => {
    setToken(null);
    setUser(null);

    try {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // Ignore storage failures.
    }
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(user && token),
      login,
      logout,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}

export const demoUsers = DUMMY_USERS;
