import { DEMO_NETWORK, DEMO_TOKEN_SYMBOL } from '@/data/mockWallet';
import { ContractMetadata } from '@/types/wallet';

/**
 * DEMONSTRATION DATA ONLY
 * Illustrative ERC-20 loyalty reward token configuration.
 * Not connected to a live deployed smart contract.
 * Structured for drop-in replacement by ethers.js or viem in Phase Two.
 */
export interface AbiParameter {
  name: string;
  type: string;
}

export interface ReadOnlyAbiEntry {
  name: string;
  type: 'function';
  stateMutability: 'view';
  inputs: AbiParameter[];
  outputs: AbiParameter[];
}

export const DEMO_REWARD_CONTRACT_CONFIG: ContractMetadata = {
  address: '0x3F8A21C94B7E10294D5C70A19B62D4E83C19F042',
  chainId: DEMO_NETWORK.chainId,
  symbol: DEMO_TOKEN_SYMBOL,
  name: 'Verdant Loyalty Token (Demo)',
  decimals: 18,
  totalSupply: '25,000,000 RWD',
  isDemo: true,
};

export const DEMO_ERC20_READ_ABI: readonly ReadOnlyAbiEntry[] = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    name: 'totalSupply',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

export const DEMO_DISCLAIMER_NOTE =
  'Demonstration mode: wallet state, ABI read outputs, and transaction records are simulated locally without a live RPC provider.';

