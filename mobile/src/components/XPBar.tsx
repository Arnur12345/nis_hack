import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface Props {
  xp: number;
  xpToNext: number;
  level: number;
}

export default function XPBar({ xp, xpToNext, level }: Props) {
  const progress = xpToNext > 0 ? xp / xpToNext : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.levelText}>Уровень {level}</Text>
        <Text style={styles.xpText}>{xp} / {xpToNext} XP</Text>
      </View>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${Math.min(progress * 100, 100)}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  levelText: { fontSize: 16, fontWeight: '700', color: Colors.text },
  xpText: { fontSize: 14, color: Colors.textSecondary },
  barBg: { height: 10, backgroundColor: Colors.xpBarBg, borderRadius: 5, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: Colors.xpBar, borderRadius: 5 },
});
