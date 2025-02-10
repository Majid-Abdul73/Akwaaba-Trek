import { create } from 'zustand';
import { supabase, subscribeToNotifications } from '../lib/supabase';

interface NotificationState {
  notifications: any[];
  unreadCount: number;
  initialize: (userId: string) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  addNotification: (notification: any) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  initialize: async (userId) => {
    // Fetch existing notifications
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (data) {
      set({ 
        notifications: data,
        unreadCount: data.filter(n => !n.read).length
      });
    }

    // Subscribe to new notifications
    subscribeToNotifications(userId, (payload) => {
      const notification = payload.new;
      get().addNotification(notification);
    });
  },
  markAsRead: async (notificationId) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (!error) {
      set(state => ({
        notifications: state.notifications.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
        unreadCount: state.unreadCount - 1
      }));
    }
  },
  addNotification: (notification) => {
    set(state => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }));
  }
}));