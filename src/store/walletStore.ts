import { create } from 'zustand';
import { MOCK_TRANSACTIONS } from '@/data/mockTransactions';
import { DEMO_NETWORK, REWARD_ACTIVITY_7D } from '@/data/mockWallet';
import { blockchainService } from '@/services/blockchain/blockchainService';
import { DailyRewardPoint, RewardSummary } from '@/types/rewards';
import { TransactionItem } from '@/types/transaction';
import {
  NetworkInfo,
  SimulatedErrorType,
  WalletAccount,
  WalletConnectionStatus,
  WalletProviderOption,
} from '@/types/wallet';
import { formatBalanceFixed } from '@/utils/format';

interface WalletState {
  status: WalletConnectionStatus;
  account: WalletAccount | null;
  network: NetworkInfo;
  summary: RewardSummary;
  activity7d: DailyRewardPoint[];
  transactions: TransactionItem[];
  lastSyncedAt: string | null;

  isLoadingBalance: boolean;
  isLoadingTransactions: boolean;
  walletError: string | null;
  balanceError: string | null;
  transactionsError: string | null;
  simulatedError: SimulatedErrorType;

  walletModalOpen: boolean;
  disconnectModalOpen: boolean;
  demoControlsOpen: boolean;

  setWalletModalOpen: (open: boolean) => void;
  setDisconnectModalOpen: (open: boolean) => void;
  setDemoControlsOpen: (open: boolean) => void;
  setSimulatedError: (error: SimulatedErrorType) => void;

  connectWallet: (provider: WalletProviderOption) => Promise<boolean>;
  disconnectWallet: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  refreshDashboardData: () => Promise<void>;
  clearErrors: () => void;
}

const initialSummary = blockchainService.getRewardSummarySnapshot();

export const useWalletStore = create<WalletState>((set, get) => ({
  status: 'disconnected',
  account: null,
  network: DEMO_NETWORK,
  summary: initialSummary,
  activity7d: REWARD_ACTIVITY_7D,
  transactions: MOCK_TRANSACTIONS,
  lastSyncedAt: null,

  isLoadingBalance: false,
  isLoadingTransactions: false,
  walletError: null,
  balanceError: null,
  transactionsError: null,
  simulatedError: 'none',

  walletModalOpen: false,
  disconnectModalOpen: false,
  demoControlsOpen: false,

  setWalletModalOpen: (open) => set({ walletModalOpen: open, walletError: open ? null : get().walletError }),
  setDisconnectModalOpen: (open) => set({ disconnectModalOpen: open }),
  setDemoControlsOpen: (open) => set({ demoControlsOpen: open }),

  setSimulatedError: (error) => {
    blockchainService.setSimulatedError(error);
    set({
      simulatedError: error,
      walletError: error === 'none' ? null : get().walletError,
      balanceError: error === 'none' ? null : get().balanceError,
      transactionsError: error === 'none' ? null : get().transactionsError,
    });
  },

  clearErrors: () => {
    blockchainService.setSimulatedError('none');
    set({
      simulatedError: 'none',
      walletError: null,
      balanceError: null,
      transactionsError: null,
      status: get().account ? 'connected' : 'disconnected',
    });
  },

  connectWallet: async (provider) => {
    set({ status: 'connecting', walletError: null });
    try {
      const account = await blockchainService.connectWallet(provider);
      set({
        status: 'connected',
        account,
        network: account.network,
        lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        walletError: null,
      });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to connect wallet.';
      set({
        status: 'error',
        walletError: message,
      });
      return false;
    }
  },

  disconnectWallet: async () => {
    await blockchainService.disconnectWallet();
    set({
      status: 'disconnected',
      account: null,
      walletError: null,
      disconnectModalOpen: false,
    });
  },

  refreshBalance: async () => {
    set({ isLoadingBalance: true, balanceError: null });
    try {
      const result = await blockchainService.getTokenBalance(get().account?.address);
      const snapshot = blockchainService.getRewardSummarySnapshot();
      set((state) => ({
        isLoadingBalance: false,
        balanceError: null,
        summary: {
          ...snapshot,
          totalBalance: result.balance,
        },
        account: state.account
          ? {
              ...state.account,
              balance: result.balance,
              formattedBalance: formatBalanceFixed(result.balance),
            }
          : null,
        lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Balance fetch failed.';
      set({
        isLoadingBalance: false,
        balanceError: message,
      });
    }
  },

  refreshTransactions: async () => {
    set({ isLoadingTransactions: true, transactionsError: null });
    try {
      const items = await blockchainService.getRecentTransactions();
      set({
        isLoadingTransactions: false,
        transactionsError: null,
        transactions: items,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Transaction history unavailable.';
      set({
        isLoadingTransactions: false,
        transactionsError: message,
      });
    }
  },

  refreshDashboardData: async () => {
    await Promise.all([get().refreshBalance(), get().refreshTransactions()]);
  },
}));

