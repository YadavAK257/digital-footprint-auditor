import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/accounts", label: "Accounts" },
  { to: "/footprint", label: "Digital Footprint" },
  { to: "/actions", label: "Security Actions" },
  { to: "/breach-simulator", label: "Breach Simulator" },
  { to: "/activity", label: "Activity" },
];

function Sidebar() {
  return (
    <aside className="w-76 min-h-screen border-r border-slate-800 bg-[linear-gradient(180deg,_#020817_0%,_#0f172a_34%,_#111827_100%)] px-5 py-6 text-slate-100 shadow-[0_18px_40px_rgba(15,23,42,0.2)]">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-sky-400 to-emerald-400 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20">
          P
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Privacy</p>
          <h1 className="text-xl font-bold tracking-tight">PrivacyHub</h1>
        </div>
      </div>

      <nav className="space-y-2.5">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                "block rounded-xl px-4 py-3.5 text-[0.95rem] font-medium transition-all duration-200 border",
                isActive
                  ? "border-sky-400/30 bg-[linear-gradient(135deg,_rgba(14,165,233,0.18),_rgba(16,185,129,0.12))] text-white shadow-lg shadow-sky-900/20"
                  : "border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-900/80 hover:text-white",
              ].join(" ")
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-inner shadow-slate-950/30">
        <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Status</p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-sm text-slate-300">Risk posture</span>
          <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 ring-1 ring-emerald-400/20">
            Stable
          </span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;