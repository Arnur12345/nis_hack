import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from './Icon';
import { LeaderboardEntry } from '../types';
import { Colors, Radius, Shadows, Spacing } from '../constants/colors';

interface Props {
  entry: LeaderboardEntry;
}

const RANK_COLORS = ['#B45309', '#6B7280', '#92400E'];

export default function LeaderboardRow({ entry }: Props) {
  const isTop3 = entry.rank <= 3;

  return (
    <View style={[styles.row, isTop3 && styles.topRow]}>
      <View style={[styles.rankBox, isTop3 && { backgroundColor: RANK_COLORS[entry.rank - 1] + '10' }]}>
        {isTop3 ? (
          <Icon
            name={entry.rank === 1 ? 'crown-outline' : entry.rank === 2 ? 'medal-outline' : 'shield-star-outline'}
            size={16}
            color={RANK_COLORS[entry.rank - 1]}
          />
        ) : (
          <Text style={styles.rankNum}>#{entry.rank}</Text>
        )}
      </View>

      <View style={styles.petBox}>
        <Icon name={entry.pet_evolution_stage >= 4 ? 'bird' : 'egg-outline'} size={18} color={Colors.primary} />
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{entry.username}</Text>
        <Text style={styles.petName}>{entry.pet_name}</Text>
      </View>

      <View style={styles.stats}>
        <Text style={styles.level}>Ур. {entry.level}</Text>
        <Text style={styles.xp}>{entry.xp} XP</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card,
    borderRadius: Radius.md, padding: Spacing.lg, marginHorizontal: Spacing.lg, marginVertical: 3, ...Shadows.sm,
  },
  topRow: { borderWidth: 1, borderColor: Colors.accentSurface },
  rankBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.borderLight, justifyContent: 'center', alignItems: 'center' },
  rankNum: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary },
  petBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.accentSurface, justifyContent: 'center', alignItems: 'center', marginLeft: Spacing.sm },
  info: { flex: 1, marginLeft: Spacing.md },
  name: { fontSize: 15, fontWeight: '600', color: Colors.text },
  petName: { fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  stats: { alignItems: 'flex-end' },
  level: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  xp: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
});
