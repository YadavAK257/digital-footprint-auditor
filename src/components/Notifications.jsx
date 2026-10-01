import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Bell,
} from "lucide-react";
import { useSecurity } from "../context/SecurityContext";

const look = {
  red: {
    Icon: ShieldAlert,
    border: "border-l-red-500",
    text: "text-red-600",
    background: "bg-red-50",
  },

  amber: {
    Icon: AlertTriangle,
    border: "border-l-yellow-500",
    text: "text-yellow-600",
    background: "bg-yellow-50",
  },

  green: {
    Icon: ShieldCheck,
    border: "border-l-green-500",
    text: "text-green-600",
    background: "bg-green-50",
  },
};

function Notifications() {
  const { notifications, markAllRead } = useSecurity();

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <div className="bg-white border rounded-xl p-6">

      {/* Header */}

      <div className="flex items-center justify-between mb-6">

        <div>

          <div className="flex items-center gap-3">

            <Bell
              className="text-gray-700"
              size={22}
            />

            <h2 className="text-xl font-bold">
              Notifications
            </h2>

            {unreadCount > 0 && (
              <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                {unreadCount} unread
              </span>
            )}

          </div>

          <p className="text-gray-500 text-sm mt-1">
            Security events and important account alerts.
          </p>

        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-sm px-3 py-2 border rounded-lg hover:bg-gray-50"
          >
            Mark all as read
          </button>
        )}

      </div>

      {/* Notifications */}

      {notifications.length === 0 ? (
        <p className="py-6 text-gray-500">
          No notifications yet.
        </p>
      ) : (
        <ul className="space-y-3">

          {notifications.map(
            (notification) => {

              const config =
                look[notification.level] ||
                look.amber;

              const Icon = config.Icon;

              return (
                <li
                  key={notification.id}
                  className={`border border-l-4 rounded-lg p-4 ${
                    config.border
                  } ${
                    notification.read
                      ? "bg-white"
                      : config.background
                  }`}
                >

                  <div className="flex items-start gap-3">

                    <Icon
                      size={20}
                      className={`${config.text} mt-0.5`}
                    />

                    <div className="flex-1">

                      <div className="flex items-center justify-between gap-3">

                        <p
                          className={`font-semibold ${config.text}`}
                        >
                          {notification.title}
                        </p>

                        {!notification.read && (
                          <span className="w-2 h-2 bg-red-500 rounded-full" />
                        )}

                      </div>

                      <p className="text-gray-700 mt-1">
                        {notification.text}
                      </p>

                      <p className="text-xs text-gray-500 mt-2">
                        {notification.time}
                      </p>

                    </div>

                  </div>

                </li>
              );
            }
          )}

        </ul>
      )}

    </div>
  );
}

export default Notifications;