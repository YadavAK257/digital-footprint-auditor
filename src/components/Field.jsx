export default function Field({ label, htmlFor, hint, children }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
      <span className="block">{label}</span>
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
      <span className="mt-2 block">{children}</span>
    </label>
  );
}
