import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { CheckCircle2, HelpCircle, Shield, Wallet } from 'lucide-react-native';
import { Button } from '@/components/common/Button';
import { ModalShell } from '@/components/common/ModalShell';
import { useToastStore } from '@/store/toastStore';
import { useAppTheme } from '@/theme/ThemeContext';
import { FontFamilies, Radii } from '@/theme/tokens';

interface HelpSupportModalProps {
  visible: boolean;
  onClose: () => void;
}

const FAQS = [
  {
    q: 'How are RWD tokens earned?',
    a: 'Every eligible merchant purchase records reward points in your account, illustrated here using a simulated ERC-20 ledger.',
    icon: Wallet,
  },
  {
    q: 'Is my wallet connected to mainnet?',
    a: 'No. This Phase One demonstration simulates Ethereum Sepolia (Demo) wallet state and ABI reads locally.',
    icon: Shield,
  },
  {
    q: 'How do redemptions appear in history?',
    a: 'Redeemed vouchers and travel credits appear as negative token entries with verifiable demo block and transaction hashes.',
    icon: HelpCircle,
  },
];

export function HelpSupportModal({ visible, onClose }: HelpSupportModalProps) {
  const { colors } = useAppTheme();
  const showToast = useToastStore((s) => s.showToast);

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) {
      showToast('Please complete both fields', 'Enter a topic and brief question.', 'warning');
      return;
    }
    setSubmitted(true);
    showToast('Support note logged (Demo)', 'Simulated support ticket preview recorded.', 'success');
  };

  const handleClose = () => {
    setSubmitted(false);
    setSubject('');
    setMessage('');
    onClose();
  };

  return (
    <ModalShell
      visible={visible}
      onClose={handleClose}
      title="Help & Support"
      subtitle="Answers to common questions about your Verdant rewards experience."
      maxWidth={500}
    >
      <View style={styles.container}>
        <View style={styles.faqList}>
          {FAQS.map((item) => {
            const Icon = item.icon;
            return (
              <View
                key={item.q}
                style={[
                  styles.faqCard,
                  { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
                ]}
              >
                <View style={styles.faqHead}>
                  <Icon size={16} color={colors.primary} />
                  <Text style={[styles.faqQ, { color: colors.text, fontFamily: FontFamilies.bodySemiBold }]}>
                    {item.q}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.faqA,
                    { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular },
                  ]}
                >
                  {item.a}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {submitted ? (
          <View
            style={[
              styles.successBox,
              { backgroundColor: colors.successSoft, borderColor: colors.border },
            ]}
          >
            <CheckCircle2 size={22} color={colors.success} />
            <Text style={[styles.successTitle, { color: colors.text, fontFamily: FontFamilies.headingSemiBold }]}>
              Demo inquiry captured
            </Text>
            <Text style={[styles.successDesc, { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular }]}>
              This interactive prototype does not transmit messages to an external support server.
            </Text>
            <Button label="Close" size="sm" variant="secondary" onPress={handleClose} />
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={[styles.formHeading, { color: colors.text, fontFamily: FontFamilies.headingSemiBold }]}>
              Send a demo support note
            </Text>
            <TextInput
              value={subject}
              onChangeText={setSubject}
              placeholder="Topic (e.g., Reward balance sync)"
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
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Describe how we can assist..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={3}
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
            <Button label="Preview Support Submission" onPress={handleSubmit} />
          </View>
        )}
      </View>
    </ModalShell>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  faqList: {
    gap: 10,
  },
  faqCard: {
    borderRadius: Radii.md,
    borderWidth: 1,
    padding: 13,
    gap: 6,
  },
  faqHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  faqQ: {
    fontSize: 13.5,
    flex: 1,
  },
  faqA: {
    fontSize: 12.5,
    lineHeight: 18,
  },
  divider: {
    height: 1,
  },
  form: {
    gap: 10,
  },
  formHeading: {
    fontSize: 14.5,
  },
  input: {
    borderWidth: 1,
    borderRadius: Radii.md,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
  },
  textArea: {
    minHeight: 84,
    textAlignVertical: 'top',
  },
  successBox: {
    borderRadius: Radii.md,
    borderWidth: 1,
    padding: 18,
    alignItems: 'center',
    gap: 8,
  },
  successTitle: {
    fontSize: 15.5,
  },
  successDesc: {
    fontSize: 12.5,
    lineHeight: 18,
    textAlign: 'center',
  },
});

