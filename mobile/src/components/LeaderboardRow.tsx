import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LeaderboardEntry } from '../types';
import { PetEmojis } from '../constants/petAssets';
import { Colors } from '../constants/colors';

interface Props {
  entry: LeaderboardEntry;
}

const RANK_MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardRow({ entry }: Props) {
  return (
    <View style={[styles.row, entry.rank <= 3 && styles.topRow]}>
      <Text style={styles.rank}>
        {entry.rank <= 3 ? RANK_MEDALS[entry.rank - 1] : `#${entry.rank}`}
      </Text>
      <Text style={styles.petEmoji}>{PetEmojis[entry.pet_evolution_stage]}</Text>
      <View style={styles.info}>
        <Text style={styles.username}>{entry.username}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 4,
  },
  topRow: {
    borderWidth: 1.5,
    borderColor: Colors.primary + '30',
  },
  rank: { fontSize: 18, fontWeight: '700', width: 40, textAlign: 'center' },
  petEmoji: { fontSize: 28, marginRight: 10 },
  info: { flex: 1 },
  username: { fontSize: 16, fontWeight: '700', color: Colors.text },
  petName: { fontSize: 12, color: Colors.textSecondary },
  stats: { alignItems: 'flex-end' },
  level: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  xp: { fontSize: 12, color: Colors.textSecondary },
});
