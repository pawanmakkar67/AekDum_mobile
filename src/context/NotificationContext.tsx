import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NOTIFICATIONS } from '../data/mockData';

interface Notification {
    id: string;
    type: 'bid' | 'outbid' | 'won' | 'order' | 'follow' | 'stream' | 'message';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    relatedId?: string;
    imageUrl?: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    addNotification: (notification: Omit<Notification, 'id'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS as Notification[]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(n => ({ ...n, read: true }))
        );
    };

    const addNotification = (notification: Omit<Notification, 'id'>) => {
        const newNotification: Notification = {
            ...notification,
            id: Date.now().toString(),
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    // Simulate receiving new notifications
    useEffect(() => {
        const interval = setInterval(() => {
            // Randomly add a notification every 30 seconds (for demo purposes)
            if (Math.random() > 0.7) {
                const types: Notification['type'][] = ['bid', 'outbid', 'stream', 'follow'];
                const randomType = types[Math.floor(Math.random() * types.length)];

                const messages: Record<Notification['type'], { title: string; message: string }> = {
                    bid: { title: 'Bid Placed', message: 'Your bid was successfully placed' },
                    outbid: { title: 'Outbid Alert', message: 'Someone outbid you on an item' },
                    stream: { title: 'Live Now', message: 'A seller you follow is now live' },
                    follow: { title: 'New Follower', message: 'Someone started following you' },
                    won: { title: 'You Won!', message: 'Congratulations! You won the auction' },
                    order: { title: 'Order Update', message: 'Your order has been shipped' },
                    message: { title: 'New Message', message: 'You have a new message' },
                };

                addNotification({
                    type: randomType,
                    title: messages[randomType].title,
                    message: messages[randomType].message,
                    timestamp: 'Just now',
                    read: false,
                });
            }
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                markAsRead,
                markAllAsRead,
                addNotification,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
};
