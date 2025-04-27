import React, { useEffect, useState } from 'react';
import { getNotifications, markAllAsRead } from '../api/notificationsApi';
import NotificationCard from '../components/NotificationCard';
import { toast } from 'react-toastify';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const data = await getNotifications(userId);
      setNotifications(data);
    } catch (error) {
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const userId = localStorage.getItem('userId');
      await markAllAsRead(userId);
      fetchNotifications();
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark notifications as read');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button
          onClick={handleMarkAllAsRead}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Mark all as read
        </button>
      </div>
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onUpdate={fetchNotifications}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
