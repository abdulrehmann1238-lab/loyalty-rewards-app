import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { X } from 'lucide-react-native';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useResponsive } from '@/hooks/useResponsive';
import { useAppTheme } from '@/theme/ThemeContext';
import { FontFamilies, Radii, Shadows } from '@/theme/tokens';

interface ModalShellProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  maxWidth?: number;
  children: React.ReactNode;
}

export function ModalShell({
  visible,
  onClose,
  title,
  subtitle,
  maxWidth = 480,
  children,
}: ModalShellProps) {
  const { colors } = useAppTheme();
  const { isMobile } = useResponsive();
  const reducedMotion = useReducedMotion();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.97)).current;

  useEffect(() => {
    if (visible) {
      if (reducedMotion) {
        opacity.setValue(1);
        scale.setValue(1);
      } else {
        opacity.setValue(0);
        scale.setValue(0.97);
        Animated.parallel([
          Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]).start();
      }
    }
  }, [visible, reducedMotion, opacity, scale]);

  useEffect(() => {
    if (!visible || Platform.OS !== 'web' || typeof window === 'undefined') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [visible, onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View
        style={[
          styles.backdrop,
          {
            backgroundColor: colors.overlay,
            opacity,
            padding: isMobile ? 16 : 24,
          },
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close dialog" />
        <Animated.View
          style={[
            styles.dialog,
            Shadows.floating,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              maxWidth,
              width: '100%',
              maxHeight: '90%',
              transform: [{ scale }],
            },
          ]}
        >
          {(title || subtitle) && (
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
              <View style={styles.headerText}>
                {title ? (
                  <Text
                    style={[
                      styles.title,
                      { color: colors.text, fontFamily: FontFamilies.headingSemiBold },
                    ]}
                  >
                    {title}
                  </Text>
                ) : null}
                {subtitle ? (
                  <Text
                    style={[
                      styles.subtitle,
                      { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular },
                    ]}
                  >
                    {subtitle}
                  </Text>
                ) : null}
              </View>
              <Pressable
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Close modal"
                style={[styles.closeButton, { backgroundColor: colors.surfaceElevated }]}
              >
                <X size={18} color={colors.text} />
              </Pressable>
            </View>
          )}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.bodyContent}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    borderRadius: Radii.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 19,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13.5,
    lineHeight: 19,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyContent: {
    padding: 22,
  },
});

