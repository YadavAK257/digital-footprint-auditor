import { Activity, BellRing, ShieldAlert, ShieldCheck, TrendingUp } from 'lucide-react';
import { useAccounts } from '../context/AccountsContext';
import { useSecurity } from '../context/SecurityContext';

function Dashboard() {
  const { accounts } = useAccounts();
  const { events, notifications } = useSecurity();

  const activeAccounts = accounts.filter((account) => !account.deleted);
  const topAccounts = [...activeAccounts]
    .sort((a, b) => new Date(b.lastActiveAt) - new Date(a.lastActiveAt))
    .slice(0, 3);

  const highRiskAccounts = activeAccounts.filter(
    (account) => account.breach || (account.twoFactor ?? 'none') === 'none'
  ).length;

  const openAlerts = notifications.filter((item) => !item.read).length;
  const recentEvents = events.slice(0, 3);
  const score = Math.max(
    42,
    Math.min(
      96,
      100 - Math.round((highRiskAccounts / Math.max(activeAccounts.length, 1)) * 35)
    )
  );

  const stats = [
    { label: 'Privacy score', value: `${score}`, trend: `${Math.max(1, score - 70)} pts`, tone: 'emerald', icon: ShieldCheck },
    { label: 'Tracked accounts', value: String(activeAccounts.length), trend: `${topAccounts.length} recent`, tone: 'sky', icon: Activity },
    { label: 'Open alerts', value: String(openAlerts), trend: `${notifications.length} total`, tone: 'amber', icon: BellRing },
    { label: 'Risk incidents', value: String(highRiskAccounts), trend: `${activeAccounts.filter((a) => a.breach).length} breached`, tone: 'rose', icon: ShieldAlert },
  ];

  const statusBreakdownBase = [
    { name: 'Email', value: activeAccounts.filter((a) => a.category === 'email').length, color: 'bg-cyan-500' },
    { name: 'Finance', value: activeAccounts.filter((a) => a.category === 'finance').length, color: 'bg-emerald-500' },
    { name: 'Shopping', value: activeAccounts.filter((a) => a.category === 'shopping').length, color: 'bg-violet-500' },
    { name: 'Work', value: activeAccounts.filter((a) => a.category === 'work').length, color: 'bg-amber-500' },
  ];

  const maxBreakdownValue = Math.max(...statusBreakdownBase.map((entry) => entry.value), 1);
  const statusBreakdown = statusBreakdownBase.map((item) => ({
    ...item,
    percentage: Math.max(12, Math.round((item.value / maxBreakdownValue) * 100)),
  }));

  return (
    <div className="p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="overflow-hidden rounded-[28px] bg-gradient-to-r from-slate-900 via-sky-900 to-teal-700 p-6 text-white shadow-lg shadow-slate-200">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-200">Security overview</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight">Live account protection</h1>
              <p className="mt-2 max-w-xl text-sm text-slate-200">
                {activeAccounts.length} accounts are being tracked right now. {highRiskAccounts} need attention across the linked footprint.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <div className="rounded-xl bg-emerald-400/20 p-2 text-emerald-300">
                <TrendingUp size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-200">Snapshot</p>
                <p className="text-lg font-semibold">{score}/100</p>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, trend, tone, icon: Icon }) => (
            <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
                </div>

                <div className={`rounded-xl p-2.5 ${
                  tone === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                  tone === 'sky' ? 'bg-sky-100 text-sky-600' :
                  tone === 'amber' ? 'bg-amber-100 text-amber-600' :
                  'bg-rose-100 text-rose-600'
                }`}>
                  <Icon size={18} />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="font-medium text-slate-900">{trend}</span>
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-100">
            <div className="mb-5">
              <p className="text-sm font-medium text-slate-500">Account snapshot</p>
              <h2 className="text-xl font-bold text-slate-900">Recent tracked accounts</h2>
            </div>

            <div className="space-y-4">
              {topAccounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">{account.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">{account.category} • {account.twoFactor === 'none' ? 'No 2FA' : '2FA enabled'}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${account.breach ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {account.breach ? 'Breached' : 'Healthy'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-100">
            <p className="text-sm font-medium text-slate-500">Exposure sources</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">Category mix</h2>

            <div className="mt-6 space-y-5">
              {statusBreakdown.map(({ name, value, color, percentage }) => (
                <div key={name}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{name}</span>
                    <span className="text-slate-500">{value}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-100">
            <p className="text-sm font-medium text-slate-500">Quick status</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">Protection health</h2>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-emerald-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emerald-700">2FA coverage</span>
                  <span className="text-sm font-medium text-emerald-700">
                    {Math.round((activeAccounts.filter((a) => a.twoFactor && a.twoFactor !== 'none').length / Math.max(activeAccounts.length, 1)) * 100)}%
                  </span>
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-emerald-100">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{
                      width: `${Math.round((activeAccounts.filter((a) => a.twoFactor && a.twoFactor !== 'none').length / Math.max(activeAccounts.length, 1)) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="rounded-2xl bg-sky-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sky-700">Alert load</span>
                  <span className="text-sm font-medium text-sky-700">{openAlerts} open</span>
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-sky-100">
                  <div
                    className="h-full rounded-full bg-sky-500"
                    style={{ width: `${Math.min(100, (openAlerts / Math.max(notifications.length, 1)) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-100">
            <div className="mb-4">
              <p className="text-sm font-medium text-slate-500">Latest signals</p>
              <h2 className="text-xl font-bold text-slate-900">Live security feed</h2>
            </div>

            <div className="space-y-4">
              {recentEvents.map((event) => (
                <div key={event.id} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className={`mt-1 h-2.5 w-2.5 rounded-full ${
                    event.level === 'red' ? 'bg-rose-500' : event.level === 'green' ? 'bg-emerald-500' : event.level === 'amber' ? 'bg-amber-500' : 'bg-sky-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-slate-700">{event.text}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{event.day} • {event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;