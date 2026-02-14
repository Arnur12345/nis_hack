import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Skeleton, { SkeletonLine, SkeletonCircle } from '../Skeleton';
import { Colors, Radius, Shadows, Spacing } from '../../constants/colors';

export default function ProfileScreenSkeleton() {
  return (
    <View style={styles.container}>
      {/* Profile header */}
      <View style={styles.profileHeader}>
        <Skeleton width={72} height={72} borderRadius={24} style={{ marginBottom: Spacing.md }} />
        <SkeletonLine width={120} height={22} style={{ marginBottom: 4 }} />
        <SkeletonLine width={170} height={14} />
      </View>

      {/* Stats section */}
      <View style={styles.section}>
        <SkeletonLine width={110} height={18} style={{ marginBottom: Spacing.md }} />
        <View style={styles.statsGrid}>
          {[...Array(4)].map((_, i) => (
            <View key={i} style={styles.statBox}>
              <Skeleton width={40} height={40} borderRadius={12} style={{ marginBottom: Spacing.sm }} />
              <SkeletonLine width={50} height={22} style={{ marginBottom: 4 }} />
              <SkeletonLine width={70} height={12} />
            </View>
          ))}
        </View>
      </View>

      {/* Achievements section */}
      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <SkeletonLine width={120} height={18} />
          <Skeleton width={45} height={22} borderRadius={Radius.full} />
        </View>
        <View style={styles.achieveGrid}>
          {[...Array(6)].map((_, i) => (
            <View key={i} style={styles.achieveBadge}>
              <Skeleton width={40} height={40} borderRadius={12} style={{ marginBottom: Spacing.xs }} />
              <SkeletonLine width={50} height={11} style={{ marginBottom: 3 }} />
              <SkeletonLine width={40} height={10} />
            </View>
          ))}
        </View>
      </View>

      {/* Logout button */}
      <Skeleton
        width="100%"
        height={48}
        borderRadius={Radius.md}
        style={{ marginHorizontal: Spacing.lg, marginTop: Spacing.xxxl, alignSelf: 'center' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'ios' ? 64 : 48,
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statBox: {
    width: '46%',
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    margin: '2%',
    ...Shadows.sm,
  },
  achieveGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  achieveBadge: {
    width: '30%',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    margin: '1.5%',
    ...Shadows.sm,
  },
});
