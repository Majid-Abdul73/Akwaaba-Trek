import React from 'react';
import { Bell } from 'lucide-react';
import { useNotificationStore } from '../stores/notificationStore';
import { useAuthStore } from '../stores/authStore';

export function NotificationsPage() {
  const { user } = useAuthStore();
  const { notifications, initialize, markAsRead } = useNotificationStore();

  React.useEffect(() => {
    if (user) {
      initialize(user.id);
    }
  }, [user, initialize]);

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Bell className="h-6 w-6 text-indigo-600" />
        <h1 className="ml-2 text-2xl font-bold text-gray-900">Notifications</h1>
      </div>

      <div className="space-y-4">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-sm ${
              notification.read ? 'bg-white' : 'bg-indigo-50'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{notification.title}</h3>
                <p className="text-gray-600">{notification.content}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(notification.created_at).toLocaleDateString()}
                </p>
              </div>
              {!notification.read && (
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Mark as read
                </button>
              )}
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No notifications yet
          </div>
        )}
      </div>
    </div>
  );
}