import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton, { SkeletonLine } from '../Skeleton';
import { Colors, Radius, Shadows, Spacing } from '../../constants/colors';

export default function EventCardSkeleton() {
  return (
    <View style={styles.card}>
      {/* Top row: category badge + xp badge */}
      <View style={styles.top}>
        <Skeleton width={90} height={24} borderRadius={Radius.sm} />
        <Skeleton width={55} height={22} borderRadius={Radius.sm} />
      </View>

      {/* Title */}
      <SkeletonLine width="85%" height={16} style={{ marginBottom: 6 }} />
      <SkeletonLine width="60%" height={16} style={{ marginBottom: Spacing.sm }} />

      {/* Address row */}
      <View style={styles.row}>
        <Skeleton width={13} height={13} borderRadius={7} />
        <SkeletonLine width="70%" height={13} style={{ marginLeft: 5 }} />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Skeleton width={12} height={12} borderRadius={6} />
          <SkeletonLine width={40} height={12} style={{ marginLeft: 4 }} />
        </View>
        <View style={styles.footerItem}>
          <Skeleton width={12} height={12} borderRadius={6} />
          <SkeletonLine width={70} height={12} style={{ marginLeft: 4 }} />
        </View>
        <Skeleton width={28} height={28} borderRadius={8} style={{ marginLeft: 'auto' as any }} />
      </View>
    </View>
  );
}

/** Renders multiple event card skeletons */
export function EventListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <View>
      {[...Array(count)].map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginVertical: 5,
    ...Shadows.sm,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
});
