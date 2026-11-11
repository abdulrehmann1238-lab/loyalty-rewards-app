import React, { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Check,
  ChevronRight,
  Copy,
  Edit3,
  KeyRound,
  LogOut,
  Settings,
  Shield,
  Unlink,
  Wallet,
} from 'lucide-react-native';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { AppShell } from '@/components/navigation/AppShell';
import {
  ChangePasswordModal,
  EditProfileModal,
  PrivacyPreferencesModal,
  SignOutModal,
} from '@/components/profile/ProfileModals';
import { useResponsive } from '@/hooks/useResponsive';
import { useToastStore } from '@/store/toastStore';
import { useUserStore } from '@/store/userStore';
import { useWalletStore } from '@/store/walletStore';
import { useAppTheme } from '@/theme/ThemeContext';
import { FontFamilies, Radii, TabularNumStyle } from '@/theme/tokens';
import { copyTextToClipboard } from '@/utils/clipboard';

export default function ProfileScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { isMobile } = useResponsive();

  const user = useUserStore((s) => s.user);
  const preferences = useUserStore((s) => s.preferences);
  const updatePreferences = useUserStore((s) => s.updatePreferences);
  const logout = useUserStore((s) => s.logout);

  const status = useWalletStore((s) => s.status);
  const account = useWalletStore((s) => s.account);
  const network = useWalletStore((s) => s.network);
  const setWalletModalOpen = useWalletStore((s) => s.setWalletModalOpen);
  const setDisconnectModalOpen = useWalletStore((s) => s.setDisconnectModalOpen);
  const showToast = useToastStore((s) => s.showToast);

  const [editOpen, setEditOpen] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const isConnected = status === 'connected' && !!account;

  const handleTogglePref = (
    key: 'emailNotifications' | 'rewardNotifications' | 'transactionAlerts',
    value: boolean,
    label: string
  ) => {
    updatePreferences({ [key]: value });
    showToast('Preferences saved.', `${label} ${value ? 'enabled' : 'paused'}.`, 'success');
  };

  const handleCopyAddress = async () => {
    if (!account) return;
    const ok = await copyTextToClipboard(account.address);
    if (ok) {
      setCopied(true);
      showToast('Wallet address copied.', account.truncatedAddress, 'success');
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const handleConfirmSignOut = () => {
    setSignOutOpen(false);
    logout();
    showToast('Signed out', 'Returned to welcome screen.', 'info');
    router.replace('/app/login');
  };

  return (
    <AppShell
      activeTab="profile"
      title="My Profile"
      subtitle="Member identity, linked wallet details, and account controls."
    >
      {/* Profile Hero Banner */}
      <Card padding={24}>
        <View style={[styles.heroRow, isMobile ? styles.heroRowMobile : undefined]}>
          <View style={styles.heroLeft}>
            <View style={[styles.avatarLarge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.avatarInitials, { fontFamily: FontFamilies.headingBold }]}>
                {user.initials}
              </Text>
            </View>
            <View style={styles.identity}>
              <View style={styles.nameBadgeRow}>
                <Text
                  style={[
                    styles.fullName,
                    { color: colors.text, fontFamily: FontFamilies.headingBold },
                  ]}
                >
                  {user.fullName}
                </Text>
                <View style={[styles.tierBadge, { backgroundColor: colors.goldSoft }]}>
                  <Text style={[styles.tierText, { color: colors.gold, fontFamily: FontFamilies.bodySemiBold }]}>
                    {user.membershipTier}
                  </Text>
                </View>
              </View>
              <Text style={[styles.emailText, { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular }]}>
                {user.email}
              </Text>
              <Text style={[styles.sinceText, { color: colors.textMuted, fontFamily: FontFamilies.bodyRegular }]}>
                Account Status: Active (Demo) · Member since {user.memberSince}
              </Text>
            </View>
          </View>

          <Button
            label="Edit Profile"
            variant="secondary"
            size="sm"
            leftIcon={<Edit3 size={14} color={colors.text} />}
            onPress={() => setEditOpen(true)}
          />
        </View>
      </Card>

      <View style={[styles.twoCol, isMobile ? styles.twoColStacked : undefined]}>
        {/* Personal Information */}
        <Card padding={22} style={styles.colCard}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: FontFamilies.headingSemiBold }]}>
            Personal Information
          </Text>
          <View
            style={[
              styles.kvBox,
              { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
            ]}
          >
            <InfoRow label="Full Name" value={user.fullName} />
            <InfoRow label="Email Address" value={user.email} />
            <InfoRow label="Phone Number" value={user.phone} tabular last />
          </View>
        </Card>

        {/* Wallet Information */}
        <Card padding={22} style={styles.colCard}>
          <View style={styles.walletHeadRow}>
            <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: FontFamilies.headingSemiBold }]}>
              Wallet Information
            </Text>
            <View
              style={[
                styles.statusChip,
                { backgroundColor: isConnected ? colors.successSoft : colors.warningSoft },
              ]}
            >
              <View
                style={[
                  styles.dot,
                  { backgroundColor: isConnected ? colors.success : colors.warning },
                ]}
              />
              <Text
                style={[
                  styles.statusChipText,
                  {
                    color: isConnected ? colors.success : colors.warning,
                    fontFamily: FontFamilies.bodySemiBold,
                  },
                ]}
              >
                {isConnected ? 'Connected' : 'Disconnected'}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.kvBox,
              { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
            ]}
          >
            <InfoRow
              label="Connection Status"
              value={isConnected ? 'Active Demo Wallet' : 'Not Connected'}
            />
            <View style={[styles.kvRow, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
              <Text style={[styles.kvKey, { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular }]}>
                Wallet Address
              </Text>
              {isConnected ? (
                <Pressable onPress={handleCopyAddress} style={styles.copyInline}>
                  <Text style={[styles.kvVal, TabularNumStyle, { color: colors.text, fontFamily: FontFamilies.mono }]}>
                    {account.truncatedAddress}
                  </Text>
                  {copied ? (
                    <Check size={14} color={colors.success} />
                  ) : (
                    <Copy size={14} color={colors.textSecondary} />
                  )}
                </Pressable>
              ) : (
                <Text style={[styles.kvVal, { color: colors.textMuted, fontFamily: FontFamilies.bodyRegular }]}>
                  —
                </Text>
              )}
            </View>
            <InfoRow label="Network" value={network.name} last />
          </View>

          <View style={styles.walletBtnWrap}>
            {isConnected ? (
              <Button
                label="Disconnect Wallet"
                variant="outline"
                size="sm"
                leftIcon={<Unlink size={14} color={colors.error} />}
                textStyle={{ color: colors.error }}
                onPress={() => setDisconnectModalOpen(true)}
              />
            ) : (
              <Button
                label="Connect Wallet"
                size="sm"
                leftIcon={<Wallet size={14} color={colors.textOnPrimary} />}
                onPress={() => setWalletModalOpen(true)}
              />
            )}
          </View>
        </Card>
      </View>

      {/* Preferences */}
      <Card padding={22}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: FontFamilies.headingSemiBold }]}>
          Preferences
        </Text>
        <View style={styles.switchList}>
          <PreferenceSwitch
            title="Email Notifications"
            description="Monthly reward summaries and partner announcements"
            value={preferences.emailNotifications}
            onValueChange={(v) => handleTogglePref('emailNotifications', v, 'Email notifications')}
          />
          <PreferenceSwitch
            title="Reward Notifications"
            description="Alerts when eligible purchases award RWD tokens"
            value={preferences.rewardNotifications}
            onValueChange={(v) => handleTogglePref('rewardNotifications', v, 'Reward notifications')}
          />
          <PreferenceSwitch
            title="Transaction Alerts"
            description="Status updates for confirmed and pending ledger activity"
            value={preferences.transactionAlerts}
            onValueChange={(v) => handleTogglePref('transactionAlerts', v, 'Transaction alerts')}
            last
          />
        </View>
      </Card>

      {/* Account Controls */}
      <Card padding={22}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: FontFamilies.headingSemiBold }]}>
          Account
        </Text>
        <View style={styles.accountList}>
          <AccountRow
            icon={KeyRound}
            label="Change Password"
            sub="Preview credential update flow"
            onPress={() => setPwdOpen(true)}
          />
          <AccountRow
            icon={Shield}
            label="Privacy Preferences"
            sub="Wallet address masking and local diagnostics"
            onPress={() => setPrivacyOpen(true)}
          />
          <AccountRow
            icon={Settings}
            label="Appearance & App Settings"
            sub="Light or dark theme and demo simulation controls"
            onPress={() => router.push('/app/settings')}
          />
          <AccountRow
            icon={LogOut}
            label="Sign Out"
            sub="Return to the login experience"
            danger
            last
            onPress={() => setSignOutOpen(true)}
          />
        </View>
      </Card>

      <EditProfileModal visible={editOpen} onClose={() => setEditOpen(false)} />
      <ChangePasswordModal visible={pwdOpen} onClose={() => setPwdOpen(false)} />
      <PrivacyPreferencesModal visible={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <SignOutModal
        visible={signOutOpen}
        onClose={() => setSignOutOpen(false)}
        onConfirm={handleConfirmSignOut}
      />
    </AppShell>
  );
}

function InfoRow({
  label,
  value,
  tabular = false,
  last = false,
}: {
  label: string;
  value: string;
  tabular?: boolean;
  last?: boolean;
}) {
  const { colors } = useAppTheme();
  return (
    <View
      style={[
        styles.kvRow,
        !last ? { borderBottomWidth: 1, borderBottomColor: colors.border } : undefined,
      ]}
    >
      <Text style={[styles.kvKey, { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular }]}>
        {label}
      </Text>
      <Text
        style={[
          styles.kvVal,
          tabular ? TabularNumStyle : undefined,
          { color: colors.text, fontFamily: FontFamilies.bodyMedium },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function PreferenceSwitch({
  title,
  description,
  value,
  onValueChange,
  last = false,
}: {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
  last?: boolean;
}) {
  const { colors } = useAppTheme();
  return (
    <View
      style={[
        styles.switchRow,
        !last ? { borderBottomWidth: 1, borderBottomColor: colors.border } : undefined,
      ]}
    >
      <View style={styles.switchText}>
        <Text style={[styles.switchTitle, { color: colors.text, fontFamily: FontFamilies.bodySemiBold }]}>
          {title}
        </Text>
        <Text style={[styles.switchDesc, { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular }]}>
          {description}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.sand, true: colors.primary }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

function AccountRow({
  icon: Icon,
  label,
  sub,
  onPress,
  danger = false,
  last = false,
}: {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  sub: string;
  onPress: () => void;
  danger?: boolean;
  last?: boolean;
}) {
  const { colors } = useAppTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.accountRow,
        !last ? { borderBottomWidth: 1, borderBottomColor: colors.border } : undefined,
        { opacity: pressed ? 0.75 : 1 },
      ]}
    >
      <View
        style={[
          styles.accountIcon,
          { backgroundColor: danger ? colors.errorSoft : colors.surfaceElevated },
        ]}
      >
        <Icon size={17} color={danger ? colors.error : colors.primary} />
      </View>
      <View style={styles.accountText}>
        <Text
          style={[
            styles.accountLabel,
            { color: danger ? colors.error : colors.text, fontFamily: FontFamilies.bodySemiBold },
          ]}
        >
          {label}
        </Text>
        <Text style={[styles.accountSub, { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular }]}>
          {sub}
        </Text>
      </View>
      <ChevronRight size={17} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  heroRowMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  heroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  avatarLarge: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: '#F8F7F2',
    fontSize: 22,
  },
  identity: {
    flex: 1,
    gap: 3,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  fullName: {
    fontSize: 21,
    letterSpacing: -0.3,
  },
  tierBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radii.pill,
  },
  tierText: {
    fontSize: 11.5,
  },
  emailText: {
    fontSize: 14,
  },
  sinceText: {
    fontSize: 12.5,
  },
  twoCol: {
    flexDirection: 'row',
    gap: 16,
  },
  twoColStacked: {
    flexDirection: 'column',
  },
  colCard: {
    flex: 1,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 16.5,
  },
  kvBox: {
    borderRadius: Radii.md,
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  kvRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
    flexWrap: 'wrap',
  },
  kvKey: {
    fontSize: 13,
  },
  kvVal: {
    fontSize: 13.5,
  },
  copyInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  walletHeadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.pill,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusChipText: {
    fontSize: 11.5,
  },
  walletBtnWrap: {
    alignItems: 'flex-start',
  },
  switchList: {
    marginTop: 8,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    gap: 14,
  },
  switchText: {
    flex: 1,
    gap: 2,
  },
  switchTitle: {
    fontSize: 14.5,
  },
  switchDesc: {
    fontSize: 12.5,
    lineHeight: 18,
  },
  accountList: {
    marginTop: 8,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    minHeight: 54,
  },
  accountIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountText: {
    flex: 1,
    gap: 2,
  },
  accountLabel: {
    fontSize: 14.5,
  },
  accountSub: {
    fontSize: 12.5,
  },
});

