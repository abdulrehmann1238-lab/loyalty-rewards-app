import { create } from 'zustand';
import { INITIAL_NOTIFICATIONS } from '@/data/mockUser';
import { NotificationItem } from '@/types/user';

interface NotificationState {
  notifications: NotificationItem[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  restoreDemoNotifications: () => void;
  addNotification: (item: Omit<NotificationItem, 'id' | 'read' | 'timestamp'>) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: INITIAL_NOTIFICATIONS,

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  clearNotifications: () => set({ notifications: [] }),

  restoreDemoNotifications: () => set({ notifications: INITIAL_NOTIFICATIONS }),

  addNotification: (item) =>
    set((state) => ({
      notifications: [
        {
          ...item,
          id: `notif_${Date.now()}`,
          timestamp: 'Just now',
          read: false,
        },
        ...state.notifications,
      ],
    })),
}));

