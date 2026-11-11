import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Bell,
  CheckCheck,
  ChevronDown,
  HelpCircle,
  Home,
  LayoutDashboard,
  LogOut,
  Receipt,
  Settings,
  Trash2,
  User,
  Wallet,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandLogo } from '@/components/common/BrandLogo';
import { DemoControlsModal, DemoModePill } from '@/components/common/DemoModeBanner';
import { EmptyState } from '@/components/common/EmptyState';
import { ModalShell } from '@/components/common/ModalShell';
import { SignOutModal } from '@/components/profile/ProfileModals';
import { HelpSupportModal } from '@/components/settings/HelpSupportModal';
import { DisconnectConfirmModal } from '@/components/wallet/DisconnectConfirmModal';
import { WalletConnectModal } from '@/components/wallet/WalletConnectModal';
import { LayoutMetrics } from '@/constants/layout';
import { useResponsive } from '@/hooks/useResponsive';
import { useNotificationStore } from '@/store/notificationStore';
import { useToastStore } from '@/store/toastStore';
import { useUserStore } from '@/store/userStore';
import { useAppTheme } from '@/theme/ThemeContext';
import { FontFamilies, Radii, Shadows } from '@/theme/tokens';

export type AppNavTab = 'dashboard' | 'transactions' | 'wallet' | 'profile' | 'settings';

interface AppShellProps {
  activeTab: AppNavTab;
  title: string;
  subtitle?: string;
  scrollable?: boolean;
  children: React.ReactNode;
}

export function AppShell({
  activeTab,
  title,
  subtitle,
  scrollable = true,
  children,
}: AppShellProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);
  const notifications = useNotificationStore((s) => s.notifications);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
  const clearNotifications = useNotificationStore((s) => s.clearNotifications);
  const restoreDemoNotifications = useNotificationStore((s) => s.restoreDemoNotifications);
  const showToast = useToastStore((s) => s.showToast);

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const sidebarItems: {
    key: AppNavTab | 'help';
    label: string;
    icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
    route?: string;
  }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, route: '/app/dashboard' },
    { key: 'transactions', label: 'Transactions', icon: Receipt, route: '/app/transactions' },
    { key: 'wallet', label: 'Wallet', icon: Wallet, route: '/app/wallet' },
    { key: 'profile', label: 'My Profile', icon: User, route: '/app/profile' },
    { key: 'settings', label: 'Settings', icon: Settings, route: '/app/settings' },
    { key: 'help', label: 'Help', icon: HelpCircle },
  ];

  const mobileTabs: {
    key: AppNavTab;
    label: string;
    icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
    route: string;
  }[] = [
    { key: 'dashboard', label: 'Home', icon: Home, route: '/app/dashboard' },
    { key: 'transactions', label: 'Activity', icon: Receipt, route: '/app/transactions' },
    { key: 'wallet', label: 'Wallet', icon: Wallet, route: '/app/wallet' },
    { key: 'profile', label: 'Profile', icon: User, route: '/app/profile' },
  ];

  const handleNavPress = (key: AppNavTab | 'help', route?: string) => {
    if (key === 'help') {
      setHelpOpen(true);
      return;
    }
    if (route) {
      router.push(route as any);
    }
  };

  const handleNotificationClick = (id: string, targetRoute?: string) => {
    markAsRead(id);
    setNotifOpen(false);
    if (targetRoute) {
      router.push(targetRoute as any);
    }
  };

  const handleSignOutConfirm = () => {
    setSignOutOpen(false);
    setProfileMenuOpen(false);
    logout();
    showToast('Signed out', 'Returned to welcome screen.', 'info');
    router.replace('/app/login');
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Desktop Sidebar / Tablet Rail */}
      {!isMobile ? (
        <View
          style={[
            styles.sidebar,
            {
              width: isDesktop ? LayoutMetrics.sidebarWidth : LayoutMetrics.tabletRailWidth,
              backgroundColor: colors.surfaceElevated,
              borderRightColor: colors.border,
              paddingTop: Math.max(insets.top, 20),
              paddingBottom: Math.max(insets.bottom, 20),
            },
          ]}
        >
          <View style={[styles.sidebarTop, !isDesktop ? styles.centered : undefined]}>
            <Pressable
              onPress={() => router.push('/')}
              accessibilityRole="button"
              accessibilityLabel="Back to Verdant marketing site"
              style={Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined}
            >
              <BrandLogo showWordmark={isDesktop} size={isDesktop ? 'md' : 'sm'} />
            </Pressable>

            {isDesktop ? (
              <Pressable
                onPress={() => router.push('/')}
                accessibilityRole="button"
                style={styles.backToSite}
              >
                <ArrowLeft size={13} color={colors.textSecondary} />
                <Text
                  style={[
                    styles.backToSiteText,
                    { color: colors.textSecondary, fontFamily: FontFamilies.bodyMedium },
                  ]}
                >
                  Product Overview
                </Text>
              </Pressable>
            ) : null}
          </View>

          <View style={styles.navList}>
            {sidebarItems.map((item) => {
              const isActive = activeTab === item.key;
              const Icon = item.icon;
              return (
                <Pressable
                  key={item.key}
                  onPress={() => handleNavPress(item.key, item.route)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                  accessibilityLabel={item.label}
                  style={({ pressed }) => [
                    styles.navItem,
                    !isDesktop ? styles.navItemRail : undefined,
                    {
                      backgroundColor: isActive ? colors.primary : 'transparent',
                      opacity: pressed ? 0.85 : 1,
                    },
                    Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined,
                  ]}
                >
                  <Icon
                    size={18}
                    color={isActive ? colors.textOnPrimary : colors.textSecondary}
                    strokeWidth={isActive ? 2.1 : 1.8}
                  />
                  {isDesktop ? (
                    <Text
                      style={[
                        styles.navLabel,
                        {
                          color: isActive ? colors.textOnPrimary : colors.text,
                          fontFamily: isActive ? FontFamilies.bodySemiBold : FontFamilies.bodyMedium,
                        },
                      ]}
                    >
                      {item.label}
                    </Text>
                  ) : (
                    <Text
                      style={[
                        styles.railLabel,
                        {
                          color: isActive ? colors.textOnPrimary : colors.textSecondary,
                          fontFamily: FontFamilies.bodyMedium,
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {item.label === 'My Profile'
                        ? 'Profile'
                        : item.label === 'Dashboard'
                        ? 'Home'
                        : item.label === 'Transactions'
                        ? 'Activity'
                        : item.label}
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Bottom User Summary */}
          <View style={styles.sidebarFooter}>
            <Pressable
              onPress={() => router.push('/app/profile')}
              accessibilityRole="button"
              accessibilityLabel="Open profile"
              style={[
                styles.userCard,
                !isDesktop ? styles.userCardRail : undefined,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                <Text style={[styles.avatarText, { fontFamily: FontFamilies.headingSemiBold }]}>
                  {user.initials}
                </Text>
              </View>
              {isDesktop ? (
                <View style={styles.userInfo}>
                  <Text
                    style={[styles.userName, { color: colors.text, fontFamily: FontFamilies.bodySemiBold }]}
                    numberOfLines={1}
                  >
                    {user.fullName}
                  </Text>
                  <Text
                    style={[
                      styles.userStatus,
                      { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular },
                    ]}
                    numberOfLines={1}
                  >
                    {user.membershipTier} · Demo
                  </Text>
                </View>
              ) : null}
            </Pressable>
          </View>
        </View>
      ) : null}

      {/* Main Content Area */}
      <View style={styles.mainColumn}>
        {/* Top Bar */}
        <View
          style={[
            styles.topBar,
            {
              paddingTop: isMobile ? Math.max(insets.top, 12) : 20,
              paddingHorizontal: isMobile ? 16 : 28,
              borderBottomColor: colors.border,
              backgroundColor: colors.background,
            },
          ]}
        >
          <View style={styles.topLeft}>
            {isMobile ? (
              <Pressable onPress={() => router.push('/')} style={styles.mobileLogoBtn}>
                <BrandLogo showWordmark={false} size="sm" />
              </Pressable>
            ) : null}
            <View style={styles.headingGroup}>
              <Text
                style={[
                  styles.pageTitle,
                  {
                    color: colors.text,
                    fontSize: isMobile ? 19 : 24,
                    fontFamily: FontFamilies.headingBold,
                  },
                ]}
                numberOfLines={1}
              >
                {title}
              </Text>
              {subtitle ? (
                <Text
                  style={[
                    styles.pageSubtitle,
                    { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular },
                  ]}
                  numberOfLines={1}
                >
                  {subtitle}
                </Text>
              ) : null}
            </View>
          </View>

          <View style={styles.topRight}>
            {!isMobile ? <DemoModePill /> : null}

            <Pressable
              onPress={() => setNotifOpen(true)}
              accessibilityRole="button"
              accessibilityLabel={`Notifications, ${unreadCount} unread`}
              style={[
                styles.iconActionBtn,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Bell size={18} color={colors.text} />
              {unreadCount > 0 ? (
                <View style={[styles.unreadDot, { backgroundColor: colors.primary }]}>
                  <Text style={styles.unreadCount}>{unreadCount}</Text>
                </View>
              ) : null}
            </Pressable>

            {isMobile ? (
              <Pressable
                onPress={() => router.push('/app/settings')}
                accessibilityRole="button"
                accessibilityLabel="Open settings"
                style={[
                  styles.iconActionBtn,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
              >
                <Settings size={18} color={colors.text} />
              </Pressable>
            ) : (
              <Pressable
                onPress={() => setProfileMenuOpen(true)}
                accessibilityRole="button"
                accessibilityLabel="Open account menu"
                style={[
                  styles.profilePill,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
              >
                <View style={[styles.smallAvatar, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.smallAvatarText, { fontFamily: FontFamilies.bodySemiBold }]}>
                    {user.initials}
                  </Text>
                </View>
                {isDesktop ? (
                  <Text
                    style={[styles.profileName, { color: colors.text, fontFamily: FontFamilies.bodyMedium }]}
                  >
                    {user.firstName}
                  </Text>
                ) : null}
                <ChevronDown size={14} color={colors.textSecondary} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Scrollable Content or Virtualized FlatList Container */}
        {scrollable ? (
          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingHorizontal: isMobile ? 16 : 28,
                paddingTop: isMobile ? 16 : 24,
                paddingBottom: isMobile
                  ? LayoutMetrics.mobileBottomNavHeight + Math.max(insets.bottom, 12) + 24
                  : 48,
              },
            ]}
          >
            <View style={[styles.innerMax, { maxWidth: LayoutMetrics.maxAppContentWidth }]}>
              {isMobile ? (
                <View style={styles.mobileDemoStrip}>
                  <DemoModePill />
                </View>
              ) : null}
              {children}
            </View>
          </ScrollView>
        ) : (
          <View style={styles.scroll}>{children}</View>
        )}

        {/* Mobile Bottom Tab Bar */}
        {isMobile ? (
          <View
            style={[
              styles.bottomNav,
              Shadows.card,
              {
                backgroundColor: colors.surface,
                borderTopColor: colors.border,
                paddingBottom: Math.max(insets.bottom, 8),
                height: LayoutMetrics.mobileBottomNavHeight + Math.max(insets.bottom, 0),
              },
            ]}
          >
            {mobileTabs.map((tab) => {
              const active = activeTab === tab.key;
              const Icon = tab.icon;
              return (
                <Pressable
                  key={tab.key}
                  onPress={() => router.push(tab.route as any)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={tab.label}
                  style={styles.bottomTab}
                >
                  <View
                    style={[
                      styles.bottomIconPill,
                      active ? { backgroundColor: colors.primarySoft } : undefined,
                    ]}
                  >
                    <Icon
                      size={20}
                      color={active ? colors.primary : colors.textSecondary}
                      strokeWidth={active ? 2.2 : 1.75}
                    />
                  </View>
                  <Text
                    style={[
                      styles.bottomLabel,
                      {
                        color: active ? colors.primary : colors.textSecondary,
                        fontFamily: active ? FontFamilies.bodySemiBold : FontFamilies.bodyMedium,
                      },
                    ]}
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}
      </View>

      {/* Notifications Modal / Dropdown Sheet */}
      <ModalShell
        visible={notifOpen}
        onClose={() => setNotifOpen(false)}
        title="Notifications"
        subtitle={
          unreadCount > 0
            ? `You have ${unreadCount} unread reward update${unreadCount > 1 ? 's' : ''}.`
            : 'All caught up.'
        }
        maxWidth={460}
      >
        <View style={styles.notifBody}>
          {notifications.length > 0 ? (
            <>
              <View style={styles.notifActionsTop}>
                <Pressable onPress={markAllAsRead} style={styles.inlineLinkBtn}>
                  <CheckCheck size={14} color={colors.primary} />
                  <Text
                    style={[
                      styles.inlineLinkText,
                      { color: colors.primary, fontFamily: FontFamilies.bodyMedium },
                    ]}
                  >
                    Mark all read
                  </Text>
                </Pressable>
                <Pressable onPress={clearNotifications} style={styles.inlineLinkBtn}>
                  <Trash2 size={14} color={colors.textSecondary} />
                  <Text
                    style={[
                      styles.inlineLinkText,
                      { color: colors.textSecondary, fontFamily: FontFamilies.bodyMedium },
                    ]}
                  >
                    Clear all
                  </Text>
                </Pressable>
              </View>

              <View style={styles.notifList}>
                {notifications.map((n) => (
                  <Pressable
                    key={n.id}
                    onPress={() => handleNotificationClick(n.id, n.targetRoute)}
                    accessibilityRole="button"
                    accessibilityLabel={`Notification: ${n.title}. ${n.message}`}
                    style={[
                      styles.notifCard,
                      {
                        backgroundColor: n.read ? colors.surfaceElevated : colors.primarySoft,
                        borderColor: n.read ? colors.border : colors.primary,
                      },
                    ]}
                  >
                    <View style={styles.notifTop}>
                      <View style={styles.notifTitleRow}>
                        {!n.read ? (
                          <View style={[styles.notifDot, { backgroundColor: colors.primary }]} />
                        ) : null}
                        <Text
                          style={[
                            styles.notifTitle,
                            { color: colors.text, fontFamily: FontFamilies.bodySemiBold },
                          ]}
                        >
                          {n.title}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.notifTime,
                          { color: colors.textMuted, fontFamily: FontFamilies.bodyRegular },
                        ]}
                      >
                        {n.timestamp}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.notifMessage,
                        { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular },
                      ]}
                    >
                      {n.message}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </>
          ) : (
            <EmptyState
              kind="notifications"
              title="No notifications"
              description="Reward credits, wallet status updates, and pending confirmations will appear here."
              actionLabel="Restore Demo Alerts"
              onAction={restoreDemoNotifications}
            />
          )}
        </View>
      </ModalShell>

      {/* Profile Action Menu Modal */}
      <ModalShell
        visible={profileMenuOpen}
        onClose={() => setProfileMenuOpen(false)}
        title={user.fullName}
        subtitle={user.email}
        maxWidth={360}
      >
        <View style={styles.menuList}>
          <MenuAction
            icon={User}
            label="My Profile"
            onPress={() => {
              setProfileMenuOpen(false);
              router.push('/app/profile');
            }}
          />
          <MenuAction
            icon={Settings}
            label="Settings & Preferences"
            onPress={() => {
              setProfileMenuOpen(false);
              router.push('/app/settings');
            }}
          />
          <MenuAction
            icon={HelpCircle}
            label="Help & Support"
            onPress={() => {
              setProfileMenuOpen(false);
              setHelpOpen(true);
            }}
          />
          <MenuAction
            icon={ArrowLeft}
            label="Return to Landing Page"
            onPress={() => {
              setProfileMenuOpen(false);
              router.push('/');
            }}
          />
          <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
          <MenuAction
            icon={LogOut}
            label="Sign Out"
            danger
            onPress={() => {
              setProfileMenuOpen(false);
              setSignOutOpen(true);
            }}
          />
        </View>
      </ModalShell>

      <WalletConnectModal />
      <DisconnectConfirmModal />
      <DemoControlsModal />
      <HelpSupportModal visible={helpOpen} onClose={() => setHelpOpen(false)} />
      <SignOutModal
        visible={signOutOpen}
        onClose={() => setSignOutOpen(false)}
        onConfirm={handleSignOutConfirm}
      />
    </View>
  );
}

function MenuAction({
  icon: Icon,
  label,
  onPress,
  danger = false,
}: {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  const { colors } = useAppTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.menuRow,
        {
          backgroundColor: pressed ? colors.surfaceElevated : 'transparent',
        },
        Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined,
      ]}
    >
      <Icon size={17} color={danger ? colors.error : colors.textSecondary} />
      <Text
        style={[
          styles.menuText,
          {
            color: danger ? colors.error : colors.text,
            fontFamily: FontFamilies.bodyMedium,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    borderRightWidth: 1,
    paddingHorizontal: 14,
    justifyContent: 'space-between',
  },
  sidebarTop: {
    gap: 14,
    paddingHorizontal: 6,
  },
  centered: {
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  backToSite: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  backToSiteText: {
    fontSize: 12.5,
  },
  navList: {
    flex: 1,
    marginTop: 28,
    gap: 6,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: Radii.md,
    minHeight: 44,
  },
  navItemRail: {
    flexDirection: 'column',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 14,
  },
  railLabel: {
    fontSize: 10.5,
  },
  sidebarFooter: {
    paddingTop: 12,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    padding: 10,
    borderRadius: Radii.md,
    borderWidth: 1,
  },
  userCardRail: {
    justifyContent: 'center',
    padding: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#F8F7F2',
    fontSize: 13,
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  userName: {
    fontSize: 13.5,
  },
  userStatus: {
    fontSize: 11.5,
  },
  mainColumn: {
    flex: 1,
    minWidth: 0,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  mobileLogoBtn: {
    paddingRight: 2,
  },
  headingGroup: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  pageTitle: {
    letterSpacing: -0.4,
  },
  pageSubtitle: {
    fontSize: 13.5,
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconActionBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  unreadCount: {
    color: '#F8F7F2',
    fontSize: 10.5,
    fontWeight: '700',
  },
  profilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 6,
    paddingRight: 11,
    paddingVertical: 5,
    borderRadius: Radii.pill,
    borderWidth: 1,
    minHeight: 42,
  },
  smallAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallAvatarText: {
    color: '#F8F7F2',
    fontSize: 11,
  },
  profileName: {
    fontSize: 13.5,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  innerMax: {
    width: '100%',
    gap: 20,
  },
  mobileDemoStrip: {
    alignItems: 'flex-start',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 6,
  },
  bottomTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    minHeight: 48,
  },
  bottomIconPill: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: Radii.pill,
  },
  bottomLabel: {
    fontSize: 11,
  },
  notifBody: {
    gap: 12,
  },
  notifActionsTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inlineLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
  },
  inlineLinkText: {
    fontSize: 12.5,
  },
  notifList: {
    gap: 10,
  },
  notifCard: {
    borderRadius: Radii.md,
    borderWidth: 1,
    padding: 14,
    gap: 5,
  },
  notifTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  notifTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  notifDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  notifTitle: {
    fontSize: 13.5,
  },
  notifTime: {
    fontSize: 11.5,
  },
  notifMessage: {
    fontSize: 13,
    lineHeight: 19,
  },
  menuList: {
    gap: 4,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: Radii.md,
    minHeight: 44,
  },
  menuText: {
    fontSize: 14.5,
  },
  menuDivider: {
    height: 1,
    marginVertical: 6,
  },
});
