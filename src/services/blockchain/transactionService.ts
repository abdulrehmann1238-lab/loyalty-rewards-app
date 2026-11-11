import { MOCK_TRANSACTIONS } from '@/data/mockTransactions';
import { TransactionItem } from '@/types/transaction';
import { assertNoSimulatedError, simulateLatency } from './simulationControl';

export const transactionService = {
  async getRecentTransactions(limit?: number): Promise<TransactionItem[]> {
    await simulateLatency(460, 820);
    assertNoSimulatedError(['transactions_unavailable', 'network_unavailable']);

    if (typeof limit === 'number' && limit > 0) {
      return MOCK_TRANSACTIONS.slice(0, limit);
    }
    return [...MOCK_TRANSACTIONS];
  },

  async getTransactionDetails(id: string): Promise<TransactionItem | null> {
    await simulateLatency(400, 680);
    assertNoSimulatedError(['transactions_unavailable', 'network_unavailable']);

    return MOCK_TRANSACTIONS.find((tx) => tx.id === id) ?? null;
  },
};

