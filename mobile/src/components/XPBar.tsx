import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius } from '../constants/colors';

interface Props {
  xp: number;
  xpToNext: number;
  level: number;
}

export default function XPBar({ xp, xpToNext, level }: Props) {
  const progress = xpToNext > 0 ? Math.min(xp / xpToNext, 1) : 0;
  const pct = Math.round(progress * 100);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelNum}>{level}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.label}>Уровень {level}</Text>
          <Text style={styles.xpText}>{xp} / {xpToNext} XP</Text>
        </View>
        <Text style={styles.pct}>{pct}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.max(pct, 2)}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelNum: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF',
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  xpText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  pct: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.accent,
  },
  track: {
    height: 8,
    backgroundColor: Colors.xpBarBg,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.xpBar,
    borderRadius: 4,
  },
});
