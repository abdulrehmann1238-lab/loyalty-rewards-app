export function formatTokenAmount(amount: number, decimals = 2): string {
  const hasFraction = Math.abs(amount % 1) > 0.0001;
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: hasFraction ? decimals : 0,
    maximumFractionDigits: decimals,
  });
}

export function formatBalanceFixed(amount: number): string {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function truncateAddress(address: string, start = 6, end = 4): string {
  if (!address || address.length <= start + end + 3) {
    return address;
  }
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

export function truncateHash(hash: string, start = 10, end = 8): string {
  if (!hash || hash.length <= start + end + 3) {
    return hash;
  }
  return `${hash.slice(0, start)}...${hash.slice(-end)}`;
}

export function formatSignedRwd(amount: number, type: 'received' | 'redeemed', symbol = 'RWD'): string {
  const sign = type === 'received' ? '+' : '-';
  return `${sign}${formatTokenAmount(amount)} ${symbol}`;
}

