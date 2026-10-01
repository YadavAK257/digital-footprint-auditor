// Starter data so the screens are never empty. Replace with the team's shared seed when merging.
const ago = (days) => new Date(Date.now() - days * 864e5).toISOString();

export const seedAccounts = [
  { id: 'gmail', name: 'Gmail', category: 'email', value: 1, signIn: 'password', twoFactor: 'none', recoveryEmailId: 'yahoo', recoveryPhone: 'Jio SIM', reuseGroup: 'A', permissions: [{ name: 'Contacts', sensitivity: 0.6 }, { name: 'Drive files', sensitivity: 0.8 }], breach: null, lastActiveAt: ago(0), deleted: false },
  { id: 'yahoo', name: 'Old Yahoo Mail', category: 'email', value: 0.2, signIn: 'password', twoFactor: 'none', permissions: [], breach: { year: 2016, severity: 0.8 }, lastActiveAt: ago(900), deleted: false },
  { id: 'hdfc', name: 'HDFC NetBanking', category: 'finance', value: 1, signIn: 'password', twoFactor: 'sms', recoveryEmailId: 'gmail', recoveryPhone: 'Jio SIM', permissions: [], breach: null, lastActiveAt: ago(2), deleted: false },
  { id: 'paytm', name: 'Paytm', category: 'finance', value: 1, signIn: 'password', twoFactor: 'sms', recoveryEmailId: 'gmail', recoveryPhone: 'Jio SIM', permissions: [{ name: 'Payments', sensitivity: 0.9 }, { name: 'Contacts', sensitivity: 0.6 }], breach: null, lastActiveAt: ago(1), deleted: false },
  { id: 'zomato', name: 'Zomato', category: 'shopping', value: 0.2, signIn: 'password', twoFactor: 'none', recoveryEmailId: 'gmail', reuseGroup: 'A', permissions: [{ name: 'Location history', sensitivity: 0.7 }], breach: { year: 2022, severity: 0.6 }, lastActiveAt: ago(12), deleted: false },
  { id: 'flipkart', name: 'Flipkart', category: 'shopping', value: 0.5, signIn: 'password', twoFactor: 'none', recoveryEmailId: 'gmail', reuseGroup: 'A', permissions: [], breach: null, lastActiveAt: ago(5), deleted: false },
  { id: 'github', name: 'GitHub', category: 'work', value: 0.8, signIn: 'password', twoFactor: 'totp', recoveryEmailId: 'gmail', permissions: [], breach: null, lastActiveAt: ago(0), deleted: false },
  { id: 'notion', name: 'Notion', category: 'work', value: 0.5, signIn: 'sso', ssoProviderId: 'gmail', twoFactor: 'none', permissions: [{ name: 'Drive files', sensitivity: 0.8 }], breach: null, lastActiveAt: ago(8), deleted: false },
  { id: 'swiggy', name: 'Swiggy', category: 'shopping', value: 0.2, signIn: 'sso', ssoProviderId: 'gmail', twoFactor: 'none', permissions: [], breach: null, lastActiveAt: ago(3), deleted: false },
  { id: 'forum', name: 'Old hobby forum', category: 'other', value: 0.2, signIn: 'password', twoFactor: 'none', recoveryEmailId: 'yahoo', reuseGroup: 'A', permissions: [], breach: { year: 2021, severity: 0.9 }, lastActiveAt: ago(1200), deleted: false },
];