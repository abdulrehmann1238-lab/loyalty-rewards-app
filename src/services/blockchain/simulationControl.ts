import { SimulatedErrorType } from '@/types/wallet';

let activeSimulatedError: SimulatedErrorType = 'none';

export function setSimulatedBlockchainError(error: SimulatedErrorType): void {
  activeSimulatedError = error;
}

export function getSimulatedBlockchainError(): SimulatedErrorType {
  return activeSimulatedError;
}

export function simulateLatency(minMs = 450, maxMs = 820): Promise<void> {
  const duration = Math.floor(minMs + Math.random() * (maxMs - minMs));
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export class BlockchainSimulationError extends Error {
  readonly code: SimulatedErrorType;

  constructor(code: SimulatedErrorType, message: string) {
    super(message);
    this.name = 'BlockchainSimulationError';
    this.code = code;
  }
}

export function assertNoSimulatedError(relevantErrors: SimulatedErrorType[]): void {
  if (activeSimulatedError !== 'none' && relevantErrors.includes(activeSimulatedError)) {
    switch (activeSimulatedError) {
      case 'wallet_rejected':
        throw new BlockchainSimulationError(
          'wallet_rejected',
          'Wallet connection request was declined in the wallet prompt.'
        );
      case 'network_unavailable':
        throw new BlockchainSimulationError(
          'network_unavailable',
          'Ethereum Sepolia (Demo) RPC endpoint is temporarily unreachable.'
        );
      case 'balance_failed':
        throw new BlockchainSimulationError(
          'balance_failed',
          'Unable to execute balanceOf(address) contract read right now.'
        );
      case 'transactions_unavailable':
        throw new BlockchainSimulationError(
          'transactions_unavailable',
          'Recent token transfer logs could not be fetched from the indexer.'
        );
      default:
        break;
    }
  }
}

