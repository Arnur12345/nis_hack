import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Skeleton, { SkeletonLine } from '../Skeleton';
import { Colors, Radius, Shadows, Spacing } from '../../constants/colors';

export default function EventDetailSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.scroll}>
        {/* Back button */}
        <View style={styles.back}>
          <Skeleton width={20} height={20} borderRadius={4} />
          <SkeletonLine width={50} height={15} style={{ marginLeft: 6 }} />
        </View>

        {/* Category row */}
        <View style={styles.catRow}>
          <Skeleton width={100} height={28} borderRadius={Radius.full} />
          <Skeleton width={70} height={28} borderRadius={Radius.full} />
        </View>

        {/* Title */}
        <SkeletonLine width="90%" height={24} style={{ marginBottom: 8 }} />
        <SkeletonLine width="65%" height={24} style={{ marginBottom: Spacing.sm }} />

        {/* Description */}
        <SkeletonLine width="100%" height={15} style={{ marginBottom: 6 }} />
        <SkeletonLine width="100%" height={15} style={{ marginBottom: 6 }} />
        <SkeletonLine width="100%" height={15} style={{ marginBottom: 6 }} />
        <SkeletonLine width="75%" height={15} style={{ marginBottom: Spacing.xxl }} />

        {/* Info cards */}
        {[...Array(3)].map((_, i) => (
          <View key={i} style={styles.infoCard}>
            <Skeleton width={40} height={40} borderRadius={12} />
            <View style={{ marginLeft: 12 }}>
              <SkeletonLine width={50} height={11} style={{ marginBottom: 4 }} />
              <SkeletonLine width={140} height={14} />
            </View>
          </View>
        ))}
      </View>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <Skeleton width="100%" height={52} borderRadius={Radius.md} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Platform.OS === 'ios' ? 64 : 48,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  catRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    marginBottom: 10,
    ...Shadows.sm,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    paddingTop: Spacing.lg,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
});
