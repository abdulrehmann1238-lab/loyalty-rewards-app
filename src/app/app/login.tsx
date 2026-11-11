import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check, CheckCircle2, Eye, EyeOff, Lock, Mail, Sparkles } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandLogo } from '@/components/common/BrandLogo';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { ModalShell } from '@/components/common/ModalShell';
import { useResponsive } from '@/hooks/useResponsive';
import { useToastStore } from '@/store/toastStore';
import { useUserStore } from '@/store/userStore';
import { useAppTheme } from '@/theme/ThemeContext';
import { FontFamilies, Radii, Shadows } from '@/theme/tokens';

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { isMobile } = useResponsive();
  const loginAsDemo = useUserStore((s) => s.loginAsDemo);
  const loginWithCredentials = useUserStore((s) => s.loginWithCredentials);
  const showToast = useToastStore((s) => s.showToast);

  const [email, setEmail] = useState('alex.morgan@example.com');
  const [password, setPassword] = useState('VerdantDemo2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const [forgotOpen, setForgotOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryError, setRecoveryError] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  const validate = () => {
    const next: { email?: string; password?: string } = {};
    if (!email.trim()) {
      next.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Please enter a valid email address.';
    }
    if (!password.trim()) {
      next.password = 'Password is required.';
    } else if (password.trim().length < 6) {
      next.password = 'Password must be at least 6 characters.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSignIn = async () => {
    if (!validate()) return;
    setLoading(true);
    await loginWithCredentials(email);
    setLoading(false);
    showToast('Welcome back', 'Signed into your Verdant demo account.', 'success');
    router.replace('/app/dashboard');
  };

  const handleDemoUser = () => {
    loginAsDemo();
    showToast('Demo login successful.', 'Viewing Alex Morgan’s preconfigured rewards.', 'success');
    router.replace('/app/dashboard');
  };

  const handleRecoverySubmit = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recoveryEmail.trim())) {
      setRecoveryError('Please enter a valid email address.');
      return;
    }
    setRecoveryError('');
    setRecoverySent(true);
    showToast('Recovery preview', 'Simulated reset instructions prepared.', 'info');
  };

  const closeRecovery = () => {
    setForgotOpen(false);
    setRecoverySent(false);
    setRecoveryEmail('');
    setRecoveryError('');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: isMobile ? 18 : 32 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topRow}>
            <Pressable
              onPress={() => router.push('/')}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.backLink,
                { opacity: pressed ? 0.7 : 1 },
                Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined,
              ]}
            >
              <ArrowLeft size={15} color={colors.textSecondary} />
              <Text
                style={[
                  styles.backText,
                  { color: colors.textSecondary, fontFamily: FontFamilies.bodyMedium },
                ]}
              >
                Back to Overview
              </Text>
            </Pressable>

            <View
              style={[
                styles.demoTag,
                { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.demoTagText, { color: colors.textSecondary, fontFamily: FontFamilies.bodyMedium }]}>
                Demo Mode
              </Text>
            </View>
          </View>

          <View style={styles.centerWrap}>
            <Card padding={isMobile ? 22 : 30} style={[styles.loginCard, Shadows.card]}>
              <View style={styles.brandBlock}>
                <BrandLogo size="md" />
                <View style={styles.headings}>
                  <Text
                    style={[
                      styles.title,
                      { color: colors.text, fontFamily: FontFamilies.headingBold },
                    ]}
                  >
                    Welcome back
                  </Text>
                  <Text
                    style={[
                      styles.subtitle,
                      { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular },
                    ]}
                  >
                    Your rewards are waiting.
                  </Text>
                </View>
              </View>

              <View style={styles.form}>
                {/* Email */}
                <View style={styles.field}>
                  <Text style={[styles.label, { color: colors.text, fontFamily: FontFamilies.bodyMedium }]}>
                    Email address
                  </Text>
                  <View
                    style={[
                      styles.inputBox,
                      {
                        backgroundColor: colors.surfaceElevated,
                        borderColor: errors.email ? colors.error : colors.border,
                      },
                    ]}
                  >
                    <Mail size={16} color={colors.textSecondary} />
                    <TextInput
                      value={email}
                      onChangeText={(t) => {
                        setEmail(t);
                        if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      placeholder="alex.morgan@example.com"
                      placeholderTextColor={colors.textMuted}
                      accessibilityLabel="Email address"
                      style={[
                        styles.input,
                        { color: colors.text, fontFamily: FontFamilies.bodyRegular },
                      ]}
                    />
                  </View>
                  {errors.email ? (
                    <Text style={[styles.errorText, { color: colors.error, fontFamily: FontFamilies.bodyMedium }]}>
                      {errors.email}
                    </Text>
                  ) : null}
                </View>

                {/* Password */}
                <View style={styles.field}>
                  <Text style={[styles.label, { color: colors.text, fontFamily: FontFamilies.bodyMedium }]}>
                    Password
                  </Text>
                  <View
                    style={[
                      styles.inputBox,
                      {
                        backgroundColor: colors.surfaceElevated,
                        borderColor: errors.password ? colors.error : colors.border,
                      },
                    ]}
                  >
                    <Lock size={16} color={colors.textSecondary} />
                    <TextInput
                      value={password}
                      onChangeText={(t) => {
                        setPassword(t);
                        if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
                      }}
                      secureTextEntry={!showPassword}
                      placeholder="Enter your password"
                      placeholderTextColor={colors.textMuted}
                      accessibilityLabel="Password"
                      style={[
                        styles.input,
                        { color: colors.text, fontFamily: FontFamilies.bodyRegular },
                      ]}
                    />
                    <Pressable
                      onPress={() => setShowPassword((prev) => !prev)}
                      accessibilityRole="button"
                      accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                      hitSlop={10}
                    >
                      {showPassword ? (
                        <EyeOff size={17} color={colors.textSecondary} />
                      ) : (
                        <Eye size={17} color={colors.textSecondary} />
                      )}
                    </Pressable>
                  </View>
                  {errors.password ? (
                    <Text style={[styles.errorText, { color: colors.error, fontFamily: FontFamilies.bodyMedium }]}>
                      {errors.password}
                    </Text>
                  ) : null}
                </View>

                {/* Remember me + Forgot password */}
                <View style={styles.optionsRow}>
                  <Pressable
                    onPress={() => setRememberMe((prev) => !prev)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: rememberMe }}
                    style={styles.rememberWrap}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        {
                          backgroundColor: rememberMe ? colors.primary : 'transparent',
                          borderColor: rememberMe ? colors.primary : colors.borderStrong,
                        },
                      ]}
                    >
                      {rememberMe ? <Check size={12} color="#F8F7F2" strokeWidth={2.6} /> : null}
                    </View>
                    <Text
                      style={[
                        styles.rememberText,
                        { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular },
                      ]}
                    >
                      Remember me
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      setRecoveryEmail(email);
                      setForgotOpen(true);
                    }}
                    accessibilityRole="button"
                  >
                    <Text
                      style={[
                        styles.forgotLink,
                        { color: colors.primary, fontFamily: FontFamilies.bodySemiBold },
                      ]}
                    >
                      Forgot password?
                    </Text>
                  </Pressable>
                </View>

                <Button label="Sign In" loading={loading} fullWidth size="lg" onPress={handleSignIn} />

                <View style={styles.orRow}>
                  <View style={[styles.orLine, { backgroundColor: colors.border }]} />
                  <Text style={[styles.orText, { color: colors.textMuted, fontFamily: FontFamilies.bodyRegular }]}>
                    or
                  </Text>
                  <View style={[styles.orLine, { backgroundColor: colors.border }]} />
                </View>

                <Button
                  label="Continue as Demo User"
                  variant="secondary"
                  size="lg"
                  fullWidth
                  leftIcon={<Sparkles size={16} color={colors.primary} />}
                  onPress={handleDemoUser}
                />
              </View>
            </Card>

            <Text
              style={[
                styles.footnote,
                { color: colors.textMuted, fontFamily: FontFamilies.bodyRegular },
              ]}
            >
              Interactive frontend prototype — no real authentication or live account required.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Forgot Password Recovery Modal */}
      <ModalShell
        visible={forgotOpen}
        onClose={closeRecovery}
        title="Reset your password"
        subtitle="Enter your email to preview the simulated account recovery flow."
        maxWidth={430}
      >
        {recoverySent ? (
          <View style={styles.recoverySuccess}>
            <View style={[styles.recoveryIcon, { backgroundColor: colors.successSoft }]}>
              <CheckCircle2 size={24} color={colors.success} />
            </View>
            <Text style={[styles.recoveryTitle, { color: colors.text, fontFamily: FontFamilies.headingSemiBold }]}>
              Recovery preview sent
            </Text>
            <Text
              style={[
                styles.recoveryCopy,
                { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular },
              ]}
            >
              In production, a reset link would be dispatched to {recoveryEmail.trim()}. For this
              demo, you can sign in directly or use Continue as Demo User.
            </Text>
            <Button label="Back to Sign In" fullWidth onPress={closeRecovery} />
          </View>
        ) : (
          <View style={styles.recoveryForm}>
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.text, fontFamily: FontFamilies.bodyMedium }]}>
                Account Email
              </Text>
              <View
                style={[
                  styles.inputBox,
                  { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
                ]}
              >
                <Mail size={16} color={colors.textSecondary} />
                <TextInput
                  value={recoveryEmail}
                  onChangeText={(t) => {
                    setRecoveryEmail(t);
                    setRecoveryError('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="alex.morgan@example.com"
                  placeholderTextColor={colors.textMuted}
                  style={[styles.input, { color: colors.text, fontFamily: FontFamilies.bodyRegular }]}
                />
              </View>
              {recoveryError ? (
                <Text style={[styles.errorText, { color: colors.error, fontFamily: FontFamilies.bodyMedium }]}>
                  {recoveryError}
                </Text>
              ) : null}
            </View>

            <View style={styles.recoveryBtns}>
              <Button label="Cancel" variant="outline" onPress={closeRecovery} style={styles.flex} />
              <Button label="Send Reset Link" onPress={handleRecoverySubmit} style={styles.flex} />
            </View>
          </View>
        )}
      </ModalShell>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  topRow: {
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 8,
    minHeight: 44,
  },
  backText: {
    fontSize: 13.5,
  },
  demoTag: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: Radii.pill,
    borderWidth: 1,
  },
  demoTagText: {
    fontSize: 12,
  },
  centerWrap: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    marginVertical: 28,
    gap: 16,
  },
  loginCard: {
    gap: 24,
  },
  brandBlock: {
    gap: 18,
  },
  headings: {
    gap: 4,
  },
  title: {
    fontSize: 28,
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 15,
  },
  form: {
    gap: 16,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 13,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: Radii.md,
    paddingHorizontal: 14,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 14.5,
    paddingVertical: 10,
  },
  errorText: {
    fontSize: 12.5,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  rememberWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 36,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rememberText: {
    fontSize: 13,
  },
  forgotLink: {
    fontSize: 13,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  orLine: {
    flex: 1,
    height: 1,
  },
  orText: {
    fontSize: 12.5,
  },
  footnote: {
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 18,
  },
  recoveryForm: {
    gap: 16,
  },
  recoveryBtns: {
    flexDirection: 'row',
    gap: 10,
  },
  recoverySuccess: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  recoveryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recoveryTitle: {
    fontSize: 17,
  },
  recoveryCopy: {
    fontSize: 13.5,
    lineHeight: 20,
    textAlign: 'center',
  },
});

