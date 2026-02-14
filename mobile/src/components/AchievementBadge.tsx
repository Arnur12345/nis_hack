import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Achievement } from '../types';
import { Colors } from '../constants/colors';

interface Props {
  achievement: Achievement;
  earned: boolean;
}

export default function AchievementBadge({ achievement, earned }: Props) {
  return (
    <View style={[styles.badge, !earned && styles.locked]}>
      <Text style={styles.icon}>{achievement.icon}</Text>
      <Text style={[styles.title, !earned && styles.lockedText]} numberOfLines={1}>
        {achievement.title}
      </Text>
      {earned && <Text style={styles.bonus}>+{achievement.xp_bonus} XP</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: '30%',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    margin: '1.5%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  locked: { opacity: 0.4 },
  icon: { fontSize: 32, marginBottom: 4 },
  title: { fontSize: 11, fontWeight: '600', color: Colors.text, textAlign: 'center' },
  lockedText: { color: Colors.textLight },
  bonus: { fontSize: 10, color: Colors.primary, marginTop: 2 },
});
