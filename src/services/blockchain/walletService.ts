import {
  DEMO_NETWORK,
  DEMO_REWARD_BALANCE,
  DEMO_TOKEN_SYMBOL,
  DEMO_WALLET_ADDRESS,
  DEMO_WALLET_TRUNCATED,
} from '@/data/mockWallet';
import { formatBalanceFixed } from '@/utils/format';
import { NetworkInfo, WalletAccount, WalletProviderOption } from '@/types/wallet';
import { assertNoSimulatedError, simulateLatency } from './simulationControl';

let currentWalletAccount: WalletAccount | null = null;

export const walletService = {
  async connectWallet(provider: WalletProviderOption): Promise<WalletAccount> {
    await simulateLatency(550, 880);
    assertNoSimulatedError(['wallet_rejected', 'network_unavailable']);

    const account: WalletAccount = {
      address: DEMO_WALLET_ADDRESS,
      truncatedAddress: DEMO_WALLET_TRUNCATED,
      provider,
      network: DEMO_NETWORK,
      balance: DEMO_REWARD_BALANCE,
      formattedBalance: formatBalanceFixed(DEMO_REWARD_BALANCE),
      symbol: DEMO_TOKEN_SYMBOL,
      connectedAt: new Date().toISOString(),
    };

    currentWalletAccount = account;
    return account;
  },

  async disconnectWallet(): Promise<void> {
    await simulateLatency(380, 560);
    currentWalletAccount = null;
  },

  async getWalletAddress(): Promise<string | null> {
    await simulateLatency(400, 620);
    assertNoSimulatedError(['network_unavailable']);
    return currentWalletAccount?.address ?? null;
  },

  async getNetworkInfo(): Promise<NetworkInfo> {
    await simulateLatency(400, 600);
    assertNoSimulatedError(['network_unavailable']);
    return DEMO_NETWORK;
  },

  seedConnectedState(provider: WalletProviderOption = 'demo'): WalletAccount {
    const account: WalletAccount = {
      address: DEMO_WALLET_ADDRESS,
      truncatedAddress: DEMO_WALLET_TRUNCATED,
      provider,
      network: DEMO_NETWORK,
      balance: DEMO_REWARD_BALANCE,
      formattedBalance: formatBalanceFixed(DEMO_REWARD_BALANCE),
      symbol: DEMO_TOKEN_SYMBOL,
      connectedAt: new Date().toISOString(),
    };
    currentWalletAccount = account;
    return account;
  },
};

