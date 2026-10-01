// Shared constants and helpers for anything that displays or edits accounts.

export const TONES = { bad: '#F2897A', warn: '#EDBE5E', good: '#6FC2BF' };

export const CATEGORIES = {
  email: { label: 'Email', value: 1.0, shape: 'diamond' },
  finance: { label: 'Banking and payments', value: 1.0, shape: 'square' },
  shopping: { label: 'Shopping', value: 0.5, shape: 'hex' },
  social: { label: 'Social', value: 0.5, shape: 'circle' },
  work: { label: 'Work and dev', value: 0.8, shape: 'octagon' },
  entertainment: { label: 'Entertainment', value: 0.2, shape: 'leaf' },
  telecom: { label: 'Phone and SIM', value: 0.8, shape: 'shield' },
  other: { label: 'Other', value: 0.2, shape: 'soft' },
};

// Shape encodes category so colour is never the only signal.
export const SHAPE_STYLES = {
  diamond: { clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)' },
  square: { borderRadius: '8px' },
  hex: { clipPath: 'polygon(25% 4%, 75% 4%, 100% 50%, 75% 96%, 25% 96%, 0 50%)' },
  circle: { borderRadius: '50%' },
  octagon: { clipPath: 'polygon(30% 0, 70% 0, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0 70%, 0 30%)' },
  leaf: { borderRadius: '50% 50% 50% 10%' },
  shield: { clipPath: 'polygon(0 0, 100% 0, 100% 62%, 50% 100%, 0 62%)' },
  soft: { borderRadius: '32%' },
};

export const IMPORTANCE = [
  [0.2, 'Low'],
  [0.5, 'Medium'],
  [0.8, 'High'],
  [1.0, 'Critical'],
];

export const TWO_FACTOR = {
  none: { label: 'No 2FA', note: 'Anyone with the password can sign in.', tone: 'bad', weakness: 1 },
  sms: { label: 'SMS code', note: 'A SIM-swap can intercept the code.', tone: 'warn', weakness: 0.6 },
  totp: { label: 'Authenticator app', note: 'Codes stay on your phone.', tone: 'good', weakness: 0.2 },
  passkey: { label: 'Passkey or security key', note: 'Cannot be phished.', tone: 'good', weakness: 0.05 },
};

export const SIGN_IN = {
  password: 'Password',
  sso: 'Sign in with another account',
  passkey: 'Passkey',
};

export const PERMISSION_CATALOG = [
  { name: 'Read email', sensitivity: 0.9 },
  { name: 'Payments', sensitivity: 0.9 },
  { name: 'Drive files', sensitivity: 0.8 },
  { name: 'Location history', sensitivity: 0.7 },
  { name: 'Contacts', sensitivity: 0.6 },
  { name: 'Camera and microphone', sensitivity: 0.6 },
  { name: 'Post on your behalf', sensitivity: 0.5 },
  { name: 'Calendar', sensitivity: 0.4 },
  { name: 'Basic profile', sensitivity: 0.1 },
];

export const sensitivityLevel = (s) => (s >= 0.75 ? 3 : s >= 0.45 ? 2 : 1);
export const sensitivityLabel = (s) => ['', 'Low', 'Medium', 'High'][sensitivityLevel(s)];

export function daysSince(iso) {
  if (!iso) return 0;
  return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 864e5));
}

export function timeAgo(iso) {
  const d = daysSince(iso);
  if (d < 1) return 'today';
  if (d === 1) return 'yesterday';
  if (d < 60) return `${d} days ago`;
  if (d < 365) return `${Math.floor(d / 30)} months ago`;
  return 'over a year ago';
}

export function monogram(name = '') {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  const t = name.trim().slice(0, 2);
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/**
 * FALLBACK risk (0..1) using only this account's own factors (noisy-OR).
 * When the graph/engine teammate has propagated scores, store them on
 * account.risk and every screen here will prefer that value automatically.
 */
export function quickRisk(a, all = []) {
  const f = [];
  if (a.breach) {
    const yrs = Math.max(0, new Date().getFullYear() - a.breach.year);
    f.push(0.6 * a.breach.severity * Math.pow(0.7, yrs));
  }
  f.push(0.5 * TWO_FACTOR[a.twoFactor ?? 'none'].weakness);
  if (a.reuseGroup) {
    const n = all.filter((x) => !x.deleted && x.reuseGroup === a.reuseGroup).length;
    f.push(0.5 * Math.min(1, (n - 1) / 4));
  }
  f.push(0.3 * Math.max(0, ...(a.permissions || []).map((p) => p.sensitivity)));
  f.push(0.25 * Math.min(1, daysSince(a.lastActiveAt) / 30 / 24));
  return 1 - f.reduce((acc, x) => acc * (1 - x), 1);
}

export function riskLevel(r) {
  if (r < 0.2) return { key: 'low', label: 'Low' };
  if (r < 0.4) return { key: 'medium', label: 'Medium' };
  if (r < 0.6) return { key: 'high', label: 'High' };
  return { key: 'critical', label: 'Critical' };
}

const STOPS = [
  [0, [0x3f, 0x8f, 0x93]],
  [0.4, [0xe2, 0xb2, 0x4a]],
  [0.7, [0xe2, 0x74, 0x2f]],
  [1, [0xd6, 0x2f, 0x2f]],
];

export function thermalColor(r) {
  const x = Math.min(1, Math.max(0, r));
  for (let i = 1; i < STOPS.length; i++) {
    const [t1, c1] = STOPS[i];
    if (x <= t1) {
      const [t0, c0] = STOPS[i - 1];
      const k = (x - t0) / (t1 - t0);
      const c = c0.map((v, j) => Math.round(v + (c1[j] - v) * k));
      return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
    }
  }
  return 'rgb(214, 47, 47)';
}