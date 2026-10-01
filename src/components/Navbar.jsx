import { useState } from 'react';
import { Bell, LogOut, Plus } from 'lucide-react';
import AddAccountModal from './AddAccountModal';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { user, logout } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 px-6 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] backdrop-blur-md">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-500">Overview</p>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Executive dashboard</h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,_#0f172a_0%,_#1e293b_100%)] px-4 py-2.5 text-[0.95rem] font-semibold text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-slate-700"
            >
              <Plus size={16} />
              Add account
            </button>

            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900"
              aria-label="Notifications"
            >
              <Bell size={17} />
            </button>

            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,_#38bdf8_0%,_#22c55e_100%)] text-sm font-semibold text-white">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Signed in</p>
                <p className="text-sm font-semibold text-slate-800">{user?.name || 'User'}</p>
              </div>
              <button
                type="button"
                onClick={logout}
                className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-rose-200 hover:text-rose-600"
                aria-label="Log out"
                title="Log out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AddAccountModal open={showAddModal} onClose={() => setShowAddModal(false)} />
    </>
  );
}

export default Navbar;