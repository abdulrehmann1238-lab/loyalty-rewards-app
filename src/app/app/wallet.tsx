import React from 'react';
import { AppShell } from '@/components/navigation/AppShell';
import { WalletDetailsView } from '@/components/wallet/WalletDetailsView';

export default function WalletScreen() {
  return (
    <AppShell
      activeTab="wallet"
      title="Digital Wallet"
      subtitle="Inspect your connected address, token balance, and simulated contract reads."
    >
      <WalletDetailsView />
    </AppShell>
  );
}

