import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSocket } from '../services/socket';
import { useAuth } from './AuthContext';
import { AppNotification, Message } from '../types';
import { api } from '../services/api';

interface SocketContextType {
  unreadNotificationCount: number;
  notifications: AppNotification[];
  recentMessages: Message[];
  refreshNotifications: () => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  activeToast: { title: string; message: string; type?: string } | null;
  dismissToast: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState<number>(0);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [activeToast, setActiveToast] = useState<{ title: string; message: string; type?: string } | null>(null);

  const refreshNotifications = async () => {
    if (!user) return;
    try {
      const res = await api.getNotifications();
      setNotifications(res.notifications);
      setUnreadNotificationCount(res.unreadCount);
    } catch {
      // ignore
    }
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadNotificationCount((prev) => Math.max(0, prev - 1));
    } catch {
      // ignore
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadNotificationCount(0);
    } catch {
      // ignore
    }
  };

  const dismissToast = () => setActiveToast(null);

  useEffect(() => {
    if (!user) return;

    refreshNotifications();
    const socket = getSocket();

    // Join current user's personal channel
    socket.emit('join_user', user.id);

    const handleNewNotification = (notif: AppNotification) => {
      setNotifications((prev) => [notif, ...prev]);
      setUnreadNotificationCount((prev) => prev + 1);
      setActiveToast({
        title: notif.title,
        message: notif.message,
        type: notif.type,
      });

      setTimeout(() => {
        setActiveToast(null);
      }, 5000);
    };

    const handleReceiveMessage = (data: { message: Message }) => {
      setRecentMessages((prev) => [data.message, ...prev.slice(0, 19)]);
      if (data.message.senderId !== user.id) {
        setActiveToast({
          title: 'New Message',
          message: data.message.text,
          type: 'message',
        });
        setTimeout(() => {
          setActiveToast(null);
        }, 5000);
      }
    };

    socket.on('new_notification', handleNewNotification);
    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('new_notification', handleNewNotification);
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [user]);

  return (
    <SocketContext.Provider
      value={{
        unreadNotificationCount,
        notifications,
        recentMessages,
        refreshNotifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        activeToast,
        dismissToast,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
