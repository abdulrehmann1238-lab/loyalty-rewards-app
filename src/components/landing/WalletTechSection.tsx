import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CheckCircle2, Code2, Globe, Wallet } from 'lucide-react-native';
import { LayoutMetrics } from '@/constants/layout';
import { useResponsive } from '@/hooks/useResponsive';
import { FontFamilies, Radii, Shadows, TabularNumStyle } from '@/theme/tokens';

export function WalletTechSection() {
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
        <View style={[styles.row, stacked ? styles.rowStacked : undefined]}>
          <View style={styles.visualCol}>
            <View style={[styles.walletInterfaceCard, Shadows.card]}>
              <View style={styles.annotationPill}>
                <Code2 size={13} color="#234B3B" />
                <Text style={[styles.annotationText, { fontFamily: FontFamilies.bodySemiBold }]}>
                  Smart contract data visualization
                </Text>
              </View>

              <View style={styles.stateBar}>
                <View style={styles.stateLeft}>
                  <View style={styles.liveDot} />
                  <Text style={[styles.stateLabel, { fontFamily: FontFamilies.bodySemiBold }]}>
                    Connected Wallet
                  </Text>
                </View>
                <View style={styles.networkPill}>
                  <Globe size={12} color="#234B3B" />
                  <Text style={[styles.networkText, { fontFamily: FontFamilies.bodyMedium }]}>
                    Ethereum Sepolia (Demo)
                  </Text>
                </View>
              </View>

              <View style={styles.dataPanel}>
                <View style={styles.dataRow}>
                  <Text style={[styles.dataKey, { fontFamily: FontFamilies.bodyRegular }]}>
                    Wallet Address
                  </Text>
                  <Text style={[styles.dataMono, TabularNumStyle, { fontFamily: FontFamilies.mono }]}>
                    0x71C7...9A42
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.dataRow}>
                  <Text style={[styles.dataKey, { fontFamily: FontFamilies.bodyRegular }]}>
                    Token Balance
                  </Text>
                  <Text style={[styles.dataValStrong, TabularNumStyle, { fontFamily: FontFamilies.headingBold }]}>
                    12,840.50 RWD
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.dataRow}>
                  <Text style={[styles.dataKey, { fontFamily: FontFamilies.bodyRegular }]}>
                    Read Interface
                  </Text>
                  <Text style={[styles.dataMono, { fontFamily: FontFamilies.mono }]}>
                    balanceOf(address) · ERC-20
                  </Text>
                </View>
              </View>

              <View style={styles.txPreviewCard}>
                <View style={styles.txPreviewLeft}>
                  <CheckCircle2 size={16} color="#4F8065" />
                  <View>
                    <Text style={[styles.txPreviewTitle, { fontFamily: FontFamilies.bodySemiBold }]}>
                      Coffee House · +120 RWD
                    </Text>
                    <Text style={[styles.txPreviewHash, TabularNumStyle, { fontFamily: FontFamilies.mono }]}>
                      Block #7,142,908 · 0x8b4c...1d7e
                    </Text>
                  </View>
                </View>
                <Text style={[styles.txPreviewTag, { fontFamily: FontFamilies.bodyMedium }]}>
                  Confirmed
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.copyCol}>
            <Text style={[styles.eyebrow, { fontFamily: FontFamilies.bodySemiBold }]}>
              WALLET ARCHITECTURE
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
              Connected to your digital wallet.
            </Text>
            <Text style={[styles.desc, { fontFamily: FontFamilies.bodyRegular }]}>
              Stay informed about your wallet address, reward token balance, and recent on-chain
              activity through a simple, approachable interface.
            </Text>

            <View style={styles.points}>
              <View style={styles.pointRow}>
                <Wallet size={17} color="#234B3B" />
                <Text style={[styles.pointText, { fontFamily: FontFamilies.bodyMedium }]}>
                  Clean ERC-20 read abstraction ready for ethers.js or viem
                </Text>
              </View>
              <View style={styles.pointRow}>
                <Code2 size={17} color="#234B3B" />
                <Text style={[styles.pointText, { fontFamily: FontFamilies.bodyMedium }]}>
                  Simulated demonstration network — no live wallet signing required
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    backgroundColor: '#F8F7F2',
    paddingVertical: 88,
    alignItems: 'center',
  },
  inner: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 48,
  },
  rowStacked: {
    flexDirection: 'column-reverse',
    alignItems: 'stretch',
    gap: 36,
  },
  visualCol: {
    flex: 1.05,
  },
  walletInterfaceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: '#E7E0D3',
    padding: 22,
    gap: 16,
  },
  annotationPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#F2F0E8',
    borderWidth: 1,
    borderColor: '#E7E0D3',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: Radii.pill,
  },
  annotationText: {
    fontSize: 11.5,
    color: '#234B3B',
  },
  stateBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  stateLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4F8065',
  },
  stateLabel: {
    fontSize: 14.5,
    color: '#252A27',
  },
  networkPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EAF0EC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radii.pill,
  },
  networkText: {
    fontSize: 12,
    color: '#234B3B',
  },
  dataPanel: {
    backgroundColor: '#F8F7F2',
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: '#E7E0D3',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    gap: 12,
    flexWrap: 'wrap',
  },
  dataKey: {
    fontSize: 13,
    color: '#777C75',
  },
  dataMono: {
    fontSize: 13,
    color: '#252A27',
  },
  dataValStrong: {
    fontSize: 15.5,
    color: '#234B3B',
  },
  divider: {
    height: 1,
    backgroundColor: '#E7E0D3',
  },
  txPreviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: 13,
    borderRadius: Radii.md,
    backgroundColor: '#EBF2EE',
  },
  txPreviewLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  txPreviewTitle: {
    fontSize: 13,
    color: '#252A27',
  },
  txPreviewHash: {
    fontSize: 11.5,
    color: '#5E645C',
    marginTop: 1,
  },
  txPreviewTag: {
    fontSize: 11.5,
    color: '#4F8065',
  },
  copyCol: {
    flex: 0.95,
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
  points: {
    gap: 12,
    marginTop: 4,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pointText: {
    fontSize: 14,
    color: '#252A27',
    flex: 1,
    lineHeight: 20,
  },
});

