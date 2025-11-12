import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Notification {
  id: string;
  type: 'order' | 'prescription' | 'stock' | 'delivery';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif-1',
      type: 'order',
      title: 'Order Ready for Pickup',
      message: 'Your order ORD-001 is ready for pickup at Kacyiru Health Pharmacy',
      timestamp: '2 hours ago',
      read: false,
      actionUrl: '/orders/ORD-001'
    },
    {
      id: 'notif-2',
      type: 'prescription',
      title: 'Prescription Verified',
      message: 'Your prescription has been verified and approved by the pharmacy',
      timestamp: '5 hours ago',
      read: false,
      actionUrl: '/prescription'
    },
    {
      id: 'notif-3',
      type: 'delivery',
      title: 'Order Out for Delivery',
      message: 'Your order ORD-002 is out for delivery and will arrive within 1-2 hours',
      timestamp: '1 day ago',
      read: true,
      actionUrl: '/orders/ORD-002'
    },
    {
      id: 'notif-4',
      type: 'stock',
      title: 'Medicine Restocked',
      message: 'Amoxicillin 500mg is now back in stock at Downtown City Pharmacy',
      timestamp: '2 days ago',
      read: true,
      actionUrl: '/pharmacies/rx-002'
    },
    {
      id: 'notif-5',
      type: 'order',
      title: 'Order Confirmed',
      message: 'Your order ORD-003 has been confirmed and is being processed',
      timestamp: '3 days ago',
      read: true,
      actionUrl: '/orders/ORD-003'
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order': return '📦';
      case 'prescription': return '📋';
      case 'stock': return '💊';
      case 'delivery': return '🚚';
      default: return '🔔';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'order': return 'bg-blue-100 text-blue-800';
      case 'prescription': return 'bg-yellow-100 text-yellow-800';
      case 'stock': return 'bg-pharmacy-100 text-pharmacy-800';
      case 'delivery': return 'bg-primary-100 text-primary-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">🔔 Notifications</h1>
              <p className="text-primary-100">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="btn-secondary bg-white/20 text-white border-white hover:bg-white/30"
              >
                Mark All Read
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {notifications.length === 0 ? (
          <div className="card text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Notifications</h3>
            <p className="text-gray-600 mb-4">You're all caught up! Check back later for updates.</p>
            <Link to="/" className="btn-primary">
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`card transition-all duration-200 ${
                  !notification.read ? 'border-l-4 border-l-primary-600 bg-primary-50/50' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    getNotificationColor(notification.type)
                  }`}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{notification.title}</h3>
                        <p className="text-gray-700 mb-2">{notification.message}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{notification.timestamp}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            getNotificationColor(notification.type)
                          }`}>
                            {notification.type}
                          </span>
                          {!notification.read && (
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-primary-600 text-white">
                              New
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                            title="Mark as read"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Action Button */}
                    {notification.actionUrl && (
                      <div className="mt-3">
                        <Link
                          to={notification.actionUrl}
                          className="inline-block text-sm font-medium text-primary-600 hover:text-primary-700"
                          onClick={() => markAsRead(notification.id)}
                        >
                          View Details →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 card bg-primary-50 border-2 border-primary-200">
          <h3 className="font-bold text-gray-900 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Link to="/pharmacies" className="btn-secondary text-center text-sm py-2">
              Browse Pharmacies
            </Link>
            <Link to="/cart" className="btn-secondary text-center text-sm py-2">
              View Cart
            </Link>
            <Link to="/" className="btn-secondary text-center text-sm py-2">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

