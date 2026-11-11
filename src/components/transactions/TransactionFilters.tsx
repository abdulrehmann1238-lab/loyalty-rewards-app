import React from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Calendar, Search, X } from 'lucide-react-native';
import { useAppTheme } from '@/theme/ThemeContext';
import { FontFamilies, Radii } from '@/theme/tokens';
import { DateRangeFilter, TransactionFilterType } from '@/types/transaction';

interface TransactionFiltersProps {
  activeType: TransactionFilterType;
  onChangeType: (filter: TransactionFilterType) => void;
  activeDateRange: DateRangeFilter;
  onChangeDateRange: (range: DateRangeFilter) => void;
  searchQuery: string;
  onChangeSearch: (query: string) => void;
}

const TYPE_OPTIONS: { value: TransactionFilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'received', label: 'Received' },
  { value: 'redeemed', label: 'Redeemed' },
  { value: 'pending', label: 'Pending' },
];

const DATE_OPTIONS: { value: DateRangeFilter; label: string }[] = [
  { value: 'all', label: 'All Dates' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
];

export function TransactionFilters({
  activeType,
  onChangeType,
  activeDateRange,
  onChangeDateRange,
  searchQuery,
  onChangeSearch,
}: TransactionFiltersProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.wrapper}>
      <View style={styles.topBar}>
        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Search size={16} color={colors.textSecondary} />
          <TextInput
            value={searchQuery}
            onChangeText={onChangeSearch}
            placeholder="Search merchant, transaction ID, or hash..."
            placeholderTextColor={colors.textMuted}
            accessibilityLabel="Search transactions"
            style={[
              styles.searchInput,
              { color: colors.text, fontFamily: FontFamilies.bodyRegular },
            ]}
          />
          {searchQuery.length > 0 ? (
            <Pressable
              onPress={() => onChangeSearch('')}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              hitSlop={8}
            >
              <X size={15} color={colors.textSecondary} />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.dateGroup}>
          <Calendar size={14} color={colors.textSecondary} />
          {DATE_OPTIONS.map((opt) => {
            const active = activeDateRange === opt.value;
            return (
              <Pressable
                key={opt.value}
                onPress={() => onChangeDateRange(opt.value)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                style={[
                  styles.datePill,
                  {
                    backgroundColor: active ? colors.primarySoft : colors.surface,
                    borderColor: active ? colors.primary : colors.border,
                  },
                  Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined,
                ]}
              >
                <Text
                  style={[
                    styles.dateText,
                    {
                      color: active ? colors.primary : colors.textSecondary,
                      fontFamily: active ? FontFamilies.bodySemiBold : FontFamilies.bodyMedium,
                    },
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.typeRow}>
        {TYPE_OPTIONS.map((opt) => {
          const active = activeType === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onChangeType(opt.value)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={[
                styles.typePill,
                {
                  backgroundColor: active ? colors.primary : colors.surface,
                  borderColor: active ? colors.primary : colors.border,
                },
                Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined,
              ]}
            >
              <Text
                style={[
                  styles.typeText,
                  {
                    color: active ? colors.textOnPrimary : colors.textSecondary,
                    fontFamily: active ? FontFamilies.bodySemiBold : FontFamilies.bodyMedium,
                  },
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 12,
  },
  topBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
  },
  searchBox: {
    flex: 1,
    minWidth: 240,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: Radii.md,
    paddingHorizontal: 14,
    minHeight: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 8,
  },
  dateGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  datePill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radii.pill,
    borderWidth: 1,
    minHeight: 38,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 12.5,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typePill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radii.pill,
    borderWidth: 1,
    minHeight: 38,
    justifyContent: 'center',
  },
  typeText: {
    fontSize: 13,
  },
});
