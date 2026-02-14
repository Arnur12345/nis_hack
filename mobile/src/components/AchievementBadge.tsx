import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from './Icon';
import { Achievement } from '../types';
import { Colors, Radius, Shadows, Spacing } from '../constants/colors';

interface Props {
  achievement: Achievement;
  earned: boolean;
}

export default function AchievementBadge({ achievement, earned }: Props) {
  return (
    <View style={[styles.badge, earned ? styles.earnedBadge : styles.lockedBadge]}>
      <View style={[styles.iconCircle, earned ? styles.earnedCircle : styles.lockedCircle]}>
        <Icon name={earned ? 'shield-star-outline' : 'lock-outline'} size={earned ? 20 : 16} color={earned ? Colors.primary : Colors.textLight} />
      </View>
      <Text style={[styles.title, !earned && styles.lockedText]} numberOfLines={2}>
        {achievement.title}
      </Text>
      {earned && <Text style={styles.bonus}>+{achievement.xp_bonus} XP</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { width: '30%', alignItems: 'center', backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, margin: '1.5%' },
  earnedBadge: { borderWidth: 1, borderColor: Colors.accentSurface, ...Shadows.sm },
  lockedBadge: { opacity: 0.45, borderWidth: 1, borderColor: Colors.border },
  iconCircle: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.xs },
  earnedCircle: { backgroundColor: Colors.accentSurface },
  lockedCircle: { backgroundColor: Colors.borderLight },
  title: { fontSize: 11, fontWeight: '600', color: Colors.text, textAlign: 'center', lineHeight: 14 },
  lockedText: { color: Colors.textLight },
  bonus: { fontSize: 10, fontWeight: '700', color: Colors.primary, marginTop: 3 },
});
