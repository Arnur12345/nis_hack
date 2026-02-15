import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import Icon, { IconName } from './Icon';
import { Colors, Radius, Shadows, Spacing } from '../constants/colors';
import { ActivityResponse } from '../types';

const CATEGORY_META: Record<string, { label: string; color: string; icon: IconName }> = {
  ecology: { label: 'Экология', color: Colors.ecology, icon: 'leaf' },
  social: { label: 'Социальные', color: Colors.social, icon: 'heart' },
  animals: { label: 'Животные', color: Colors.animals, icon: 'paw' },
  education: { label: 'Образование', color: Colors.education, icon: 'book-open-variant' },
};

interface Props {
  data: ActivityResponse;
}

export default function ActivityChart({ data }: Props) {
  const { weekly_activity, this_week_events, this_week_xp, category_breakdown } = data;

  // Bar chart dimensions
  const chartWidth = 280;
  const chartHeight = 120;
  const barGap = 6;
  const barWidth = (chartWidth - barGap * (weekly_activity.length - 1)) / weekly_activity.length;
  const maxCount = Math.max(...weekly_activity.map((d) => d.count), 1);

  // Category totals for percentage bars
  const totalCat = Object.values(category_breakdown).reduce((a, b) => a + b, 0);

  return (
    <View style={styles.container}>
      {/* Summary cards row */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <View style={[styles.summaryIcon, { backgroundColor: Colors.accentSurface }]}>
            <Icon name="calendar-check" size={16} color={Colors.primary} />
          </View>
          <Text style={styles.summaryValue}>{this_week_events}</Text>
          <Text style={styles.summaryLabel}>За неделю</Text>
        </View>
        <View style={styles.summaryCard}>
          <View style={[styles.summaryIcon, { backgroundColor: '#FFF8E1' }]}>
            <Icon name="lightning-bolt" size={16} color="#F59E0B" />
          </View>
          <Text style={styles.summaryValue}>{this_week_xp}</Text>
          <Text style={styles.summaryLabel}>XP за неделю</Text>
        </View>
      </View>

      {/* Weekly Bar Chart */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Активность за неделю</Text>
        <View style={styles.chartContainer}>
          <Svg width={chartWidth} height={chartHeight + 24}>
            {weekly_activity.map((day, i) => {
              const barH = maxCount > 0 ? (day.count / maxCount) * (chartHeight - 20) : 0;
              const x = i * (barWidth + barGap);
              const y = chartHeight - barH - 4;
              const isToday = i === weekly_activity.length - 1;

              return (
                <React.Fragment key={i}>
                  {/* Background bar */}
                  <Rect
                    x={x}
                    y={4}
                    width={barWidth}
                    height={chartHeight - 4}
                    rx={barWidth / 2}
                    fill={Colors.borderLight}
                  />
                  {/* Value bar */}
                  {day.count > 0 && (
                    <Rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barH + 4}
                      rx={barWidth / 2}
                      fill={isToday ? Colors.primary : Colors.accent}
                    />
                  )}
                  {/* Count on top */}
                  {day.count > 0 && (
                    <SvgText
                      x={x + barWidth / 2}
                      y={y - 4}
                      fontSize={10}
                      fontWeight="600"
                      fill={Colors.text}
                      textAnchor="middle"
                    >
                      {day.count}
                    </SvgText>
                  )}
                  {/* Day label */}
                  <SvgText
                    x={x + barWidth / 2}
                    y={chartHeight + 16}
                    fontSize={10}
                    fontWeight={isToday ? '700' : '400'}
                    fill={isToday ? Colors.primary : Colors.textSecondary}
                    textAnchor="middle"
                  >
                    {day.day}
                  </SvgText>
                </React.Fragment>
              );
            })}
          </Svg>
        </View>
      </View>

      {/* Category Breakdown */}
      <View style={styles.catCard}>
        <Text style={styles.chartTitle}>По категориям</Text>
        {totalCat > 0 ? (
          Object.entries(CATEGORY_META).map(([key, meta]) => {
            const count = category_breakdown[key] || 0;
            const pct = totalCat > 0 ? (count / totalCat) * 100 : 0;
            return (
              <View key={key} style={styles.catRow}>
                <View style={styles.catInfo}>
                  <View style={[styles.catDot, { backgroundColor: meta.color }]} />
                  <Icon name={meta.icon} size={14} color={meta.color} />
                  <Text style={styles.catLabel}>{meta.label}</Text>
                </View>
                <View style={styles.catBarBg}>
                  <View style={[styles.catBarFill, { width: `${Math.max(pct, 0)}%`, backgroundColor: meta.color }]} />
                </View>
                <Text style={styles.catCount}>{count}</Text>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Icon name="chart-bar" size={28} color={Colors.textLight} />
            <Text style={styles.emptyText}>Заверши мероприятие — и здесь появится статистика!</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.md },

  // Summary row
  summaryRow: { flexDirection: 'row', gap: Spacing.md },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadows.sm,
  },
  summaryIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  summaryValue: { fontSize: 22, fontWeight: '700', color: Colors.text },
  summaryLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 2, fontWeight: '500' },

  // Chart card
  chartCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  chartContainer: { alignItems: 'center', paddingTop: 4 },

  // Category card
  catCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  catInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 110,
    gap: 6,
  },
  catDot: { width: 8, height: 8, borderRadius: 4 },
  catLabel: { fontSize: 12, color: Colors.text, fontWeight: '500' },
  catBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  catBarFill: { height: 8, borderRadius: 4 },
  catCount: { fontSize: 12, fontWeight: '700', color: Colors.text, width: 24, textAlign: 'right' },

  // Empty state
  emptyState: { alignItems: 'center', paddingVertical: Spacing.lg, gap: 8 },
  emptyText: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', lineHeight: 18 },
});
