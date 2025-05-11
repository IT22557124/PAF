import React from 'react';
import { markAsRead } from '../api/notificationsApi';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';

const NotificationCard = ({ notification, onUpdate }) => {
  const handleMarkAsRead = async () => {
    try {
      const userId = localStorage.getItem('userId');
      await markAsRead(notification.id, userId);
      onUpdate();
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  return (
    <div className={`p-4 rounded-lg shadow ${notification.read ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-sm text-gray-800">{notification.message}</p>
          <p className="text-xs text-gray-500 mt-1">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </p>
        </div>
        {!notification.read && (
          <button
            onClick={handleMarkAsRead}
            className="text-xs text-blue-500 hover:text-blue-600"
          >
            Mark as read
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationCard;
