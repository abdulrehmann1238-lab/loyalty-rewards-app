import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Menu, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandLogo } from '@/components/common/BrandLogo';
import { Button } from '@/components/common/Button';
import { LayoutMetrics } from '@/constants/layout';
import { useResponsive } from '@/hooks/useResponsive';
import { FontFamilies, Radii, Shadows } from '@/theme/tokens';

export type LandingSectionId = 'how-it-works' | 'rewards' | 'wallet' | 'security';

interface LandingNavbarProps {
  scrolled: boolean;
  onNavigateSection: (id: LandingSectionId) => void;
  onSignIn: () => void;
  onGetStarted: () => void;
}

const NAV_LINKS: { id: LandingSectionId; label: string }[] = [
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'rewards', label: 'Rewards' },
  { id: 'wallet', label: 'Wallet' },
  { id: 'security', label: 'Security' },
];

export function LandingNavbar({
  scrolled,
  onNavigateSection,
  onSignIn,
  onGetStarted,
}: LandingNavbarProps) {
  const insets = useSafeAreaInsets();
  const { isMobile, isTablet } = useResponsive();
  const [menuOpen, setMenuOpen] = useState(false);

  const compactNav = isMobile || isTablet;
  const textColor = scrolled ? '#252A27' : '#F8F7F2';
  const mutedColor = scrolled ? '#5E645C' : 'rgba(248, 247, 242, 0.84)';

  const handleMobileNav = (id: LandingSectionId) => {
    setMenuOpen(false);
    onNavigateSection(id);
  };

  return (
    <View
      style={[
        styles.outer,
        {
          paddingTop: Math.max(insets.top, 0),
          backgroundColor: scrolled ? 'rgba(248, 247, 242, 0.92)' : 'transparent',
          borderBottomColor: scrolled ? '#E7E0D3' : 'transparent',
          borderBottomWidth: scrolled ? 1 : 0,
        },
        Platform.OS === 'web' && scrolled
          ? ({
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
            } as any)
          : undefined,
      ]}
    >
      <View
        style={[
          styles.inner,
          {
            maxWidth: LayoutMetrics.maxLandingWidth,
            paddingHorizontal: isMobile ? 18 : 32,
          },
        ]}
      >
        <BrandLogo variant={scrolled ? 'dark' : 'light'} size="md" />

        {!compactNav ? (
          <View style={styles.centerLinks}>
            {NAV_LINKS.map((link) => (
              <Pressable
                key={link.id}
                onPress={() => onNavigateSection(link.id)}
                accessibilityRole="link"
                style={({ pressed }) => [
                  styles.navLinkBtn,
                  { opacity: pressed ? 0.7 : 1 },
                  Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined,
                ]}
              >
                <Text
                  style={[
                    styles.navLinkText,
                    { color: mutedColor, fontFamily: FontFamilies.bodyMedium },
                  ]}
                >
                  {link.label}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        {!compactNav ? (
          <View style={styles.rightActions}>
            <Pressable
              onPress={onSignIn}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.signInLink,
                { opacity: pressed ? 0.7 : 1 },
                Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined,
              ]}
            >
              <Text
                style={[
                  styles.signInText,
                  { color: textColor, fontFamily: FontFamilies.bodySemiBold },
                ]}
              >
                Sign In
              </Text>
            </Pressable>
            <Button
              label="Get Started"
              variant={scrolled ? 'primary' : 'ivory'}
              size="sm"
              onPress={onGetStarted}
            />
          </View>
        ) : (
          <Pressable
            onPress={() => setMenuOpen((prev) => !prev)}
            accessibilityRole="button"
            accessibilityLabel={menuOpen ? 'Close menu' : 'Open menu'}
            style={[
              styles.hamburger,
              {
                backgroundColor: scrolled
                  ? '#F2F0E8'
                  : 'rgba(248, 247, 242, 0.14)',
                borderColor: scrolled ? '#E7E0D3' : 'rgba(248, 247, 242, 0.24)',
              },
            ]}
          >
            {menuOpen ? (
              <X size={20} color={textColor} />
            ) : (
              <Menu size={20} color={textColor} />
            )}
          </Pressable>
        )}
      </View>

      {compactNav && menuOpen ? (
        <View style={[styles.mobileDrawer, Shadows.card]}>
          {NAV_LINKS.map((link) => (
            <Pressable
              key={link.id}
              onPress={() => handleMobileNav(link.id)}
              accessibilityRole="button"
              style={styles.drawerLink}
            >
              <Text style={[styles.drawerLinkText, { fontFamily: FontFamilies.bodyMedium }]}>
                {link.label}
              </Text>
            </Pressable>
          ))}
          <View style={styles.drawerDivider} />
          <View style={styles.drawerButtons}>
            <Button
              label="Sign In"
              variant="outline"
              fullWidth
              onPress={() => {
                setMenuOpen(false);
                onSignIn();
              }}
            />
            <Button
              label="Get Started"
              variant="primary"
              fullWidth
              onPress={() => {
                setMenuOpen(false);
                onGetStarted();
              }}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 200,
    alignItems: 'center',
    ...(Platform.OS === 'web'
      ? ({
          transitionProperty: 'background-color, border-color',
          transitionDuration: '220ms',
        } as any)
      : {}),
  },
  inner: {
    width: '100%',
    height: 74,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  centerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 28,
  },
  navLinkBtn: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  navLinkText: {
    fontSize: 14,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  signInLink: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  signInText: {
    fontSize: 14,
  },
  hamburger: {
    width: 44,
    height: 44,
    borderRadius: Radii.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileDrawer: {
    width: '100%',
    backgroundColor: '#F8F7F2',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E7E0D3',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 4,
  },
  drawerLink: {
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
  drawerLinkText: {
    fontSize: 15.5,
    color: '#252A27',
  },
  drawerDivider: {
    height: 1,
    backgroundColor: '#E7E0D3',
    marginVertical: 10,
  },
  drawerButtons: {
    gap: 10,
  },
});

