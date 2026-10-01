export const accounts = [
  {
    id: 1,
    name: "Google",
    category: "Email",
    twoFA: false,
    passwordStatus: "reused",
    permissions: ["Contacts", "Location"],
    recoveryAccounts: [],
    lastActivity: "Today",
  },

  {
    id: 2,
    name: "Instagram",
    category: "Social Media",
    twoFA: true,
    passwordStatus: "unique",
    permissions: ["Camera", "Photos", "Location"],
    recoveryAccounts: ["Google"],
    lastActivity: "Yesterday",
  },

  {
    id: 3,
    name: "GitHub",
    category: "Developer",
    twoFA: true,
    passwordStatus: "unique",
    permissions: ["Profile"],
    recoveryAccounts: ["Google"],
    lastActivity: "Today",
  },

  {
    id: 4,
    name: "Spotify",
    category: "Entertainment",
    twoFA: false,
    passwordStatus: "reused",
    permissions: ["Location"],
    recoveryAccounts: ["Google"],
    lastActivity: "3 days ago",
  },
];