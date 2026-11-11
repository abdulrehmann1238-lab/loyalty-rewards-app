import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowRight, CheckCircle2, Coffee, Receipt, Wallet } from 'lucide-react-native';
import { LayoutMetrics } from '@/constants/layout';
import { useResponsive } from '@/hooks/useResponsive';
import { FontFamilies, Radii, Shadows, TabularNumStyle } from '@/theme/tokens';

export function HowItWorksSection() {
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
        <View style={styles.headerBlock}>
          <Text style={[styles.eyebrow, { fontFamily: FontFamilies.bodySemiBold }]}>
            HOW IT WORKS
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
            Simple rewards.{'\n'}Clear visibility.
          </Text>
          <Text style={[styles.sub, { fontFamily: FontFamilies.bodyRegular }]}>
            From everyday purchases to your reward balance, everything stays easy to follow.
          </Text>
        </View>

        <View style={[styles.grid, stacked ? styles.gridStacked : undefined]}>
          <StepCard
            step="01"
            title="Earn Rewards"
            description="Earn reward points through eligible purchases."
            visual={
              <View style={styles.miniStage}>
                <View style={styles.receiptMock}>
                  <View style={styles.receiptTop}>
                    <Receipt size={13} color="#777C75" />
                    <Text style={[styles.receiptLabel, { fontFamily: FontFamilies.bodyMedium }]}>
                      Coffee House · $24.00
                    </Text>
                  </View>
                  <View style={styles.receiptDash} />
                  <View style={styles.rewardToastMock}>
                    <CheckCircle2 size={14} color="#4F8065" />
                    <Text style={[styles.rewardToastText, TabularNumStyle, { fontFamily: FontFamilies.bodySemiBold }]}>
                      +120 RWD earned
                    </Text>
                  </View>
                </View>
              </View>
            }
          />

          <StepCard
            step="02"
            title="Track Your Balance"
            description="See your available reward tokens and wallet balance in one place."
            visual={
              <View style={styles.miniStage}>
                <View style={styles.miniWalletCard}>
                  <View style={styles.miniWalletHead}>
                    <Text style={[styles.miniWalletLabel, { fontFamily: FontFamilies.bodySemiBold }]}>
                      TOTAL BALANCE
                    </Text>
                    <Wallet size={13} color="#B59A69" />
                  </View>
                  <Text style={[styles.miniWalletAmount, TabularNumStyle, { fontFamily: FontFamilies.headingBold }]}>
                    12,840.50 RWD
                  </Text>
                  <Text style={[styles.miniWalletSub, { fontFamily: FontFamilies.bodyRegular }]}>
                    Available · 12,500.50 RWD
                  </Text>
                </View>
              </View>
            }
          />

          <StepCard
            step="03"
            title="Follow Every Transaction"
            description="Explore your recent token activity and understand where your rewards come from."
            visual={
              <View style={styles.miniStage}>
                <View style={styles.miniTxList}>
                  <View style={styles.miniTxRow}>
                    <View style={styles.miniTxIcon}>
                      <Coffee size={12} color="#234B3B" />
                    </View>
                    <Text style={[styles.miniTxName, { fontFamily: FontFamilies.bodyMedium }]}>
                      Coffee House
                    </Text>
                    <Text style={[styles.miniTxPos, TabularNumStyle, { fontFamily: FontFamilies.bodySemiBold }]}>
                      +120
                    </Text>
                  </View>
                  <View style={styles.miniTxRow}>
                    <View style={[styles.miniTxIcon, { backgroundColor: '#F6F1E6' }]}>
                      <ArrowRight size={12} color="#B59A69" />
                    </View>
                    <Text style={[styles.miniTxName, { fontFamily: FontFamilies.bodyMedium }]}>
                      Travel Credit
                    </Text>
                    <Text style={[styles.miniTxNeg, TabularNumStyle, { fontFamily: FontFamilies.bodySemiBold }]}>
                      -500
                    </Text>
                  </View>
                </View>
              </View>
            }
          />
        </View>
      </View>
    </View>
  );
}

function StepCard({
  step,
  title,
  description,
  visual,
}: {
  step: string;
  title: string;
  description: string;
  visual: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={[
        styles.card,
        hovered ? Shadows.card : Shadows.subtle,
        {
          borderColor: hovered ? '#C7BEA9' : '#E7E0D3',
          transform: [{ translateY: hovered ? -3 : 0 }],
        },
        Platform.OS === 'web'
          ? ({
              transitionProperty: 'transform, border-color, box-shadow',
              transitionDuration: '180ms',
            } as any)
          : undefined,
      ]}
    >
      {visual}
      <View style={styles.cardBody}>
        <Text style={[styles.stepTag, TabularNumStyle, { fontFamily: FontFamilies.mono }]}>
          STEP {step}
        </Text>
        <Text style={[styles.cardTitle, { fontFamily: FontFamilies.headingSemiBold }]}>
          {title}
        </Text>
        <Text style={[styles.cardDesc, { fontFamily: FontFamilies.bodyRegular }]}>
          {description}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    backgroundColor: '#F8F7F2',
    paddingVertical: 84,
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    gap: 42,
  },
  headerBlock: {
    gap: 12,
    maxWidth: 580,
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
  sub: {
    fontSize: 16.5,
    lineHeight: 26,
    color: '#777C75',
  },
  grid: {
    flexDirection: 'row',
    gap: 20,
  },
  gridStacked: {
    flexDirection: 'column',
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.xl,
    borderWidth: 1,
    padding: 20,
    gap: 20,
  },
  miniStage: {
    backgroundColor: '#F2F0E8',
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: '#E7E0D3',
    padding: 16,
    minHeight: 132,
    justifyContent: 'center',
  },
  receiptMock: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: '#E7E0D3',
    padding: 12,
    gap: 9,
  },
  receiptTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  receiptLabel: {
    fontSize: 12.5,
    color: '#252A27',
  },
  receiptDash: {
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 0.6,
    borderColor: '#D5CCB9',
  },
  rewardToastMock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#EBF2EE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radii.sm,
  },
  rewardToastText: {
    fontSize: 12.5,
    color: '#234B3B',
  },
  miniWalletCard: {
    backgroundColor: '#234B3B',
    borderRadius: Radii.md,
    padding: 14,
    gap: 6,
  },
  miniWalletHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  miniWalletLabel: {
    fontSize: 10,
    letterSpacing: 0.9,
    color: 'rgba(248,247,242,0.72)',
  },
  miniWalletAmount: {
    fontSize: 20,
    color: '#F8F7F2',
  },
  miniWalletSub: {
    fontSize: 11.5,
    color: 'rgba(248,247,242,0.75)',
  },
  miniTxList: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: '#E7E0D3',
    padding: 10,
    gap: 8,
  },
  miniTxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  miniTxIcon: {
    width: 24,
    height: 24,
    borderRadius: 7,
    backgroundColor: '#EAF0EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniTxName: {
    flex: 1,
    fontSize: 12.5,
    color: '#252A27',
  },
  miniTxPos: {
    fontSize: 12.5,
    color: '#4F8065',
  },
  miniTxNeg: {
    fontSize: 12.5,
    color: '#252A27',
  },
  cardBody: {
    gap: 6,
  },
  stepTag: {
    fontSize: 11,
    color: '#B59A69',
    letterSpacing: 0.8,
  },
  cardTitle: {
    fontSize: 19,
    color: '#252A27',
    letterSpacing: -0.3,
  },
  cardDesc: {
    fontSize: 14.5,
    lineHeight: 22,
    color: '#777C75',
  },
});

