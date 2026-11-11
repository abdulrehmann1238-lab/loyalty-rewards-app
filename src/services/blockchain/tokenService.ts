import { MOCK_TRANSACTIONS } from '@/data/mockTransactions';
import { DEMO_TOKEN_SYMBOL } from '@/data/mockWallet';
import { RewardSummary } from '@/types/rewards';
import { ContractMetadata } from '@/types/wallet';
import { DEMO_REWARD_CONTRACT_CONFIG } from './contractConfig';
import { assertNoSimulatedError, simulateLatency } from './simulationControl';

export interface TokenBalanceReadResult {
  balance: number;
  rawBalanceWei: string;
  symbol: string;
  decimals: number;
  contractAddress: string;
  lastSyncedAt: string;
}

export const tokenService = {
  async getTokenBalance(walletAddress?: string | null): Promise<TokenBalanceReadResult> {
    await simulateLatency(450, 760);
    assertNoSimulatedError(['balance_failed', 'network_unavailable']);

    const summary = this.computeSummaryFromDataset();
    return {
      balance: summary.totalBalance,
      rawBalanceWei: '12840500000000000000000',
      symbol: DEMO_TOKEN_SYMBOL,
      decimals: DEMO_REWARD_CONTRACT_CONFIG.decimals,
      contractAddress: DEMO_REWARD_CONTRACT_CONFIG.address,
      lastSyncedAt: walletAddress ? new Date().toISOString() : new Date().toISOString(),
    };
  },

  async getContractMetadata(): Promise<ContractMetadata> {
    await simulateLatency(400, 650);
    assertNoSimulatedError(['network_unavailable']);
    return DEMO_REWARD_CONTRACT_CONFIG;
  },

  computeSummaryFromDataset(): RewardSummary {
    const totalEarned = MOCK_TRANSACTIONS.filter((t) => t.type === 'received').reduce(
      (sum, t) => sum + t.amount,
      0
    );
    const totalRedeemed = MOCK_TRANSACTIONS.filter((t) => t.type === 'redeemed').reduce(
      (sum, t) => sum + t.amount,
      0
    );
    const pendingBalance = MOCK_TRANSACTIONS.filter((t) => t.status === 'Pending').reduce(
      (sum, t) => sum + t.amount,
      0
    );
    const totalBalance = Math.round((totalEarned - totalRedeemed) * 100) / 100;
    const availableBalance = Math.round((totalBalance - pendingBalance) * 100) / 100;

    return {
      totalBalance,
      availableBalance,
      pendingBalance,
      totalEarned,
      totalRedeemed,
      transactionCount: MOCK_TRANSACTIONS.length,
      tokenSymbol: DEMO_TOKEN_SYMBOL,
      weeklyDeltaPercent: 6.4,
    };
  },
};

