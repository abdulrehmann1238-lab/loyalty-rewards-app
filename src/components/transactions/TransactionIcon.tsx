import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  ArrowUpRight,
  BookOpen,
  Coffee,
  Leaf,
  Plane,
  ShoppingBag,
  ShoppingCart,
  Utensils,
} from 'lucide-react-native';
import { useAppTheme } from '@/theme/ThemeContext';
import { MerchantCategory, TransactionType } from '@/types/transaction';

interface TransactionIconProps {
  category: MerchantCategory;
  type: TransactionType;
  size?: number;
}

export function TransactionIcon({ category, type, size = 40 }: TransactionIconProps) {
  const { colors } = useAppTheme();

  const isRedeemed = type === 'redeemed';
  const bg = isRedeemed ? colors.goldSoft : colors.primarySoft;
  const fg = isRedeemed ? colors.gold : colors.primary;

  const Icon = (() => {
    switch (category) {
      case 'coffee':
        return Coffee;
      case 'grocery':
        return ShoppingCart;
      case 'fashion':
        return ShoppingBag;
      case 'dining':
        return Utensils;
      case 'travel':
        return Plane;
      case 'books':
        return BookOpen;
      case 'wellness':
        return Leaf;
      case 'redemption':
      default:
        return ArrowUpRight;
    }
  })();

  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size * 0.34,
          backgroundColor: bg,
        },
      ]}
    >
      <Icon size={size * 0.45} color={fg} strokeWidth={1.8} />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

