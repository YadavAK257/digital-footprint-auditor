import { Link } from 'react-router-dom';
import { CATEGORIES, thermalColor, riskLevel, monogram } from '../utils/accountMeta';

export function Monogram({ name = '', category = 'other', risk = 0.5, size = 40 }) {
  const initials = monogram(name);
  const level = riskLevel(risk);
  const color = thermalColor(risk);

  return (
    <div
      aria-label={name || 'Account'}
      title={category}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}, rgba(255,255,255,0.7))`,
        color: '#111827',
        border: '1px solid rgba(17,24,39,0.08)',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.35)',
      }}
      className="flex items-center justify-center rounded-full text-xs font-semibold"
    >
      {initials}
    </div>
  );
}

export default function AccountCard({ account, risk = 0.5, dependents = 0 }) {
  const category = CATEGORIES[account.category]?.label ?? 'Other';
  const level = riskLevel(risk);

  return (
    <li className="account-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Monogram name={account.name} category={account.category} risk={risk} size={42} />
          <div>
            <h3 className="font-semibold text-slate-900">{account.name}</h3>
            <p className="text-xs text-slate-500">{category}</p>
          </div>
        </div>

        <span
          className="rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide"
          style={{
            backgroundColor: `${thermalColor(risk)}22`,
            color: thermalColor(risk),
          }}
        >
          {level.label}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-600">
        <div className="account-metric-box">
          <div className="text-[10px] uppercase tracking-wide text-slate-400">2FA</div>
          <div className="mt-1 font-medium">{account.twoFactor ?? 'none'}</div>
        </div>
        <div className="account-metric-box">
          <div className="text-[10px] uppercase tracking-wide text-slate-400">Dependents</div>
          <div className="mt-1 font-medium">{dependents}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-slate-500">{account.permissions?.length ?? 0} permissions</span>
        <Link to={`/accounts/${account.id}`} className="text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-700 hover:decoration-slate-500">
          View details
        </Link>
      </div>
    </li>
  );
}
