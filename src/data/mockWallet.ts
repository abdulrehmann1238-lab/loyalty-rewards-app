import { DailyRewardPoint } from '@/types/rewards';
import { NetworkInfo } from '@/types/wallet';

export const DEMO_WALLET_ADDRESS = '0x71C7656EC7ab88b098defB751B7401B5f6d89A42';
export const DEMO_WALLET_TRUNCATED = '0x71C7...9A42';
export const DEMO_TREASURY_ADDRESS = '0x4E92A18D3F0c71B9e60294C58D1aB28F9012C310';
export const DEMO_REDEMPTION_VAULT = '0x9A14C882E1f03b4D72A11C9F083dE44120B58E77';

export const DEMO_NETWORK: NetworkInfo = {
  chainId: 11155111,
  name: 'Ethereum Sepolia (Demo)',
  shortName: 'Sepolia Demo',
  rpcLabel: 'Simulated Sepolia Provider',
  explorerLabel: 'Sepolia Demo Explorer',
  isDemo: true,
};

export const DEMO_REWARD_BALANCE = 12840.5;
export const DEMO_TOTAL_EARNED = 18450;
export const DEMO_TOTAL_REDEEMED = 5609.5;
export const DEMO_TOKEN_SYMBOL = 'RWD';

export const REWARD_ACTIVITY_7D: DailyRewardPoint[] = [
  { day: 'Thu', dateLabel: 'Nov 5', earned: 145, redeemed: 0, balance: 12450.5 },
  { day: 'Fri', dateLabel: 'Nov 6', earned: 95, redeemed: 240, balance: 12305.5 },
  { day: 'Sat', dateLabel: 'Nov 7', earned: 620, redeemed: 0, balance: 12925.5 },
  { day: 'Sun', dateLabel: 'Nov 8', earned: 180, redeemed: 500, balance: 12605.5 },
  { day: 'Mon', dateLabel: 'Nov 9', earned: 340, redeemed: 0, balance: 12945.5 },
  { day: 'Tue', dateLabel: 'Nov 10', earned: 250, redeemed: 0, balance: 12720.5 },
  { day: 'Wed', dateLabel: 'Nov 11', earned: 120, redeemed: 0, balance: 12840.5 },
];

