import React from 'react';
import Layout from '../components/layout/Layout';
import MobilePageHeader from '../components/layout/MobilePageHeader';
import Card from '../components/common/Card';
import { CheckCircleIcon, ClockIcon, AlertIcon } from '../components/common/Icons';
import { useNotifications } from '../hooks/useNotifications';

const Notifications: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon size={24} className="text-status-success" />;
      case 'warning':
        return <AlertIcon size={24} className="text-status-warning" />;
      case 'reminder':
        return <ClockIcon size={24} className="text-status-info" />;
      default:
        return <ClockIcon size={24} className="text-status-info" />;
    }
  };

  return (
    <Layout>
      <MobilePageHeader />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-navy dark:text-white mb-2">Notifications</h1>
            <p className="text-neutral-dark dark:text-neutral-gray">
              {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-accent-sky hover:text-accent-dark font-medium text-sm"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <Card className="p-12 text-center">
              <CheckCircleIcon size={48} className="mx-auto text-neutral-gray dark:text-neutral-dark mb-4" />
              <h3 className="text-xl font-bold text-neutral-darker dark:text-white mb-2">No notifications</h3>
              <p className="text-neutral-dark dark:text-neutral-gray">You're all caught up! Check back later for updates.</p>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`p-6 transition-all cursor-pointer ${
                  !notification.read ? 'border-l-4 border-accent-sky bg-accent-sky/5' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">{getIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-semibold text-neutral-darker dark:text-white">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="flex-shrink-0 w-2 h-2 bg-accent-sky rounded-full"></span>
                      )}
                    </div>
                    <p className="text-neutral-dark dark:text-neutral-gray mb-2">{notification.message}</p>
                    <p className="text-sm text-neutral-dark dark:text-neutral-gray">
                      {new Date(notification.time).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Notifications;
