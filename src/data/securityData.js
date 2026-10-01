export const securityAccounts = [
  {
    id: "google",
    name: "Google",
    type: "Identity",
    risk: "Medium",
    twoFA: true,
  },
  {
    id: "gmail",
    name: "Gmail",
    type: "Email",
    risk: "Low",
    twoFA: true,
  },
  {
    id: "instagram",
    name: "Instagram",
    type: "Social",
    risk: "High",
    twoFA: false,
  },
  {
    id: "github",
    name: "GitHub",
    type: "Developer",
    risk: "Medium",
    twoFA: false,
  },
  {
    id: "discord",
    name: "Discord",
    type: "Social",
    risk: "Medium",
    twoFA: true,
  },
  {
    id: "facebook",
    name: "Facebook",
    type: "Social",
    risk: "High",
    twoFA: false,
  },
];

export const connections = [
  {
    source: "google",
    target: "gmail",
    label: "SSO",
  },
  {
    source: "google",
    target: "github",
    label: "SSO",
  },
  {
    source: "gmail",
    target: "instagram",
    label: "Recovery",
  },
  {
    source: "gmail",
    target: "facebook",
    label: "Recovery",
  },
  {
    source: "instagram",
    target: "discord",
    label: "Connected",
  },
];

export const securityActions = [
  {
    id: 1,
    title: "Enable 2FA on Instagram",
    description:
      "Protect your Instagram account with two-factor authentication.",
    priority: "High",
    category: "2FA",
    completed: false,
  },
  {
    id: 2,
    title: "Enable 2FA on GitHub",
    description:
      "Add an additional authentication layer to your GitHub account.",
    priority: "Medium",
    category: "2FA",
    completed: false,
  },
  {
    id: 3,
    title: "Review Facebook recovery connection",
    description:
      "Check whether Facebook still needs this recovery connection.",
    priority: "Medium",
    category: "Recovery",
    completed: false,
  },
  {
    id: 4,
    title: "Review Instagram connections",
    description:
      "Review services connected to your Instagram account.",
    priority: "High",
    category: "Permissions",
    completed: false,
  },
];

export const activities = [
  {
    id: 1,
    title: "Instagram marked as high risk",
    description:
      "Instagram does not have two-factor authentication enabled.",
    time: "Today, 10:32 AM",
    type: "warning",
  },
  {
    id: 2,
    title: "Google 2FA enabled",
    description:
      "Two-factor authentication is active on Google.",
    time: "Today, 09:45 AM",
    type: "success",
  },
  {
    id: 3,
    title: "GitHub added",
    description:
      "GitHub was added to your digital footprint.",
    time: "Yesterday, 06:20 PM",
    type: "info",
  },
];


// --------------------------------------------------
// BREACH INCIDENT DATA
// --------------------------------------------------

export const breachIncidents = [];


// --------------------------------------------------
// SECURITY NOTIFICATIONS
// --------------------------------------------------

export const notifications = [
  {
    id: 1,
    level: "red",
    title: "High Risk",
    text:
      "Instagram has no two-factor authentication enabled.",
    read: false,
    time: "Today, 10:33 AM",
  },
  {
    id: 2,
    level: "amber",
    title: "Action Required",
    text:
      "Review your account connections and permissions.",
    read: false,
    time: "Today, 10:00 AM",
  },
  {
    id: 3,
    level: "green",
    title: "Security Improved",
    text:
      "Two-factor authentication is active on Google.",
    read: true,
    time: "Today, 09:45 AM",
  },
];