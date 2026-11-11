export type TransactionType = 'received' | 'redeemed';

export type TransactionStatus = 'Confirmed' | 'Pending';

export type TransactionFilterType = 'all' | 'received' | 'redeemed' | 'pending';

export type DateRangeFilter = 'all' | '7d' | '30d';

export type MerchantCategory =
  | 'coffee'
  | 'grocery'
  | 'fashion'
  | 'redemption'
  | 'dining'
  | 'travel'
  | 'wellness'
  | 'books';

export interface TransactionItem {
  id: string;
  merchant: string;
  description: string;
  category: MerchantCategory;
  type: TransactionType;
  typeLabel: string;
  amount: number;
  status: TransactionStatus;
  date: string; // ISO date string YYYY-MM-DD
  displayDate: string;
  time: string;
  txHash: string;
  fromAddress: string;
  toAddress: string;
  network: string;
  blockNumber: number;
  confirmations: number;
  purchaseTotal?: string;
}

