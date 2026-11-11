import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { ArrowRight, ArrowUpRight, Coffee, ShoppingCart } from 'lucide-react-native';
import { Button } from '@/components/common/Button';
import { LayoutMetrics } from '@/constants/layout';
import { useResponsive } from '@/hooks/useResponsive';
import { FontFamilies, Radii, Shadows, TabularNumStyle } from '@/theme/tokens';

interface RewardsShowcaseSectionProps {
  onOpenDashboard: () => void;
  onViewTransactions: () => void;
}

export function RewardsShowcaseSection({
  onOpenDashboard,
  onViewTransactions,
}: RewardsShowcaseSectionProps) {
  const { isMobile, isTablet } = useResponsive();
  const stacked = isMobile || isTablet;

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
        <View style={[styles.layoutRow, stacked ? styles.layoutStacked : undefined]}>
          <View style={styles.copyCol}>
            <Text style={[styles.eyebrow, { fontFamily: FontFamilies.bodySemiBold }]}>
              REWARDS ORGANIZER
            </Text>
            <Text
              style={[
                styles.heading,
                {
                  fontSize: isMobile ? 30 : 40,
                  lineHeight: isMobile ? 36 : 46,
                  fontFamily: FontFamilies.headingBold,
                },
              ]}
            >
              Your rewards,{'\n'}beautifully organized.
            </Text>
            <Text style={[styles.desc, { fontFamily: FontFamilies.bodyRegular }]}>
              Keep your available balance, lifetime earnings, and latest merchant rewards aligned in
              one calm, unified view—crafted for clarity on mobile and desktop alike.
            </Text>

            <View style={styles.ctaWrap}>
              <Button
                label="View Transactions"
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight size={16} color="#F8F7F2" />}
                onPress={onViewTransactions}
              />
              <Button
                label="Open Interactive Dashboard"
                variant="outline"
                size="lg"
                onPress={onOpenDashboard}
              />
            </View>
          </View>

          <View style={styles.previewCol}>
            <View style={[styles.showcaseCard, Shadows.floating]}>
              <View style={styles.showcaseTop}>
                <View>
                  <Text style={[styles.showcaseTag, { fontFamily: FontFamilies.bodySemiBold }]}>
                    VERDANT REWARD WALLET
                  </Text>
                  <Text style={[styles.showcaseUser, { fontFamily: FontFamilies.bodyRegular }]}>
                    Alex Morgan · Rewards Member
                  </Text>
                </View>
                <View style={styles.walletStatusChip}>
                  <View style={styles.greenDot} />
                  <Text style={[styles.walletStatusText, TabularNumStyle, { fontFamily: FontFamilies.mono }]}>
                    0x71C7...9A42
                  </Text>
                </View>
              </View>

              <View style={styles.forestPanel}>
                <View style={styles.forestDecor}>
                  <Svg width="100%" height="100%" viewBox="0 0 400 140">
                    <Circle cx="350" cy="30" r="65" stroke="#B59A69" strokeOpacity="0.22" strokeWidth="1" fill="none" />
                    <Path d="M220 140 C 280 80, 340 90, 410 35" stroke="#F8F7F2" strokeOpacity="0.12" strokeWidth="1" fill="none" />
                  </Svg>
                </View>
                <Text style={[styles.forestLabel, { fontFamily: FontFamilies.bodySemiBold }]}>
                  REWARD TOKEN BALANCE
                </Text>
                <View style={styles.forestBalanceRow}>
                  <Text style={[styles.forestAmount, TabularNumStyle, { fontFamily: FontFamilies.headingBold }]}>
                    12,840.50
                  </Text>
                  <Text style={[styles.forestUnit, { fontFamily: FontFamilies.headingSemiBold }]}>
                    RWD
                  </Text>
                </View>
                <View style={styles.forestMeta}>
                  <Text style={[styles.forestMetaItem, TabularNumStyle, { fontFamily: FontFamilies.bodyRegular }]}>
                    Earned: 18,450 RWD
                  </Text>
                  <Text style={[styles.forestMetaItem, TabularNumStyle, { fontFamily: FontFamilies.bodyRegular }]}>
                    Redeemed: 5,609.50 RWD
                  </Text>
                </View>
              </View>

              <View style={styles.recentHeader}>
                <Text style={[styles.recentTitle, { fontFamily: FontFamilies.bodySemiBold }]}>
                  Recent Activity
                </Text>
                <Text style={[styles.recentLink, { fontFamily: FontFamilies.bodyMedium }]}>
                  24 total entries
                </Text>
              </View>

              <View style={styles.activityList}>
                <PreviewRow
                  icon={<Coffee size={15} color="#234B3B" />}
                  title="Coffee House"
                  sub="Purchase Reward · Nov 11"
                  amount="+120 RWD"
                  positive
                />
                <PreviewRow
                  icon={<ShoppingCart size={15} color="#234B3B" />}
                  title="Fresh Market"
                  sub="Purchase Reward · Nov 10"
                  amount="+250 RWD"
                  positive
                />
                <PreviewRow
                  icon={<ArrowUpRight size={15} color="#B59A69" />}
                  title="Reward Redemption"
                  sub="Travel Lounge Credit · Nov 8"
                  amount="-500 RWD"
                  positive={false}
                  last
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function PreviewRow({
  icon,
  title,
  sub,
  amount,
  positive,
  last = false,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  amount: string;
  positive: boolean;
  last?: boolean;
}) {
  return (
    <View style={[styles.rowItem, !last ? styles.rowBorder : undefined]}>
      <View style={[styles.rowIcon, { backgroundColor: positive ? '#EAF0EC' : '#F6F1E6' }]}>
        {icon}
      </View>
      <View style={styles.rowText}>
        <Text style={[styles.rowTitle, { fontFamily: FontFamilies.bodySemiBold }]}>{title}</Text>
        <Text style={[styles.rowSub, { fontFamily: FontFamilies.bodyRegular }]}>{sub}</Text>
      </View>
      <Text
        style={[
          styles.rowAmount,
          TabularNumStyle,
          { color: positive ? '#4F8065' : '#252A27', fontFamily: FontFamilies.headingSemiBold },
        ]}
      >
        {amount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    backgroundColor: '#F2F0E8',
    paddingVertical: 88,
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E7E0D3',
  },
  inner: {
    width: '100%',
  },
  layoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 48,
  },
  layoutStacked: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 36,
  },
  copyCol: {
    flex: 0.9,
    gap: 16,
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 1.8,
    color: '#234B3B',
  },
  heading: {
    color: '#252A27',
    letterSpacing: -0.9,
  },
  desc: {
    fontSize: 16,
    lineHeight: 26,
    color: '#777C75',
  },
  ctaWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  previewCol: {
    flex: 1.1,
  },
  showcaseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: '#E7E0D3',
    padding: 22,
    gap: 18,
  },
  showcaseTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  showcaseTag: {
    fontSize: 11,
    letterSpacing: 1,
    color: '#777C75',
  },
  showcaseUser: {
    fontSize: 14,
    color: '#252A27',
    marginTop: 2,
  },
  walletStatusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#EAF0EC',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: Radii.pill,
  },
  greenDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4F8065',
  },
  walletStatusText: {
    fontSize: 12,
    color: '#234B3B',
  },
  forestPanel: {
    backgroundColor: '#234B3B',
    borderRadius: Radii.lg,
    padding: 20,
    gap: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  forestDecor: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  forestLabel: {
    fontSize: 11,
    letterSpacing: 1,
    color: 'rgba(248,247,242,0.72)',
  },
  forestBalanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  forestAmount: {
    fontSize: 34,
    color: '#F8F7F2',
    letterSpacing: -0.8,
  },
  forestUnit: {
    fontSize: 16,
    color: '#B59A69',
  },
  forestMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 4,
  },
  forestMetaItem: {
    fontSize: 12.5,
    color: 'rgba(248,247,242,0.8)',
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentTitle: {
    fontSize: 14.5,
    color: '#252A27',
  },
  recentLink: {
    fontSize: 12.5,
    color: '#777C75',
  },
  activityList: {
    gap: 2,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#EFECE3',
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    gap: 1,
  },
  rowTitle: {
    fontSize: 13.5,
    color: '#252A27',
  },
  rowSub: {
    fontSize: 12,
    color: '#777C75',
  },
  rowAmount: {
    fontSize: 13.5,
  },
});
