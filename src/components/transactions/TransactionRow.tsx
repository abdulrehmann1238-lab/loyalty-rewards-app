import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useResponsive } from '@/hooks/useResponsive';
import { useAppTheme } from '@/theme/ThemeContext';
import { FontFamilies, Radii, TabularNumStyle } from '@/theme/tokens';
import { TransactionItem } from '@/types/transaction';
import { formatSignedRwd } from '@/utils/format';
import { TransactionIcon } from './TransactionIcon';

interface TransactionRowProps {
  item: TransactionItem;
  onPress: (item: TransactionItem) => void;
  compact?: boolean;
  showDivider?: boolean;
}

export function TransactionRow({
  item,
  onPress,
  compact = false,
  showDivider = true,
}: TransactionRowProps) {
  const { colors } = useAppTheme();
  const { isMobile } = useResponsive();
  const [hovered, setHovered] = useState(false);

  const isPositive = item.type === 'received';
  const isPending = item.status === 'Pending';

  return (
    <Pressable
      onPress={() => onPress(item)}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      accessibilityRole="button"
      accessibilityLabel={`View transaction details for ${item.merchant}`}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: hovered ? colors.surfaceElevated : 'transparent',
          borderBottomColor: colors.border,
          borderBottomWidth: showDivider ? 1 : 0,
          paddingVertical: compact ? 12 : 14,
          paddingHorizontal: compact ? 12 : 16,
          opacity: pressed ? 0.85 : 1,
        },
        Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined,
      ]}
    >
      <TransactionIcon category={item.category} type={item.type} size={compact ? 38 : 42} />

      <View style={styles.mainInfo}>
        <View style={styles.topLine}>
          <Text
            style={[
              styles.merchant,
              { color: colors.text, fontFamily: FontFamilies.bodySemiBold },
            ]}
            numberOfLines={1}
          >
            {item.merchant}
          </Text>
          {!compact && !isMobile ? (
            <Text style={[styles.txId, { color: colors.textMuted, fontFamily: FontFamilies.mono }]}>
              {item.id.toUpperCase()}
            </Text>
          ) : null}
        </View>
        <Text
          style={[
            styles.meta,
            { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular },
          ]}
          numberOfLines={1}
        >
          {item.typeLabel} · {item.displayDate}
          {!compact ? ` · ${item.time}` : ''}
        </Text>
      </View>

      <View style={styles.rightCol}>
        <Text
          style={[
            styles.amount,
            TabularNumStyle,
            {
              color: isPositive ? colors.success : colors.text,
              fontFamily: FontFamilies.headingSemiBold,
            },
          ]}
        >
          {formatSignedRwd(item.amount, item.type)}
        </Text>
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusPill,
              {
                backgroundColor: isPending ? colors.warningSoft : colors.successSoft,
              },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isPending ? colors.warning : colors.success },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                {
                  color: isPending ? colors.warning : colors.success,
                  fontFamily: FontFamilies.bodyMedium,
                },
              ]}
            >
              {item.status}
            </Text>
          </View>
          {!compact ? <ChevronRight size={15} color={colors.textMuted} /> : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    borderRadius: Radii.sm,
    ...(Platform.OS === 'web'
      ? ({
          transitionProperty: 'background-color',
          transitionDuration: '140ms',
        } as any)
      : {}),
  },
  mainInfo: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  topLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  merchant: {
    fontSize: 14.5,
  },
  txId: {
    fontSize: 11,
  },
  meta: {
    fontSize: 12.5,
  },
  rightCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  amount: {
    fontSize: 14.5,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: Radii.pill,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
  },
});

