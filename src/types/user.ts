export interface UserPreferences {
  emailNotifications: boolean;
  rewardNotifications: boolean;
  transactionAlerts: boolean;
  themeMode: 'light' | 'dark';
  compactCurrency: boolean;
}

export interface UserProfile {
  id: string;
  fullName: string;
  firstName: string;
  email: string;
  phone: string;
  membershipTier: string;
  memberSince: string;
  initials: string;
  status: 'Active' | 'Demo';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: 'reward' | 'wallet' | 'transaction' | 'system';
  targetRoute?: '/app/dashboard' | '/app/transactions' | '/app/wallet' | '/app/profile';
  transactionId?: string;
}

