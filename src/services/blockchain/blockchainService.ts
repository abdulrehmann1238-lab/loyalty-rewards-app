import { RewardSummary } from '@/types/rewards';
import { TransactionItem } from '@/types/transaction';
import {
  ContractMetadata,
  NetworkInfo,
  SimulatedErrorType,
  WalletAccount,
  WalletProviderOption,
} from '@/types/wallet';
import {
  DEMO_DISCLAIMER_NOTE,
  DEMO_ERC20_READ_ABI,
  DEMO_REWARD_CONTRACT_CONFIG,
} from './contractConfig';
import {
  getSimulatedBlockchainError,
  setSimulatedBlockchainError,
} from './simulationControl';
import { TokenBalanceReadResult, tokenService } from './tokenService';
import { transactionService } from './transactionService';
import { walletService } from './walletService';

/**
 * Unified Blockchain Service Facade
 * Phase One: Simulated local provider with realistic async latency & error injection.
 * Phase Two: Replace internal service calls with ethers.js / viem JSON-RPC reads.
 */
export const blockchainService = {
  contractConfig: DEMO_REWARD_CONTRACT_CONFIG,
  abi: DEMO_ERC20_READ_ABI,
  disclaimer: DEMO_DISCLAIMER_NOTE,

  connectWallet(provider: WalletProviderOption): Promise<WalletAccount> {
    return walletService.connectWallet(provider);
  },

  disconnectWallet(): Promise<void> {
    return walletService.disconnectWallet();
  },

  getWalletAddress(): Promise<string | null> {
    return walletService.getWalletAddress();
  },

  getTokenBalance(walletAddress?: string | null): Promise<TokenBalanceReadResult> {
    return tokenService.getTokenBalance(walletAddress);
  },

  getRecentTransactions(limit?: number): Promise<TransactionItem[]> {
    return transactionService.getRecentTransactions(limit);
  },

  getNetworkInfo(): Promise<NetworkInfo> {
    return walletService.getNetworkInfo();
  },

  getTransactionDetails(id: string): Promise<TransactionItem | null> {
    return transactionService.getTransactionDetails(id);
  },

  getContractMetadata(): Promise<ContractMetadata> {
    return tokenService.getContractMetadata();
  },

  getRewardSummarySnapshot(): RewardSummary {
    return tokenService.computeSummaryFromDataset();
  },

  setSimulatedError(error: SimulatedErrorType): void {
    setSimulatedBlockchainError(error);
  },

  getSimulatedError(): SimulatedErrorType {
    return getSimulatedBlockchainError();
  },
};

