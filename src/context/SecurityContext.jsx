import { createContext, useContext, useEffect, useState } from "react";

const SecurityContext = createContext(null);

const SECURITY_EVENTS_KEY = "privacyhub.security.events";
const SECURITY_NOTIFICATIONS_KEY = "privacyhub.security.notifications";

const initialNotifications = [
  {
    id: 1,
    level: "red",
    title: "High Risk",
    text: "Instagram has no two-factor authentication enabled.",
    read: false,
    time: "Today, 10:33 AM",
  },
  {
    id: 2,
    level: "amber",
    title: "Action Required",
    text: "Review your account connections and permissions.",
    read: false,
    time: "Today, 10:00 AM",
  },
  {
    id: 3,
    level: "green",
    title: "Security Improved",
    text: "Two-factor authentication is active on Google.",
    read: true,
    time: "Today, 09:45 AM",
  },
];

const initialEvents = [
  {
    id: 1,
    level: "red",
    text: "Instagram marked as high risk",
    time: "10:32 AM",
    day: "Today",
  },
  {
    id: 2,
    level: "green",
    text: "Google 2FA enabled",
    time: "09:45 AM",
    day: "Today",
  },
  {
    id: 3,
    level: "info",
    text: "GitHub added to your digital footprint",
    time: "06:20 PM",
    day: "Yesterday",
  },
  {
    id: 4,
    level: "amber",
    text: "Facebook recovery connection requires review",
    time: "04:15 PM",
    day: "Yesterday",
  },
];

function readStoredList(key, fallback) {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    if (!value) {
      return fallback;
    }

    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function SecurityProvider({ children }) {
  const [notifications, setNotifications] = useState(() =>
    readStoredList(SECURITY_NOTIFICATIONS_KEY, initialNotifications)
  );

  const [events, setEvents] = useState(() =>
    readStoredList(SECURITY_EVENTS_KEY, initialEvents)
  );

  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const syncFromStorage = () => {
      setNotifications(
        readStoredList(SECURITY_NOTIFICATIONS_KEY, initialNotifications)
      );
      setEvents(readStoredList(SECURITY_EVENTS_KEY, initialEvents));
    };

    window.addEventListener("security-data-updated", syncFromStorage);

    return () => {
      window.removeEventListener("security-data-updated", syncFromStorage);
    };
  }, []);

  const persistSecurityData = (nextNotifications, nextEvents) => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      SECURITY_NOTIFICATIONS_KEY,
      JSON.stringify(nextNotifications)
    );
    window.localStorage.setItem(
      SECURITY_EVENTS_KEY,
      JSON.stringify(nextEvents)
    );
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        SECURITY_NOTIFICATIONS_KEY,
        JSON.stringify(notifications)
      );
    }
  }, [notifications]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        SECURITY_EVENTS_KEY,
        JSON.stringify(events)
      );
    }
  }, [events]);

  const createIncident = ({ sourceName, affectedAccounts }) => {
    const now = new Date();

    const incident = {
      id: `INC-${Date.now()}`,
      sourceName,
      affected: affectedAccounts,
      status: "open",
      detectedAt: now.toLocaleString(),
    };

    const nextNotifications = [
      {
        id: Date.now(),
        level: "red",
        title: "Security Breach Detected",
        text: `${sourceName} was compromised in a simulated breach. ${Math.max(
          affectedAccounts.length - 1,
          0
        )} connected account(s) may be affected.`,
        read: false,
        time: "Just now",
      },
      ...notifications,
    ];

    const nextEvents = [
      {
        id: Date.now() + 1,
        level: "red",
        text: `Simulated breach on ${sourceName}`,
        time: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        day: "Today",
      },
      ...events,
    ];

    setIncidents((current) => [incident, ...current]);
    setNotifications(nextNotifications);
    setEvents(nextEvents);
    persistSecurityData(nextNotifications, nextEvents);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("security-data-updated"));
    }

    return incident;
  };

  const secureIncident = (incidentId) => {
    const incident = incidents.find((item) => item.id === incidentId);

    if (!incident) return;

    const nextNotifications = [
      {
        id: Date.now(),
        level: "green",
        title: "Security Improved",
        text: `${incident.sourceName} has been secured.`,
        read: false,
        time: "Just now",
      },
      ...notifications,
    ];

    const nextEvents = [
      {
        id: Date.now() + 1,
        level: "green",
        text: `${incident.sourceName} secured`,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        day: "Today",
      },
      ...events,
    ];

    setIncidents((current) =>
      current.map((item) =>
        item.id === incidentId
          ? { ...item, status: "secured" }
          : item
      )
    );
    setNotifications(nextNotifications);
    setEvents(nextEvents);
    persistSecurityData(nextNotifications, nextEvents);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("security-data-updated"));
    }
  };

  const dismissIncident = (incidentId) => {
    const incident = incidents.find((item) => item.id === incidentId);

    if (!incident) return;

    const nextNotifications = [
      {
        id: Date.now(),
        level: "amber",
        title: "Incident Dismissed",
        text: `Incident involving ${incident.sourceName} was dismissed.`,
        read: false,
        time: "Just now",
      },
      ...notifications,
    ];

    const nextEvents = [
      {
        id: Date.now() + 1,
        level: "amber",
        text: `Incident involving ${incident.sourceName} dismissed`,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        day: "Today",
      },
      ...events,
    ];

    setIncidents((current) =>
      current.map((item) =>
        item.id === incidentId
          ? { ...item, status: "dismissed" }
          : item
      )
    );
    setNotifications(nextNotifications);
    setEvents(nextEvents);
    persistSecurityData(nextNotifications, nextEvents);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("security-data-updated"));
    }
  };

  const markAllRead = () => {
    const nextNotifications = notifications.map((notification) => ({
      ...notification,
      read: true,
    }));

    setNotifications(nextNotifications);
    persistSecurityData(nextNotifications, events);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("security-data-updated"));
    }
  };

  const value = {
    notifications,
    events,
    incidents,
    createIncident,
    secureIncident,
    dismissIncident,
    markAllRead,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurity() {
  const context = useContext(SecurityContext);

  if (!context) {
    throw new Error("useSecurity must be used inside SecurityProvider");
  }

  return context;
}

export default SecurityContext;