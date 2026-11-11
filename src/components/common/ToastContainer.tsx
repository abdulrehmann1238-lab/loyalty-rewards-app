import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResponsive } from '@/hooks/useResponsive';
import { useToastStore } from '@/store/toastStore';
import { useAppTheme } from '@/theme/ThemeContext';
import { FontFamilies, Radii, Shadows } from '@/theme/tokens';

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismissToast = useToastStore((s) => s.dismissToast);
  const { colors } = useAppTheme();
  const { isMobile } = useResponsive();
  const insets = useSafeAreaInsets();

  if (toasts.length === 0) return null;

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        isMobile
          ? {
              top: insets.top + 12,
              left: 16,
              right: 16,
              alignItems: 'center',
            }
          : {
              bottom: 24,
              right: 24,
              alignItems: 'flex-end',
            },
      ]}
    >
      {toasts.map((toast) => {
        const iconColor =
          toast.variant === 'error'
            ? colors.error
            : toast.variant === 'warning'
            ? colors.warning
            : toast.variant === 'info'
            ? colors.primary
            : colors.success;

        const Icon =
          toast.variant === 'error'
            ? XCircleIconFallback(AlertCircle)
            : toast.variant === 'warning'
            ? AlertTriangle
            : toast.variant === 'info'
            ? Info
            : CheckCircle2;

        return (
          <View
            key={toast.id}
            accessibilityLiveRegion="polite"
            style={[
              styles.toast,
              Shadows.card,
              {
                backgroundColor: colors.surface,
                borderColor: colors.borderStrong,
                maxWidth: isMobile ? 420 : 360,
                width: isMobile ? '100%' : undefined,
                minWidth: isMobile ? undefined : 290,
              },
            ]}
          >
            <View style={styles.iconWrap}>
              <Icon size={18} color={iconColor} strokeWidth={2} />
            </View>
            <View style={styles.textWrap}>
              <Text
                style={[
                  styles.title,
                  { color: colors.text, fontFamily: FontFamilies.bodySemiBold },
                ]}
              >
                {toast.title}
              </Text>
              {toast.subtitle ? (
                <Text
                  style={[
                    styles.subtitle,
                    { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular },
                  ]}
                >
                  {toast.subtitle}
                </Text>
              ) : null}
            </View>
            <Pressable
              onPress={() => dismissToast(toast.id)}
              accessibilityRole="button"
              accessibilityLabel="Dismiss notification"
              hitSlop={10}
              style={styles.closeBtn}
            >
              <X size={15} color={colors.textSecondary} />
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

function XCircleIconFallback<T>(Comp: T): T {
  return Comp;
}

const styles = StyleSheet.create({
  wrapper: {
    position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
    zIndex: 9999,
    gap: 10,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: Radii.md,
    borderWidth: 1,
    gap: 10,
  },
  iconWrap: {
    paddingTop: 1,
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 13.5,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 17,
  },
  closeBtn: {
    padding: 4,
  },
});

