import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Notification {
  id: string;
  type: "low-stock" | "expiry" | "sales" | "system";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "low-stock",
    title: "Low Stock Alert",
    message: "Chicken Breast (SKU-2301) stock is below minimum threshold",
    timestamp: "2 hours ago",
    read: false,
    icon: "📦",
  },
  {
    id: "2",
    type: "expiry",
    title: "Product Expiry Alert",
    message: "Frozen Fish (SKU-3405) expires in 3 days",
    timestamp: "4 hours ago",
    read: false,
    icon: "⏰",
  },
  {
    id: "3",
    type: "sales",
    title: "Pending Sale",
    message: "Order #4521 from Customer ABC is awaiting approval",
    timestamp: "6 hours ago",
    read: false,
    icon: "💳",
  },
  {
    id: "4",
    type: "system",
    title: "System Event",
    message: "Database backup completed successfully",
    timestamp: "1 day ago",
    read: true,
    icon: "🔔",
  },
  {
    id: "5",
    type: "low-stock",
    title: "Low Stock Alert",
    message: "Ice Cream (SKU-5102) stock is below minimum threshold",
    timestamp: "1 day ago",
    read: true,
    icon: "📦",
  },
  {
    id: "6",
    type: "sales",
    title: "Pending Sale",
    message: "Order #4520 from Customer XYZ is awaiting approval",
    timestamp: "2 days ago",
    read: true,
    icon: "💳",
  },
];

interface NotificationPanelProps {
  onClose: () => void;
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>(
    mockNotifications
  );
  const [filter, setFilter] = useState<
    "all" | "low-stock" | "expiry" | "sales" | "system"
  >("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const handleClear = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "low-stock":
        return "bg-yellow-50 border-yellow-200";
      case "expiry":
        return "bg-orange-50 border-orange-200";
      case "sales":
        return "bg-blue-50 border-blue-200";
      case "system":
        return "bg-purple-50 border-purple-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "low-stock":
        return "Low Stock";
      case "expiry":
        return "Expiry Alert";
      case "sales":
        return "Sales";
      case "system":
        return "System";
      default:
        return "Notification";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
      ></div>

      {/* Panel */}
      <div className="absolute right-0 top-0 bottom-0 w-full sm:w-96 bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-border px-4 py-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-navy">Notifications</h2>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-600">
                  {unreadCount} unread notification
                  {unreadCount !== 1 ? "s" : ""}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-navy transition-colors text-xl"
            >
              ✕
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { value: "all", label: "All" },
              { value: "low-stock", label: "Stock" },
              { value: "expiry", label: "Expiry" },
              { value: "sales", label: "Sales" },
              { value: "system", label: "System" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() =>
                  setFilter(
                    tab.value as
                      | "all"
                      | "low-stock"
                      | "expiry"
                      | "sales"
                      | "system"
                  )
                }
                className={`text-xs px-2.5 py-1.5 rounded border transition-all ${
                  filter === tab.value
                    ? "bg-accent text-white border-accent"
                    : "bg-off-white border-border text-gray-600 hover:border-accent"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Bar */}
        {unreadCount > 0 && (
          <div className="px-4 py-2 bg-off-white border-b border-border flex items-center gap-2">
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs text-accent hover:text-accent-dark font-semibold transition-colors"
            >
              Mark all as read
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto scrollbar-visible">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-gray-600 font-medium">No notifications</p>
              <p className="text-sm text-gray-500">
                You're all caught up!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 border-l-4 border-l-transparent transition-all ${
                    notif.read
                      ? "bg-white"
                      : "bg-blue-50 border-l-accent"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="text-2xl flex-shrink-0">
                      {notif.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-navy text-sm">
                            {notif.title}
                          </h3>
                          <p className="text-xs text-gray-600 mt-1">
                            {getTypeLabel(notif.type)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleClear(notif.id)}
                          className="text-gray-400 hover:text-red transition-colors flex-shrink-0"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        {notif.message}
                      </p>
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200">
                        <span className="text-xs text-gray-500">
                          {notif.timestamp}
                        </span>
                        {!notif.read && (
                          <button
                            onClick={() => handleMarkAsRead(notif.id)}
                            className="text-xs text-accent hover:text-accent-dark font-semibold transition-colors"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
