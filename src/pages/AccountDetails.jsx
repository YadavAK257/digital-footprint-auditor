import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { ArrowLeft, Check, Trash2 } from 'lucide-react';
import { useAccounts } from '../context/AccountsContext';
import { Monogram } from '../components/AccountCard';
import Field from '../components/Field';
import PermissionPanel from '../components/PermissionPanel';
import TwoFactorPicker from '../components/TwoFactorPicker';
import { CATEGORIES, SIGN_IN, daysSince, quickRisk, riskLevel, thermalColor } from '../utils/accountMeta';

// The score rolls to its new value whenever a setting changes.
function RiskNumber({ value, color }) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(value);
  const spring = useSpring(mv, { stiffness: 110, damping: 18 });
  const shown = useTransform(reduce ? mv : spring, (v) => Math.round(v));
  useEffect(() => { mv.set(value); }, [value, mv]);
  return (
    <motion.span className="font-display tnum text-8xl" style={{ color, transition: 'color 0.4s' }}>
      {shown}
    </motion.span>
  );
}

function explain(a, { recovers, reusePeers }) {
  const s = [];
  const tf = a.twoFactor ?? 'none';
  if (tf === 'none') s.push('Nothing beyond the password protects it.');
  else if (tf === 'sms') s.push('Its second step is an SMS code, which a SIM-swap can intercept.');
  if (a.breach) s.push(`It appeared in a breach in ${a.breach.year}.`);
  if (reusePeers.length) s.push(`Its password is shared with ${reusePeers.length} other ${reusePeers.length === 1 ? 'account' : 'accounts'}.`);
  if (recovers.length) s.push(`It is the recovery route for ${recovers.length} other ${recovers.length === 1 ? 'account' : 'accounts'}, so a takeover spreads.`);
  if (daysSince(a.lastActiveAt) > 180) s.push(`You have not used it in ${Math.floor(daysSince(a.lastActiveAt) / 30)} months. Consider deleting it.`);
  return s.length ? s.slice(0, 3).join(' ') : 'Nothing stands out. This account is in good shape.';
}

function LinkList({ title, items, relation }) {
  if (!items.length) return null;
  return (
    <div className="detail-link-list">
      <h3>{title}</h3>
      <ul>
        {items.map((x) => (
          <li key={x.id}>
            <Link to={`/accounts/${x.id}`}>
              {x.name}
            </Link>
            {relation && <span className="detail-link-relation">{relation(x)}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AccountDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accounts, updateAccount, removeAccount } = useAccounts();
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);

  const account = accounts.find((a) => a.id === id);
  if (!account) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16">
        <p className="font-note text-2xl">We could not find that account. It may have been deleted.</p>
        <Link to="/accounts" className="br-btn mt-6 inline-flex">Back to accounts</Link>
      </main>
    );
  }

  const save = (patch) => {
    updateAccount(account.id, patch);
    setSaved(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setSaved(false), 1600);
  };

  const others = accounts.filter((a) => a.id !== account.id && !a.deleted);
  const risk = account.risk ?? quickRisk(account, accounts);
  const color = thermalColor(risk);
  const level = riskLevel(risk);
  const recovers = others.filter((a) => a.recoveryEmailId === account.id || a.ssoProviderId === account.id);
  const recoveredBy = others.find((a) => a.id === account.recoveryEmailId);
  const ssoProvider = others.find((a) => a.id === account.ssoProviderId);
  const reusePeers = account.reuseGroup ? others.filter((a) => a.reuseGroup === account.reuseGroup) : [];
  const hasConnections = recovers.length || recoveredBy || ssoProvider || reusePeers.length;

  return (
    <main className="detail-page-shell">
      <div className="detail-page">
        <div className="detail-toolbar-row">
          <Link to="/accounts" className="detail-back-button">
            <ArrowLeft size={14} aria-hidden="true" />
            All accounts
          </Link>
          <span className="detail-status-text" aria-live="polite">
            {saved && (<><Check size={14} aria-hidden="true" />Changes saved</>)}
          </span>
        </div>

        <header className="detail-header">
          <div className="detail-account-identity">
            <Monogram name={account.name} category={account.category} risk={risk} size={58} />
            <div>
              <h1 className="detail-account-title">{account.name}</h1>
              <p className="detail-account-subtitle">
                {CATEGORIES[account.category]?.label ?? 'Other'}, signs in with {SIGN_IN[account.signIn ?? 'password'].toLowerCase()}
              </p>
            </div>
          </div>

          <div className="detail-risk-block">
            <RiskNumber value={Math.round(risk * 100)} color={color} />
            <p className="detail-risk-copy">{level.label} risk, out of 100</p>
          </div>
        </header>

        <p className="detail-summary-text">{explain(account, { recovers, reusePeers })}</p>
        <p className="detail-footnote">
          {account.risk !== undefined
            ? 'Includes risk flowing in from connected accounts.'
            : 'Based on this account alone. The map shows how risk spreads from connected accounts.'}
        </p>

        <div className="detail-layout">
          <div className="detail-main-column">
            <section className="detail-panel detail-panel-main">
              <h2 className="detail-panel-title">How you sign in</h2>

              <div className="detail-input-row">
                <Field label="Sign-in method" htmlFor="d-signin">
                  <select
                    id="d-signin"
                    className="br-input"
                    value={account.signIn ?? 'password'}
                    onChange={(e) => save({ signIn: e.target.value, ssoProviderId: e.target.value === 'sso' ? account.ssoProviderId : undefined })}
                  >
                    {Object.entries(SIGN_IN).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
                  </select>
                </Field>
                {account.signIn === 'sso' && (
                  <Field label="Signs in with" htmlFor="d-sso">
                    <select id="d-sso" className="br-input" value={account.ssoProviderId ?? ''} onChange={(e) => save({ ssoProviderId: e.target.value || undefined })}>
                      <option value="">Choose an account</option>
                      {others.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                  </Field>
                )}
              </div>

              <div className="detail-section-spacer">
                <p className="detail-field-label">Second step when signing in</p>
                <TwoFactorPicker value={account.twoFactor ?? 'none'} onChange={(twoFactor) => save({ twoFactor })} name="detail-2fa" />
              </div>

              <h2 className="detail-panel-title detail-panel-title-with-space">If you lose access</h2>
              <div className="detail-input-row detail-recovery-row">
                <Field label="Recovery email" htmlFor="d-rec">
                  <select id="d-rec" className="br-input" value={account.recoveryEmailId ?? ''} onChange={(e) => save({ recoveryEmailId: e.target.value || undefined })}>
                    <option value="">None</option>
                    {others.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </Field>
                <Field label="Recovery phone" htmlFor="d-phone" hint="A label like Jio SIM, not the number.">
                  <input
                    key={`phone-${account.id}`}
                    id="d-phone"
                    className="br-input"
                    defaultValue={account.recoveryPhone ?? ''}
                    onBlur={(e) => save({ recoveryPhone: e.target.value.trim() || undefined })}
                  />
                </Field>
                <Field label="Password group" htmlFor="d-group" hint="Same letter means same password.">
                  <input
                    key={`group-${account.id}`}
                    id="d-group"
                    maxLength={3}
                    className="br-input"
                    defaultValue={account.reuseGroup ?? ''}
                    onBlur={(e) => save({ reuseGroup: e.target.value.trim() || undefined })}
                  />
                </Field>
              </div>

              <h2 className="detail-panel-title detail-panel-title-with-space">History</h2>
              <div className="detail-input-row detail-history-row">
                <Field label="Last used" htmlFor="d-last">
                  <input
                    id="d-last"
                    type="date"
                    max={new Date().toISOString().slice(0, 10)}
                    className="br-input"
                    value={account.lastActiveAt ? account.lastActiveAt.slice(0, 10) : ''}
                    onChange={(e) => e.target.value && save({ lastActiveAt: new Date(e.target.value).toISOString() })}
                  />
                </Field>
                <div className="detail-history-checkbox">
                  <label className="detail-checkbox-label">
                    <input
                      type="checkbox"
                      checked={!!account.breach}
                      onChange={(e) => save({ breach: e.target.checked ? { year: new Date().getFullYear() - 1, severity: 0.6 } : null })}
                    />
                    Appeared in a known breach
                  </label>
                  {account.breach && (
                    <div className="detail-breach-grid">
                      <input
                        key={`by-${account.id}`}
                        aria-label="Breach year"
                        type="number"
                        min="2000"
                        max={new Date().getFullYear()}
                        className="br-input"
                        defaultValue={account.breach.year}
                        onBlur={(e) => e.target.value && save({ breach: { ...account.breach, year: Number(e.target.value) } })}
                      />
                      <select
                        aria-label="Breach severity"
                        className="br-input"
                        value={String(account.breach.severity)}
                        onChange={(e) => save({ breach: { ...account.breach, severity: Number(e.target.value) } })}
                      >
                        <option value="0.3">Minor</option>
                        <option value="0.6">Passwords exposed</option>
                        <option value="0.9">Passwords and data</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="detail-panel">
              <PermissionPanel permissions={account.permissions ?? []} onChange={(permissions) => save({ permissions })} />
            </section>
          </div>

          <aside className="detail-side-column">
            <div className="detail-side-panel">
              <h2 className="detail-side-title">Connections</h2>
              {hasConnections ? (
                <>
                  <LinkList title="Recovered through" items={recoveredBy ? [recoveredBy] : []} />
                  <LinkList title="Signs in with" items={ssoProvider ? [ssoProvider] : []} />
                  <LinkList
                    title={`Recovers ${recovers.length} ${recovers.length === 1 ? 'account' : 'accounts'}`}
                    items={recovers}
                    relation={(x) => (x.ssoProviderId === account.id ? 'sign-in' : 'recovery email')}
                  />
                  <LinkList title="Shares a password with" items={reusePeers} />
                </>
              ) : (
                <p className="detail-side-empty">
                  No connections recorded. Add a recovery email or password group to see how risk reaches this account.
                </p>
              )}
            </div>

            <div className="detail-side-action-wrap">
              <AnimatePresence mode="wait" initial={false}>
                {confirmDelete ? (
                  <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="detail-delete-confirm">
                    <p className="font-note text-lg">This removes {account.name} from your map and clears links that point to it.</p>
                    <div className="detail-delete-actions">
                      <button
                        type="button"
                        className="detail-delete-button danger"
                        onClick={() => { removeAccount(account.id); navigate('/accounts', { replace: true }); }}
                      >
                        <Trash2 size={14} aria-hidden="true" />
                        Delete account
                      </button>
                      <button type="button" className="detail-delete-button" onClick={() => setConfirmDelete(false)}>Keep it</button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="ask" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <button type="button" className="detail-delete-button" onClick={() => setConfirmDelete(true)}>
                      <Trash2 size={14} aria-hidden="true" />
                      Delete account record
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}