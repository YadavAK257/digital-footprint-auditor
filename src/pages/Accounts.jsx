import { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, Search, X } from 'lucide-react';
import { useAccounts } from '../context/AccountsContext';
import AccountCard from '../components/AccountCard';
import AddAccountModal from '../components/AddAccountModal';
import { CATEGORIES, TWO_FACTOR, daysSince, quickRisk, riskLevel } from '../utils/accountMeta';

const RISK_FILTERS = [['all', 'All'], ['low', 'Low'], ['medium', 'Medium'], ['high', 'High'], ['critical', 'Critical']];
const DEFAULTS = { query: '', risk: 'all', category: 'all', twoFactor: 'all', shares: 'all', inactive: 'all', sort: 'risk' };

export default function Accounts() {
  const { accounts: all } = useAccounts();
  const accounts = useMemo(() => all.filter((a) => !a.deleted), [all]);
  const [f, setF] = useState(DEFAULTS);
  const [showAdd, setShowAdd] = useState(false);
  const set = (patch) => setF((p) => ({ ...p, ...patch }));
  const filtersActive = JSON.stringify(f) !== JSON.stringify(DEFAULTS);

  // Prefers a propagated score (account.risk) if the graph teammate adds one.
  const rows = useMemo(() => accounts.map((a) => ({ a, risk: a.risk ?? quickRisk(a, accounts) })), [accounts]);

  // How many accounts lean on each account for recovery or sign-in.
  const dependents = useMemo(() => {
    const m = {};
    accounts.forEach((a) => {
      new Set([a.recoveryEmailId, a.ssoProviderId].filter(Boolean)).forEach((id) => {
        m[id] = (m[id] || 0) + 1;
      });
    });
    return m;
  }, [accounts]);

  const counts = useMemo(() => {
    const c = { all: rows.length, low: 0, medium: 0, high: 0, critical: 0 };
    rows.forEach((r) => { c[riskLevel(r.risk).key] += 1; });
    return c;
  }, [rows]);

  const shown = useMemo(() => {
    const q = f.query.trim().toLowerCase();
    return rows
      .filter(({ a, risk }) => {
        if (q && !`${a.name} ${CATEGORIES[a.category]?.label ?? ''} ${a.reuseGroup ?? ''} ${a.recoveryPhone ?? ''}`.toLowerCase().includes(q)) return false;
        if (f.risk !== 'all' && riskLevel(risk).key !== f.risk) return false;
        if (f.category !== 'all' && a.category !== f.category) return false;
        if (f.twoFactor !== 'all' && (a.twoFactor ?? 'none') !== f.twoFactor) return false;
        if (f.shares === 'yes' && !(a.permissions || []).some((p) => p.sensitivity >= 0.45)) return false;
        if (f.inactive !== 'all' && daysSince(a.lastActiveAt) < Number(f.inactive)) return false;
        return true;
      })
      .sort((x, y) => {
        if (f.sort === 'name') return x.a.name.localeCompare(y.a.name);
        if (f.sort === 'recent') return new Date(y.a.lastActiveAt) - new Date(x.a.lastActiveAt);
        return y.risk - x.risk;
      });
  }, [rows, f]);

  const noSecondStep = accounts.filter((a) => (a.twoFactor ?? 'none') === 'none').length;

  return (
    <main className="account-page">
      <div className="account-shell">
        <header className="account-header">
          <div>
            <h1 className="account-title">Your accounts</h1>
            <p className="account-subtitle">
              {accounts.length === 0
                ? 'Nothing tracked yet.'
                : `${accounts.length} tracked. ${noSecondStep} ${noSecondStep === 1 ? 'has' : 'have'} no second step.`}
            </p>
          </div>
          <button type="button" className="br-btn" onClick={() => setShowAdd(true)}>
            <Plus size={16} aria-hidden="true" />
            Add account
          </button>
        </header>

        {accounts.length > 0 && (
          <section aria-label="Search and filters" className="account-filter-panel">
            <div className="account-search-wrap">
              <Search size={16} aria-hidden="true" />
              <input
                type="search"
                aria-label="Search accounts"
                placeholder="Search by name, type, password group or phone"
                className="br-input"
                value={f.query}
                onChange={(e) => set({ query: e.target.value })}
              />
            </div>

            <div className="filter-chip-row" role="group" aria-label="Risk level">
              {RISK_FILTERS.map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={f.risk === key}
                  onClick={() => set({ risk: key })}
                  className={f.risk === key ? 'filter-chip is-active' : 'filter-chip'}
                >
                  {label}
                  <span className="tnum opacity-70">{counts[key]}</span>
                </button>
              ))}
            </div>

            <div className="filter-grid">
              <select aria-label="Account type" className="br-input" value={f.category} onChange={(e) => set({ category: e.target.value })}>
                <option value="all">All types</option>
                {Object.entries(CATEGORIES).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
              </select>
              <select aria-label="2FA status" className="br-input" value={f.twoFactor} onChange={(e) => set({ twoFactor: e.target.value })}>
                <option value="all">Any 2FA status</option>
                {Object.entries(TWO_FACTOR).map(([k, t]) => <option key={k} value={k}>{t.label}</option>)}
              </select>
              <select aria-label="Data shared" className="br-input" value={f.shares} onChange={(e) => set({ shares: e.target.value })}>
                <option value="all">Any data access</option>
                <option value="yes">Has sensitive permissions</option>
              </select>
              <select aria-label="Last activity" className="br-input" value={f.inactive} onChange={(e) => set({ inactive: e.target.value })}>
                <option value="all">Any activity</option>
                <option value="90">Inactive 90+ days</option>
                <option value="180">Inactive 180+ days</option>
                <option value="365">Inactive over a year</option>
              </select>
              <select aria-label="Sort by" className="br-input" value={f.sort} onChange={(e) => set({ sort: e.target.value })}>
                <option value="risk">Highest risk first</option>
                <option value="name">Name</option>
                <option value="recent">Recently active</option>
              </select>
            </div>

            <div className="account-summary-row" aria-live="polite">
              <span>Showing {shown.length} of {accounts.length}</span>
              {filtersActive && (
                <button type="button" className="br-btn-quiet" onClick={() => setF(DEFAULTS)}>
                  <X size={14} aria-hidden="true" />
                  Clear filters
                </button>
              )}
            </div>
          </section>
        )}

        <section>
          {accounts.length === 0 ? (
            <div className="account-empty-state">
              <p className="font-note max-w-prose text-2xl">
                Start with your primary email. Most risk flows through it, so it shapes everything else on the map.
              </p>
              <button type="button" className="br-btn mt-6" onClick={() => setShowAdd(true)}>
                <Plus size={16} aria-hidden="true" />
                Add your first account
              </button>
            </div>
          ) : shown.length === 0 ? (
            <div className="account-empty-state">
              <p className="font-note text-2xl">Nothing matches these filters.</p>
              <button type="button" className="br-btn-quiet mt-4" onClick={() => setF(DEFAULTS)}>Clear filters</button>
            </div>
          ) : (
            <ul className="account-list">
              <AnimatePresence>
                {shown.map(({ a, risk }) => (
                  <AccountCard key={a.id} account={a} risk={risk} dependents={dependents[a.id] || 0} />
                ))}
              </AnimatePresence>
            </ul>
          )}
        </section>

        <AddAccountModal open={showAdd} onClose={() => setShowAdd(false)} />
      </div>
    </main>
  );
}