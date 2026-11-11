import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Eye, Layers, Wallet } from 'lucide-react-native';
import { LayoutMetrics } from '@/constants/layout';
import { useResponsive } from '@/hooks/useResponsive';
import { FontFamilies } from '@/theme/tokens';

const BENEFITS = [
  {
    icon: Layers,
    label: 'Rewards in One Place',
    sub: 'All partner earnings consolidated clearly',
  },
  {
    icon: Eye,
    label: 'Transparent Token Activity',
    sub: 'Every reward and redemption traceable',
  },
  {
    icon: Wallet,
    label: 'Wallet at Your Fingertips',
    sub: 'Connect and inspect balances in seconds',
  },
];

export function TrustStrip() {
  const { isMobile } = useResponsive();

  return (
    <View style={styles.outer}>
      <View
        style={[
          styles.inner,
          {
            maxWidth: LayoutMetrics.maxLandingWidth,
            paddingHorizontal: isMobile ? 20 : 32,
            flexDirection: isMobile ? 'column' : 'row',
          },
        ]}
      >
        {BENEFITS.map((item, index) => {
          const Icon = item.icon;
          return (
            <View
              key={item.label}
              style={[
                styles.item,
                !isMobile && index < BENEFITS.length - 1 ? styles.itemBorderRight : undefined,
                isMobile && index < BENEFITS.length - 1 ? styles.itemBorderBottom : undefined,
              ]}
            >
              <View style={styles.iconCircle}>
                <Icon size={18} color="#234B3B" strokeWidth={1.8} />
              </View>
              <View style={styles.textWrap}>
                <Text style={[styles.label, { fontFamily: FontFamilies.headingSemiBold }]}>
                  {item.label}
                </Text>
                <Text style={[styles.sub, { fontFamily: FontFamilies.bodyRegular }]}>
                  {item.sub}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    backgroundColor: '#F2F0E8',
    borderBottomWidth: 1,
    borderBottomColor: '#E7E0D3',
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    paddingVertical: 18,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  itemBorderRight: {
    borderRightWidth: 1,
    borderRightColor: '#E7E0D3',
  },
  itemBorderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#E7E0D3',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E0D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 14.5,
    color: '#252A27',
  },
  sub: {
    fontSize: 12.5,
    color: '#777C75',
  },
});

