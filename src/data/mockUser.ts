import { NotificationItem, UserPreferences, UserProfile } from '@/types/user';

export const INITIAL_MOCK_USER: UserProfile = {
  id: 'usr_alex_morgan_01',
  fullName: 'Alex Morgan',
  firstName: 'Alex',
  email: 'alex.morgan@example.com',
  phone: '+1 (415) 890-4312',
  membershipTier: 'Rewards Member',
  memberSince: 'March 2024',
  initials: 'AM',
  status: 'Demo',
};

export const INITIAL_USER_PREFERENCES: UserPreferences = {
  emailNotifications: true,
  rewardNotifications: true,
  transactionAlerts: true,
  themeMode: 'light',
  compactCurrency: false,
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_01',
    title: 'Reward Received',
    message: 'You received 120 RWD from Coffee House.',
    timestamp: '2 hours ago',
    read: false,
    category: 'reward',
    targetRoute: '/app/transactions',
    transactionId: 'tx_001',
  },
  {
    id: 'notif_02',
    title: 'Wallet Connected',
    message: 'Your wallet 0x71C7...9A42 is connected on Ethereum Sepolia (Demo).',
    timestamp: 'Today, 09:15 AM',
    read: false,
    category: 'wallet',
    targetRoute: '/app/wallet',
  },
  {
    id: 'notif_03',
    title: 'Transaction Pending',
    message: 'A new transaction (+340 RWD from Fashion Store) has been recorded.',
    timestamp: '2 days ago',
    read: true,
    category: 'transaction',
    targetRoute: '/app/transactions',
    transactionId: 'tx_004',
  },
];

