import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Skeleton, { SkeletonLine } from '../Skeleton';
import { Colors, Radius, Shadows, Spacing } from '../../constants/colors';

export default function HomeScreenSkeleton() {
  return (
    <View style={styles.container}>
      {/* Header greeting */}
      <View style={styles.header}>
        <SkeletonLine width={180} height={24} />
        <SkeletonLine width={220} height={14} style={{ marginTop: 6 }} />
      </View>

      {/* Pet card */}
      <View style={styles.petCard}>
        <Skeleton width={120} height={120} borderRadius={60} style={{ alignSelf: 'center', marginBottom: 16 }} />
        <SkeletonLine width="60%" height={12} style={{ alignSelf: 'center', marginBottom: 8 }} />
        <Skeleton width="100%" height={8} borderRadius={4} style={{ marginTop: 8 }} />
        <View style={styles.xpRow}>
          <SkeletonLine width={60} height={12} />
          <SkeletonLine width={60} height={12} />
        </View>
      </View>

      {/* Streak card */}
      <View style={styles.streakCard}>
        <Skeleton width={40} height={40} borderRadius={12} />
        <View style={{ marginLeft: 12 }}>
          <SkeletonLine width={80} height={16} />
          <SkeletonLine width={100} height={12} style={{ marginTop: 4 }} />
        </View>
      </View>

      {/* Activity section */}
      <SkeletonLine width={140} height={18} style={{ marginTop: Spacing.xxl, marginBottom: Spacing.md }} />
      <View style={styles.activityCard}>
        <View style={styles.chartRow}>
          {[...Array(7)].map((_, i) => (
            <View key={i} style={styles.barCol}>
              <Skeleton width={24} height={20 + Math.random() * 40} borderRadius={4} />
              <SkeletonLine width={20} height={10} style={{ marginTop: 6 }} />
            </View>
          ))}
        </View>
      </View>

      {/* Quick actions */}
      <SkeletonLine width={170} height={18} style={{ marginTop: Spacing.xxl, marginBottom: Spacing.md }} />
      {[...Array(4)].map((_, i) => (
        <View key={i} style={styles.actionCard}>
          <Skeleton width={40} height={40} borderRadius={12} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <SkeletonLine width={100} height={15} />
            <SkeletonLine width={130} height={12} style={{ marginTop: 4 }} />
          </View>
          <Skeleton width={16} height={16} borderRadius={4} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'ios' ? 64 : 48,
    paddingHorizontal: Spacing.lg,
  },
  header: { marginBottom: Spacing.xl },
  petCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
    ...Shadows.md,
  },
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  streakCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.sm,
  },
  activityCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 80,
  },
  barCol: { alignItems: 'center' },
  actionCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    ...Shadows.sm,
  },
});
