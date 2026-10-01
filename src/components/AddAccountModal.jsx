import { useState } from 'react';
import { useAccounts } from '../context/AccountsContext';

const categories = [
  'email',
  'finance',
  'shopping',
  'social',
  'work',
  'entertainment',
  'telecom',
  'other',
];

export default function AddAccountModal({ open, onClose }) {
  const { addAccount } = useAccounts();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('email');

  if (!open) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    addAccount({
      name: trimmed,
      category,
      signIn: 'password',
      twoFactor: 'none',
      permissions: [],
      lastActiveAt: new Date().toISOString(),
    });

    setName('');
    setCategory('email');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Add account</h2>
          <button type="button" onClick={onClose} className="text-sm text-slate-500 hover:text-slate-800">
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Account name
            <input
              autoFocus
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Example: ProtonMail"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-400"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-400"
            >
              {categories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700">
              Cancel
            </button>
            <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
              Save account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
