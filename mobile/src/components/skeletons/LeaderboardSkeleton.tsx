import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton, { SkeletonLine } from '../Skeleton';
import { Colors, Radius, Shadows, Spacing } from '../../constants/colors';

function LeaderboardRowSkeleton() {
  return (
    <View style={styles.row}>
      {/* Rank box */}
      <Skeleton width={36} height={36} borderRadius={10} />
      {/* Pet icon */}
      <Skeleton width={36} height={36} borderRadius={10} style={{ marginLeft: Spacing.sm }} />
      {/* Name / pet name */}
      <View style={styles.info}>
        <SkeletonLine width={100} height={15} />
        <SkeletonLine width={70} height={12} style={{ marginTop: 4 }} />
      </View>
      {/* Stats */}
      <View style={styles.stats}>
        <SkeletonLine width={40} height={13} />
        <SkeletonLine width={50} height={11} style={{ marginTop: 4 }} />
      </View>
    </View>
  );
}

export default function LeaderboardListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <View>
      {[...Array(count)].map((_, i) => (
        <LeaderboardRowSkeleton key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginVertical: 3,
    ...Shadows.sm,
  },
  info: { flex: 1, marginLeft: Spacing.md },
  stats: { alignItems: 'flex-end' },
});
