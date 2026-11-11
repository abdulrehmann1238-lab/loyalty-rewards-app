import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { CheckCircle2, Mail } from 'lucide-react-native';
import { BrandLogo } from '@/components/common/BrandLogo';
import { Button } from '@/components/common/Button';
import { ModalShell } from '@/components/common/ModalShell';
import { LayoutMetrics } from '@/constants/layout';
import { useResponsive } from '@/hooks/useResponsive';
import { useToastStore } from '@/store/toastStore';
import { useAppTheme } from '@/theme/ThemeContext';
import { FontFamilies, Radii } from '@/theme/tokens';
import { LandingSectionId } from './LandingNavbar';

interface LandingFooterProps {
  onNavigateSection: (id: LandingSectionId) => void;
  onGetStarted: () => void;
  onSignIn: () => void;
}

export function LandingFooter({
  onNavigateSection,
  onGetStarted,
  onSignIn,
}: LandingFooterProps) {
  const { colors } = useAppTheme();
  const { isMobile } = useResponsive();
  const showToast = useToastStore((s) => s.showToast);

  const [contactOpen, setContactOpen] = useState(false);
  const [policyType, setPolicyType] = useState<'privacy' | 'terms' | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSendContact = () => {
    if (!name.trim()) {
      setFormError('Please enter your name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (message.trim().length < 6) {
      setFormError('Please enter a brief message (at least 6 characters).');
      return;
    }
    setFormError('');
    setSubmitted(true);
    showToast('Demo submission previewed', 'No message was transmitted to a server.', 'info');
  };

  const resetContact = () => {
    setContactOpen(false);
    setSubmitted(false);
    setName('');
    setEmail('');
    setMessage('');
    setFormError('');
  };

  return (
    <View style={styles.outer}>
      <View
        style={[
          styles.inner,
          {
            maxWidth: LayoutMetrics.maxLandingWidth,
            paddingHorizontal: isMobile ? 20 : 32,
          },
        ]}
      >
        <View style={[styles.topGrid, isMobile ? styles.topGridMobile : undefined]}>
          <View style={styles.brandCol}>
            <BrandLogo variant="dark" size="md" />
            <Text style={[styles.brandDesc, { fontFamily: FontFamilies.bodyRegular }]}>
              A calm, thoughtfully structured loyalty rewards prototype showcasing modern mobile UX
              and simulated wallet connectivity.
            </Text>
          </View>

          <View style={styles.linksGroup}>
            <View style={styles.linkCol}>
              <Text style={[styles.colHeading, { fontFamily: FontFamilies.bodySemiBold }]}>
                Product
              </Text>
              <FooterLink label="How It Works" onPress={() => onNavigateSection('how-it-works')} />
              <FooterLink label="Rewards" onPress={() => onNavigateSection('rewards')} />
              <FooterLink label="Wallet" onPress={() => onNavigateSection('wallet')} />
              <FooterLink label="Security" onPress={() => onNavigateSection('security')} />
            </View>

            <View style={styles.linkCol}>
              <Text style={[styles.colHeading, { fontFamily: FontFamilies.bodySemiBold }]}>
                Experience
              </Text>
              <FooterLink label="Get Started" onPress={onGetStarted} />
              <FooterLink label="Sign In" onPress={onSignIn} />
              <FooterLink label="Contact" onPress={() => setContactOpen(true)} />
            </View>
          </View>
        </View>

        <View style={styles.bottomBar}>
          <Text style={[styles.copyright, { fontFamily: FontFamilies.bodyRegular }]}>
            © 2026 Verdant Rewards · Interactive Phase One Prototype
          </Text>
          <View style={styles.legalLinks}>
            <FooterLink label="Privacy Policy" onPress={() => setPolicyType('privacy')} small />
            <FooterLink label="Terms of Service" onPress={() => setPolicyType('terms')} small />
          </View>
        </View>
      </View>

      {/* Contact Modal */}
      <ModalShell
        visible={contactOpen}
        onClose={resetContact}
        title="Contact Verdant"
        subtitle="Preview our contact experience. Submissions are simulated locally."
        maxWidth={460}
      >
        {submitted ? (
          <View style={styles.successState}>
            <View style={[styles.successIcon, { backgroundColor: colors.successSoft }]}>
              <CheckCircle2 size={26} color={colors.success} />
            </View>
            <Text style={[styles.successTitle, { color: colors.text, fontFamily: FontFamilies.headingSemiBold }]}>
              Message preview captured
            </Text>
            <Text
              style={[
                styles.successSub,
                { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular },
              ]}
            >
              Thank you, {name.trim()}. Because this is a standalone frontend prototype, your message
              has been simulated locally rather than sent to a live server.
            </Text>
            <Button label="Done" onPress={resetContact} />
          </View>
        ) : (
          <View style={styles.formStack}>
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.text, fontFamily: FontFamilies.bodyMedium }]}>
                Name
              </Text>
              <TextInput
                value={name}
                onChangeText={(t) => {
                  setName(t);
                  setFormError('');
                }}
                placeholder="Your full name"
                placeholderTextColor={colors.textMuted}
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    backgroundColor: colors.surfaceElevated,
                    borderColor: colors.border,
                    fontFamily: FontFamilies.bodyRegular,
                  },
                ]}
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.text, fontFamily: FontFamilies.bodyMedium }]}>
                Email
              </Text>
              <TextInput
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  setFormError('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="you@company.com"
                placeholderTextColor={colors.textMuted}
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    backgroundColor: colors.surfaceElevated,
                    borderColor: colors.border,
                    fontFamily: FontFamilies.bodyRegular,
                  },
                ]}
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.text, fontFamily: FontFamilies.bodyMedium }]}>
                Message
              </Text>
              <TextInput
                value={message}
                onChangeText={(t) => {
                  setMessage(t);
                  setFormError('');
                }}
                placeholder="Tell us about your loyalty product goals..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={4}
                style={[
                  styles.input,
                  styles.textArea,
                  {
                    color: colors.text,
                    backgroundColor: colors.surfaceElevated,
                    borderColor: colors.border,
                    fontFamily: FontFamilies.bodyRegular,
                  },
                ]}
              />
            </View>

            {formError ? (
              <Text style={[styles.errorText, { color: colors.error, fontFamily: FontFamilies.bodyMedium }]}>
                {formError}
              </Text>
            ) : null}

            <Button
              label="Send Message"
              leftIcon={<Mail size={15} color={colors.textOnPrimary} />}
              onPress={handleSendContact}
            />
          </View>
        )}
      </ModalShell>

      {/* Policy Placeholder Modal */}
      <ModalShell
        visible={!!policyType}
        onClose={() => setPolicyType(null)}
        title={policyType === 'privacy' ? 'Privacy Policy (Demo)' : 'Terms of Service (Demo)'}
        subtitle="Informational demonstration document"
        maxWidth={480}
      >
        <View style={styles.policyBody}>
          <Text style={[styles.policyText, { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular }]}>
            {policyType === 'privacy'
              ? 'Verdant Rewards Phase One is an interactive frontend prototype. No personal data, credentials, or wallet keys are transmitted to external servers. Any demo profile edits or preferences are stored solely in your local browser or device storage.'
              : 'This prototype illustrates a cross-platform loyalty rewards interface with simulated wallet connection and ERC-20 smart contract reads. All token balances, transaction hashes, and network identifiers are fictional demonstration values.'}
          </Text>
          <Button label="Close" variant="secondary" onPress={() => setPolicyType(null)} />
        </View>
      </ModalShell>
    </View>
  );
}

function FooterLink({
  label,
  onPress,
  small = false,
}: {
  label: string;
  onPress: () => void;
  small?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      style={({ pressed }) => [
        styles.footerLink,
        { opacity: pressed ? 0.7 : 1 },
        Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined,
      ]}
    >
      <Text
        style={[
          small ? styles.legalLinkText : styles.linkText,
          { fontFamily: FontFamilies.bodyRegular },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    backgroundColor: '#F2F0E8',
    borderTopWidth: 1,
    borderTopColor: '#E7E0D3',
    paddingTop: 56,
    paddingBottom: 36,
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    gap: 40,
  },
  topGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 48,
  },
  topGridMobile: {
    flexDirection: 'column',
    gap: 32,
  },
  brandCol: {
    maxWidth: 340,
    gap: 14,
  },
  brandDesc: {
    fontSize: 14,
    lineHeight: 22,
    color: '#777C75',
  },
  linksGroup: {
    flexDirection: 'row',
    gap: 56,
    flexWrap: 'wrap',
  },
  linkCol: {
    gap: 10,
    minWidth: 120,
  },
  colHeading: {
    fontSize: 13.5,
    color: '#252A27',
    marginBottom: 4,
  },
  footerLink: {
    paddingVertical: 3,
  },
  linkText: {
    fontSize: 14,
    color: '#5E645C',
  },
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: '#E7E0D3',
    paddingTop: 22,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  copyright: {
    fontSize: 13,
    color: '#777C75',
  },
  legalLinks: {
    flexDirection: 'row',
    gap: 20,
  },
  legalLinkText: {
    fontSize: 13,
    color: '#5E645C',
  },
  formStack: {
    gap: 14,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderRadius: Radii.md,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
  },
  textArea: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 13,
  },
  successState: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  successIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 18,
  },
  successSub: {
    fontSize: 13.5,
    lineHeight: 20,
    textAlign: 'center',
  },
  policyBody: {
    gap: 18,
  },
  policyText: {
    fontSize: 14,
    lineHeight: 22,
  },
});

