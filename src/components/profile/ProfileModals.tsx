import React, { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { LogOut, ShieldCheck } from 'lucide-react-native';
import { Button } from '@/components/common/Button';
import { ModalShell } from '@/components/common/ModalShell';
import { useToastStore } from '@/store/toastStore';
import { useUserStore } from '@/store/userStore';
import { useAppTheme } from '@/theme/ThemeContext';
import { FontFamilies, Radii } from '@/theme/tokens';

export function EditProfileModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { colors } = useAppTheme();
  const user = useUserStore((s) => s.user);
  const updateProfile = useUserStore((s) => s.updateProfile);
  const showToast = useToastStore((s) => s.showToast);

  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible) {
      setFullName(user.fullName);
      setEmail(user.email);
      setPhone(user.phone);
      setError('');
    }
  }, [visible, user]);

  const handleSave = () => {
    if (!fullName.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    updateProfile({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim() || user.phone,
    });
    showToast('Profile updated.', 'Your demo profile changes were saved locally.', 'success');
    onClose();
  };

  return (
    <ModalShell
      visible={visible}
      onClose={onClose}
      title="Edit Profile"
      subtitle="Update your member details stored locally for this session."
      maxWidth={460}
    >
      <View style={styles.stack}>
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text, fontFamily: FontFamilies.bodyMedium }]}>
            Full Name
          </Text>
          <TextInput
            value={fullName}
            onChangeText={(t) => {
              setFullName(t);
              setError('');
            }}
            placeholder="Alex Morgan"
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
            Email Address
          </Text>
          <TextInput
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              setError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="alex.morgan@example.com"
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
            Phone Number
          </Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="+1 (415) 890-4312"
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

        {error ? (
          <Text style={[styles.errText, { color: colors.error, fontFamily: FontFamilies.bodyMedium }]}>
            {error}
          </Text>
        ) : null}

        <View style={styles.btnRow}>
          <Button label="Cancel" variant="outline" onPress={onClose} style={styles.flexBtn} />
          <Button label="Save Changes" onPress={handleSave} style={styles.flexBtn} />
        </View>
      </View>
    </ModalShell>
  );
}

export function ChangePasswordModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { colors } = useAppTheme();
  const showToast = useToastStore((s) => s.showToast);

  const [currentPwd, setCurrentPwd] = useState('');
  const [nextPwd, setNextPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible) {
      setCurrentPwd('');
      setNextPwd('');
      setConfirmPwd('');
      setError('');
    }
  }, [visible]);

  const handleUpdate = () => {
    if (!currentPwd || !nextPwd || !confirmPwd) {
      setError('Please fill in all password fields.');
      return;
    }
    if (nextPwd.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (nextPwd !== confirmPwd) {
      setError('New passwords do not match.');
      return;
    }
    showToast('Password updated (Demo)', 'Simulated credential check succeeded.', 'success');
    onClose();
  };

  return (
    <ModalShell
      visible={visible}
      onClose={onClose}
      title="Change Password"
      subtitle="Demonstration password update dialog."
      maxWidth={440}
    >
      <View style={styles.stack}>
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text, fontFamily: FontFamilies.bodyMedium }]}>
            Current Password
          </Text>
          <TextInput
            value={currentPwd}
            onChangeText={(t) => {
              setCurrentPwd(t);
              setError('');
            }}
            secureTextEntry
            placeholder="••••••••"
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
            New Password
          </Text>
          <TextInput
            value={nextPwd}
            onChangeText={(t) => {
              setNextPwd(t);
              setError('');
            }}
            secureTextEntry
            placeholder="Minimum 6 characters"
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
            Confirm New Password
          </Text>
          <TextInput
            value={confirmPwd}
            onChangeText={(t) => {
              setConfirmPwd(t);
              setError('');
            }}
            secureTextEntry
            placeholder="Re-enter new password"
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

        {error ? (
          <Text style={[styles.errText, { color: colors.error, fontFamily: FontFamilies.bodyMedium }]}>
            {error}
          </Text>
        ) : null}

        <View style={styles.btnRow}>
          <Button label="Cancel" variant="outline" onPress={onClose} style={styles.flexBtn} />
          <Button label="Update Password" onPress={handleUpdate} style={styles.flexBtn} />
        </View>
      </View>
    </ModalShell>
  );
}

export function PrivacyPreferencesModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { colors } = useAppTheme();
  const showToast = useToastStore((s) => s.showToast);

  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [walletVisibility, setWalletVisibility] = useState(true);

  return (
    <ModalShell
      visible={visible}
      onClose={onClose}
      title="Privacy Preferences"
      subtitle="Control local demonstration privacy settings."
      maxWidth={460}
    >
      <View style={styles.stack}>
        <View
          style={[
            styles.toggleBox,
            { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
          ]}
        >
          <View style={styles.toggleRow}>
            <View style={styles.toggleText}>
              <Text style={[styles.toggleTitle, { color: colors.text, fontFamily: FontFamilies.bodySemiBold }]}>
                Display Truncated Wallet Address
              </Text>
              <Text style={[styles.toggleSub, { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular }]}>
                Mask full wallet string on dashboard cards
              </Text>
            </View>
            <Switch
              value={walletVisibility}
              onValueChange={setWalletVisibility}
              trackColor={{ false: colors.sand, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.toggleRow}>
            <View style={styles.toggleText}>
              <Text style={[styles.toggleTitle, { color: colors.text, fontFamily: FontFamilies.bodySemiBold }]}>
                Product Diagnostics (Demo)
              </Text>
              <Text style={[styles.toggleSub, { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular }]}>
                Local session preference only, no telemetry sent
              </Text>
            </View>
            <Switch
              value={analyticsEnabled}
              onValueChange={setAnalyticsEnabled}
              trackColor={{ false: colors.sand, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.infoNote}>
          <ShieldCheck size={15} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular }]}>
            No personal or blockchain data leaves your browser or device in Phase One.
          </Text>
        </View>

        <Button
          label="Save Privacy Settings"
          onPress={() => {
            showToast('Preferences saved.', 'Privacy settings updated locally.', 'success');
            onClose();
          }}
        />
      </View>
    </ModalShell>
  );
}

export function SignOutModal({
  visible,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const { colors } = useAppTheme();

  return (
    <ModalShell
      visible={visible}
      onClose={onClose}
      title="Sign out"
      subtitle="Return to the Verdant login screen."
      maxWidth={410}
    >
      <View style={styles.stack}>
        <View
          style={[
            styles.signOutCard,
            { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
          ]}
        >
          <View style={[styles.signOutIcon, { backgroundColor: colors.errorSoft }]}>
            <LogOut size={18} color={colors.error} />
          </View>
          <Text style={[styles.signOutCopy, { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular }]}>
            You can immediately jump back in anytime using Continue as Demo User.
          </Text>
        </View>

        <View style={styles.btnRow}>
          <Button label="Stay Signed In" variant="outline" onPress={onClose} style={styles.flexBtn} />
          <Button label="Sign Out" variant="danger" onPress={onConfirm} style={styles.flexBtn} />
        </View>
      </View>
    </ModalShell>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 16,
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
    fontSize: 14.5,
  },
  errText: {
    fontSize: 13,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  flexBtn: {
    flex: 1,
  },
  toggleBox: {
    borderRadius: Radii.lg,
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    gap: 12,
  },
  toggleText: {
    flex: 1,
    gap: 2,
  },
  toggleTitle: {
    fontSize: 14,
  },
  toggleSub: {
    fontSize: 12.5,
    lineHeight: 17,
  },
  divider: {
    height: 1,
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
  },
  signOutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: Radii.md,
    borderWidth: 1,
  },
  signOutIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutCopy: {
    flex: 1,
    fontSize: 13.5,
    lineHeight: 19,
  },
});

