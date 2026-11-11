import React, { useState } from 'react';
import { LayoutChangeEvent, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Stop,
} from 'react-native-svg';
import { Card } from '@/components/common/Card';
import { useWalletStore } from '@/store/walletStore';
import { useAppTheme } from '@/theme/ThemeContext';
import { FontFamilies, Radii, TabularNumStyle } from '@/theme/tokens';
import { formatTokenAmount } from '@/utils/format';

type ChartMetric = 'balance' | 'earned';

export function RewardActivityChart() {
  const { colors } = useAppTheme();
  const activity7d = useWalletStore((s) => s.activity7d);
  const [metric, setMetric] = useState<ChartMetric>('balance');
  const [activeIndex, setActiveIndex] = useState<number>(activity7d.length - 1);
  const [chartWidth, setChartWidth] = useState<number>(520);

  const chartHeight = 186;
  const padLeft = 14;
  const padRight = 14;
  const padTop = 22;
  const padBottom = 18;
  const usableWidth = Math.max(chartWidth - padLeft - padRight, 120);
  const usableHeight = chartHeight - padTop - padBottom;

  const values = activity7d.map((p) => (metric === 'balance' ? p.balance : p.earned));
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const paddingRange = metric === 'balance' ? Math.max((maxVal - minVal) * 0.28, 120) : Math.max(maxVal * 0.18, 60);
  const low = metric === 'balance' ? minVal - paddingRange : 0;
  const high = maxVal + paddingRange;
  const span = Math.max(high - low, 1);

  const coords = activity7d.map((p, idx) => {
    const val = metric === 'balance' ? p.balance : p.earned;
    const x = padLeft + (idx / Math.max(activity7d.length - 1, 1)) * usableWidth;
    const y = padTop + usableHeight - ((val - low) / span) * usableHeight;
    return { x, y, val, point: p };
  });

  // Smooth cubic bezier path
  const linePath = coords.reduce((acc, pt, idx) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`;
    const prev = coords[idx - 1];
    const cx = (prev.x + pt.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${pt.y}, ${pt.x} ${pt.y}`;
  }, '');

  const areaPath =
    coords.length > 0
      ? `${linePath} L ${coords[coords.length - 1].x} ${chartHeight - padBottom} L ${coords[0].x} ${
          chartHeight - padBottom
        } Z`
      : '';

  const activePoint = coords[activeIndex] ?? coords[coords.length - 1];

  const handleLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 100) setChartWidth(w);
  };

  return (
    <Card padding={22}>
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={[styles.title, { color: colors.text, fontFamily: FontFamilies.headingSemiBold }]}>
            Reward Activity
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular },
            ]}
          >
            7-day token activity · Hover or tap any day
          </Text>
        </View>

        <View
          style={[
            styles.toggleGroup,
            { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
          ]}
        >
          <Pressable
            onPress={() => setMetric('balance')}
            style={[
              styles.toggleBtn,
              metric === 'balance' ? { backgroundColor: colors.surface } : undefined,
            ]}
          >
            <Text
              style={[
                styles.toggleLabel,
                {
                  color: metric === 'balance' ? colors.primary : colors.textSecondary,
                  fontFamily: metric === 'balance' ? FontFamilies.bodySemiBold : FontFamilies.bodyMedium,
                },
              ]}
            >
              Balance
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMetric('earned')}
            style={[
              styles.toggleBtn,
              metric === 'earned' ? { backgroundColor: colors.surface } : undefined,
            ]}
          >
            <Text
              style={[
                styles.toggleLabel,
                {
                  color: metric === 'earned' ? colors.primary : colors.textSecondary,
                  fontFamily: metric === 'earned' ? FontFamilies.bodySemiBold : FontFamilies.bodyMedium,
                },
              ]}
            >
              Daily Earned
            </Text>
          </Pressable>
        </View>
      </View>

      {activePoint ? (
        <View
          style={[
            styles.tooltipStrip,
            { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
          ]}
        >
          <View style={styles.tooltipLeft}>
            <Text style={[styles.tooltipDate, { color: colors.textSecondary, fontFamily: FontFamilies.bodyMedium }]}>
              {activePoint.point.day}, {activePoint.point.dateLabel}
            </Text>
            <Text
              style={[
                styles.tooltipMain,
                TabularNumStyle,
                { color: colors.text, fontFamily: FontFamilies.headingBold },
              ]}
            >
              {metric === 'balance'
                ? `${formatTokenAmount(activePoint.point.balance)} RWD`
                : `+${formatTokenAmount(activePoint.point.earned)} RWD`}
            </Text>
          </View>
          <View style={styles.tooltipRight}>
            <Text style={[styles.tooltipMeta, TabularNumStyle, { color: colors.success, fontFamily: FontFamilies.bodyMedium }]}>
              +{formatTokenAmount(activePoint.point.earned)} earned
            </Text>
            {activePoint.point.redeemed > 0 ? (
              <Text style={[styles.tooltipMeta, TabularNumStyle, { color: colors.gold, fontFamily: FontFamilies.bodyMedium }]}>
                -{formatTokenAmount(activePoint.point.redeemed)} redeemed
              </Text>
            ) : null}
          </View>
        </View>
      ) : null}

      <View onLayout={handleLayout} style={styles.svgContainer}>
        <Svg width={chartWidth} height={chartHeight}>
          <Defs>
            <LinearGradient id="verdantArea" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={colors.primary} stopOpacity="0.20" />
              <Stop offset="100%" stopColor={colors.primary} stopOpacity="0.01" />
            </LinearGradient>
          </Defs>

          {[0.25, 0.55, 0.85].map((ratio) => {
            const gy = padTop + usableHeight * ratio;
            return (
              <Line
                key={ratio}
                x1={padLeft}
                y1={gy}
                x2={chartWidth - padRight}
                y2={gy}
                stroke={colors.border}
                strokeWidth="1"
                strokeDasharray="3 4"
              />
            );
          })}

          {areaPath ? <Path d={areaPath} fill="url(#verdantArea)" /> : null}
          {linePath ? (
            <Path d={linePath} fill="none" stroke={colors.primary} strokeWidth="2.4" strokeLinecap="round" />
          ) : null}

          {activePoint ? (
            <Line
              x1={activePoint.x}
              y1={padTop}
              x2={activePoint.x}
              y2={chartHeight - padBottom}
              stroke={colors.sage}
              strokeWidth="1"
              strokeDasharray="2 3"
            />
          ) : null}

          {coords.map((c, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <React.Fragment key={c.point.dateLabel}>
                {isSelected ? (
                  <Circle cx={c.x} cy={c.y} r={9} fill={colors.primary} fillOpacity={0.14} />
                ) : null}
                <Circle
                  cx={c.x}
                  cy={c.y}
                  r={isSelected ? 4.8 : 3.2}
                  fill={isSelected ? colors.primary : colors.surface}
                  stroke={colors.primary}
                  strokeWidth={isSelected ? 2 : 1.6}
                />
              </React.Fragment>
            );
          })}
        </Svg>

        {/* Interactive invisible touch/hover columns */}
        <View style={styles.hitLayer}>
          {coords.map((c, idx) => (
            <Pressable
              key={c.point.dateLabel}
              onPress={() => setActiveIndex(idx)}
              onHoverIn={() => setActiveIndex(idx)}
              accessibilityRole="button"
              accessibilityLabel={`Select ${c.point.dateLabel}`}
              style={[
                styles.hitColumn,
                Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.xAxis}>
        {activity7d.map((p, idx) => {
          const active = idx === activeIndex;
          return (
            <Pressable key={p.dateLabel} onPress={() => setActiveIndex(idx)} style={styles.xTick}>
              <Text
                style={[
                  styles.xLabel,
                  {
                    color: active ? colors.primary : colors.textMuted,
                    fontFamily: active ? FontFamilies.bodySemiBold : FontFamilies.bodyRegular,
                  },
                ]}
              >
                {p.dateLabel}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 14,
  },
  titleBlock: {
    gap: 2,
  },
  title: {
    fontSize: 17,
  },
  subtitle: {
    fontSize: 12.5,
  },
  toggleGroup: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: Radii.pill,
    borderWidth: 1,
    gap: 2,
  },
  toggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.pill,
  },
  toggleLabel: {
    fontSize: 12,
  },
  tooltipStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radii.md,
    borderWidth: 1,
    marginBottom: 8,
    gap: 10,
  },
  tooltipLeft: {
    gap: 2,
  },
  tooltipDate: {
    fontSize: 11.5,
  },
  tooltipMain: {
    fontSize: 16,
  },
  tooltipRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  tooltipMeta: {
    fontSize: 12,
  },
  svgContainer: {
    position: 'relative',
    width: '100%',
    height: 186,
  },
  hitLayer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    flexDirection: 'row',
  },
  hitColumn: {
    flex: 1,
    height: '100%',
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  xTick: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  xLabel: {
    fontSize: 11,
  },
});
