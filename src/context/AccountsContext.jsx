import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { seedAccounts } from '../data/seedAccounts';

/*
 * SHARED CONTRACT. Whoever owns state, keep these names stable:
 *   useAccounts() -> { accounts, addAccount, updateAccount, removeAccount, resetAccounts }
 * If the team already has a context, delete this file and point the imports at theirs.
 */
const STORAGE_KEY = 'blastradius.accounts.v1';
const AccountsContext = createContext(null);

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore corrupt storage and fall back to seed */
  }
  return seedAccounts;
}

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function AccountsProvider({ children }) {
  const [accounts, setAccounts] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
    } catch {
      /* storage full or blocked: keep working in memory */
    }
  }, [accounts]);

  const addAccount = useCallback((data) => {
    const account = {
      permissions: [],
      twoFactor: 'none',
      signIn: 'password',
      breach: null,
      lastActiveAt: new Date().toISOString(),
      deleted: false,
      ...data,
      id: `${slugify(data.name)}-${Math.random().toString(36).slice(2, 6)}`,
    };
    setAccounts((prev) => [...prev, account]);
    return account;
  }, []);

  const updateAccount = useCallback((id, patch) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }, []);

  // Also clears links that pointed at the removed account so nothing dangles.
  const removeAccount = useCallback((id) => {
    setAccounts((prev) =>
      prev
        .filter((a) => a.id !== id)
        .map((a) => ({
          ...a,
          recoveryEmailId: a.recoveryEmailId === id ? undefined : a.recoveryEmailId,
          ssoProviderId: a.ssoProviderId === id ? undefined : a.ssoProviderId,
        }))
    );
  }, []);

  const resetAccounts = useCallback(() => setAccounts(seedAccounts), []);

  return (
    <AccountsContext.Provider value={{ accounts, addAccount, updateAccount, removeAccount, resetAccounts }}>
      {children}
    </AccountsContext.Provider>
  );
}

export function useAccounts() {
  const ctx = useContext(AccountsContext);
  if (!ctx) throw new Error('useAccounts must be used inside <AccountsProvider>');
  return ctx;
}