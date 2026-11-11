export interface DailyRewardPoint {
  day: string;
  dateLabel: string;
  earned: number;
  redeemed: number;
  balance: number;
}

export interface RewardSummary {
  totalBalance: number;
  availableBalance: number;
  pendingBalance: number;
  totalEarned: number;
  totalRedeemed: number;
  transactionCount: number;
  tokenSymbol: string;
  weeklyDeltaPercent: number;
}

