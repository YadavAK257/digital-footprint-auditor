const options = [
  { value: 'none', label: 'No 2FA' },
  { value: 'sms', label: 'SMS code' },
  { value: 'totp', label: 'Authenticator' },
  { value: 'passkey', label: 'Passkey' },
];

export default function TwoFactorPicker({ value, onChange, name }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => (
        <label key={option.value} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          <span className="text-sm font-medium text-slate-700">{option.label}</span>
        </label>
      ))}
    </div>
  );
}
