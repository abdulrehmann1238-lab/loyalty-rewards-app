import React, { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { FlaskConical, HelpCircle, Moon, RotateCcw, Sun } from 'lucide-react-native';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { AppShell } from '@/components/navigation/AppShell';
import { HelpSupportModal } from '@/components/settings/HelpSupportModal';
import { useResponsive } from '@/hooks/useResponsive';
import { useNotificationStore } from '@/store/notificationStore';
import { useToastStore } from '@/store/toastStore';
import { useUserStore } from '@/store/userStore';
import { useWalletStore } from '@/store/walletStore';
import { useAppTheme } from '@/theme/ThemeContext';
import { FontFamilies, Radii } from '@/theme/tokens';

export default function SettingsScreen() {
  const { colors, isDark, setThemeMode } = useAppTheme();
  const { isMobile } = useResponsive();

  const preferences = useUserStore((s) => s.preferences);
  const updatePreferences = useUserStore((s) => s.updatePreferences);
  const resetDemoUser = useUserStore((s) => s.resetDemoUser);
  const restoreDemoNotifications = useNotificationStore((s) => s.restoreDemoNotifications);
  const setDemoControlsOpen = useWalletStore((s) => s.setDemoControlsOpen);
  const clearErrors = useWalletStore((s) => s.clearErrors);
  const showToast = useToastStore((s) => s.showToast);

  const [helpOpen, setHelpOpen] = useState(false);

  const handleSaveFeedback = () => {
    showToast('Preferences saved.', 'Your settings are persisted locally in this demo.', 'success');
  };

  const handleResetDemo = () => {
    resetDemoUser();
    restoreDemoNotifications();
    clearErrors();
    showToast('Demo defaults restored', 'Profile, theme, and simulation state reset.', 'info');
  };

  return (
    <AppShell
      activeTab="settings"
      title="Settings"
      subtitle="Account preferences, notifications, appearance, and support."
    >
      {/* Appearance */}
      <Card padding={22}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: FontFamilies.headingSemiBold }]}>
          Appearance
        </Text>
        <Text style={[styles.sectionSub, { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular }]}>
          Warm Ivory is the default surface palette. Switch to Dark Pine if preferred.
        </Text>

        <View style={[styles.themeGrid, isMobile ? styles.themeGridMobile : undefined]}>
          <Pressable
            onPress={() => {
              setThemeMode('light');
              showToast('Light theme active', 'Warm Ivory surface palette enabled.', 'info');
            }}
            accessibilityRole="radio"
            accessibilityState={{ selected: !isDark }}
            style={[
              styles.themeCard,
              {
                backgroundColor: !isDark ? colors.primarySoft : colors.surfaceElevated,
                borderColor: !isDark ? colors.primary : colors.border,
              },
            ]}
          >
            <View style={[styles.themePreview, { backgroundColor: '#F8F7F2', borderColor: '#E7E0D3' }]}>
              <Sun size={18} color="#234B3B" />
            </View>
            <View style={styles.themeMeta}>
              <Text style={[styles.themeTitle, { color: colors.text, fontFamily: FontFamilies.bodySemiBold }]}>
                Light · Warm Ivory
              </Text>
              <Text style={[styles.themeDesc, { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular }]}>
                Default editorial palette
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => {
              setThemeMode('dark');
              showToast('Dark theme active', 'Deep Pine surface palette enabled.', 'info');
            }}
            accessibilityRole="radio"
            accessibilityState={{ selected: isDark }}
            style={[
              styles.themeCard,
              {
                backgroundColor: isDark ? colors.primarySoft : colors.surfaceElevated,
                borderColor: isDark ? colors.primary : colors.border,
              },
            ]}
          >
            <View style={[styles.themePreview, { backgroundColor: '#111714', borderColor: '#2B3831' }]}>
              <Moon size={18} color="#F8F7F2" />
            </View>
            <View style={styles.themeMeta}>
              <Text style={[styles.themeTitle, { color: colors.text, fontFamily: FontFamilies.bodySemiBold }]}>
                Dark · Deep Pine
              </Text>
              <Text style={[styles.themeDesc, { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular }]}>
                Calm low-light presentation
              </Text>
            </View>
          </Pressable>
        </View>
      </Card>

      {/* Notifications */}
      <Card padding={22}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: FontFamilies.headingSemiBold }]}>
          Notifications
        </Text>
        <View style={styles.switchList}>
          <SettingToggle
            label="Email Notifications"
            caption="Receive reward statements and account updates"
            value={preferences.emailNotifications}
            onChange={(v) => {
              updatePreferences({ emailNotifications: v });
              handleSaveFeedback();
            }}
          />
          <SettingToggle
            label="Reward Notifications"
            caption="Immediate alert when partner purchases mint RWD"
            value={preferences.rewardNotifications}
            onChange={(v) => {
              updatePreferences({ rewardNotifications: v });
              handleSaveFeedback();
            }}
          />
          <SettingToggle
            label="Transaction Alerts"
            caption="Updates when pending ledger events confirm"
            value={preferences.transactionAlerts}
            onChange={(v) => {
              updatePreferences({ transactionAlerts: v });
              handleSaveFeedback();
            }}
            last
          />
        </View>
      </Card>

      {/* Account Preferences */}
      <Card padding={22}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: FontFamilies.headingSemiBold }]}>
          Account Preferences
        </Text>
        <View style={styles.switchList}>
          <SettingToggle
            label="Compact Balance Display"
            caption="Use streamlined numerical formatting across mobile summary cards"
            value={preferences.compactCurrency}
            onChange={(v) => {
              updatePreferences({ compactCurrency: v });
              handleSaveFeedback();
            }}
            last
          />
        </View>

        <View style={styles.prefButtons}>
          <Button label="Save Preferences" size="sm" onPress={handleSaveFeedback} />
          <Button
            label="Reset Demo Defaults"
            variant="outline"
            size="sm"
            leftIcon={<RotateCcw size={14} color={colors.text} />}
            onPress={handleResetDemo}
          />
        </View>
      </Card>

      {/* Demo Controls & Help */}
      <View style={[styles.bottomGrid, isMobile ? styles.bottomGridMobile : undefined]}>
        <Card padding={22} style={styles.bottomCard}>
          <View style={styles.cardIconHead}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primarySoft }]}>
              <FlaskConical size={18} color={colors.primary} />
            </View>
            <View style={styles.cardHeadText}>
              <Text style={[styles.cardTitle, { color: colors.text, fontFamily: FontFamilies.headingSemiBold }]}>
                Demo Simulation Controls
              </Text>
              <Text style={[styles.cardSub, { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular }]}>
                Test wallet rejections, network outages, and contract read errors
              </Text>
            </View>
          </View>
          <Button
            label="Open Simulation Controls"
            variant="secondary"
            size="sm"
            onPress={() => setDemoControlsOpen(true)}
          />
        </Card>

        <Card padding={22} style={styles.bottomCard}>
          <View style={styles.cardIconHead}>
            <View style={[styles.iconCircle, { backgroundColor: colors.goldSoft }]}>
              <HelpCircle size={18} color={colors.gold} />
            </View>
            <View style={styles.cardHeadText}>
              <Text style={[styles.cardTitle, { color: colors.text, fontFamily: FontFamilies.headingSemiBold }]}>
                Help & Support
              </Text>
              <Text style={[styles.cardSub, { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular }]}>
                FAQs and simulated support message preview
              </Text>
            </View>
          </View>
          <Button
            label="Open Help Center"
            variant="secondary"
            size="sm"
            onPress={() => setHelpOpen(true)}
          />
        </Card>
      </View>

      <HelpSupportModal visible={helpOpen} onClose={() => setHelpOpen(false)} />
    </AppShell>
  );
}

function SettingToggle({
  label,
  caption,
  value,
  onChange,
  last = false,
}: {
  label: string;
  caption: string;
  value: boolean;
  onChange: (val: boolean) => void;
  last?: boolean;
}) {
  const { colors } = useAppTheme();
  return (
    <View
      style={[
        styles.toggleRow,
        !last ? { borderBottomWidth: 1, borderBottomColor: colors.border } : undefined,
      ]}
    >
      <View style={styles.toggleText}>
        <Text style={[styles.toggleLabel, { color: colors.text, fontFamily: FontFamilies.bodySemiBold }]}>
          {label}
        </Text>
        <Text style={[styles.toggleCaption, { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular }]}>
          {caption}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.sand, true: colors.primary }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 17,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 13.5,
    lineHeight: 20,
    marginBottom: 16,
  },
  themeGrid: {
    flexDirection: 'row',
    gap: 14,
  },
  themeGridMobile: {
    flexDirection: 'column',
  },
  themeCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 15,
    borderRadius: Radii.lg,
    borderWidth: 1.5,
  },
  themePreview: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeMeta: {
    flex: 1,
    gap: 2,
  },
  themeTitle: {
    fontSize: 14.5,
  },
  themeDesc: {
    fontSize: 12.5,
  },
  switchList: {
    marginTop: 6,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    gap: 14,
  },
  toggleText: {
    flex: 1,
    gap: 2,
  },
  toggleLabel: {
    fontSize: 14.5,
  },
  toggleCaption: {
    fontSize: 12.5,
    lineHeight: 18,
  },
  prefButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
  },
  bottomGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  bottomGridMobile: {
    flexDirection: 'column',
  },
  bottomCard: {
    flex: 1,
    gap: 16,
    justifyContent: 'space-between',
  },
  cardIconHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeadText: {
    flex: 1,
    gap: 3,
  },
  cardTitle: {
    fontSize: 15.5,
  },
  cardSub: {
    fontSize: 13,
    lineHeight: 19,
  },
});

