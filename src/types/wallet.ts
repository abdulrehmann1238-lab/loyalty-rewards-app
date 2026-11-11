export type WalletProviderOption = 'browser' | 'demo';

export type WalletConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export type SimulatedErrorType =
  | 'none'
  | 'wallet_rejected'
  | 'network_unavailable'
  | 'balance_failed'
  | 'transactions_unavailable';

export interface NetworkInfo {
  chainId: number;
  name: string;
  shortName: string;
  rpcLabel: string;
  explorerLabel: string;
  isDemo: boolean;
}

export interface ContractMetadata {
  address: string;
  chainId: number;
  symbol: string;
  name: string;
  decimals: number;
  totalSupply: string;
  isDemo: boolean;
}

export interface WalletAccount {
  address: string;
  truncatedAddress: string;
  provider: WalletProviderOption;
  network: NetworkInfo;
  balance: number;
  formattedBalance: string;
  symbol: string;
  connectedAt: string;
}

