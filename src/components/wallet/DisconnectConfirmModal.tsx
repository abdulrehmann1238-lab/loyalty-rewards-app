import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Unlink } from 'lucide-react-native';
import { Button } from '@/components/common/Button';
import { ModalShell } from '@/components/common/ModalShell';
import { useToastStore } from '@/store/toastStore';
import { useWalletStore } from '@/store/walletStore';
import { useAppTheme } from '@/theme/ThemeContext';
import { FontFamilies, Radii } from '@/theme/tokens';

export function DisconnectConfirmModal() {
  const { colors } = useAppTheme();
  const visible = useWalletStore((s) => s.disconnectModalOpen);
  const setVisible = useWalletStore((s) => s.setDisconnectModalOpen);
  const account = useWalletStore((s) => s.account);
  const disconnectWallet = useWalletStore((s) => s.disconnectWallet);
  const showToast = useToastStore((s) => s.showToast);

  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await disconnectWallet();
    setLoading(false);
    showToast('Wallet disconnected', 'You can reconnect anytime from your dashboard.', 'info');
  };

  return (
    <ModalShell
      visible={visible}
      onClose={() => setVisible(false)}
      title="Disconnect wallet"
      subtitle="Are you sure you want to disconnect this wallet from your Verdant demo session?"
      maxWidth={420}
    >
      <View style={styles.content}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
          ]}
        >
          <View style={[styles.iconWrap, { backgroundColor: colors.errorSoft }]}>
            <Unlink size={18} color={colors.error} />
          </View>
          <View style={styles.cardMeta}>
            <Text style={[styles.label, { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular }]}>
              Connected Address
            </Text>
            <Text style={[styles.addr, { color: colors.text, fontFamily: FontFamilies.mono }]}>
              {account?.truncatedAddress ?? '0x71C7...9A42'}
            </Text>
          </View>
        </View>

        <Text style={[styles.note, { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular }]}>
          Your reward ledger remains visible, and you can reconnect your wallet in one click.
        </Text>

        <View style={styles.actions}>
          <Button
            label="Cancel"
            variant="outline"
            onPress={() => setVisible(false)}
            style={styles.flexBtn}
          />
          <Button
            label="Disconnect"
            variant="danger"
            loading={loading}
            onPress={handleConfirm}
            style={styles.flexBtn}
          />
        </View>
      </View>
    </ModalShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: Radii.md,
    borderWidth: 1,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardMeta: {
    gap: 2,
  },
  label: {
    fontSize: 12,
  },
  addr: {
    fontSize: 14,
  },
  note: {
    fontSize: 13.5,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  flexBtn: {
    flex: 1,
  },
});

