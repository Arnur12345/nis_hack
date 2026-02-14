import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon, { IconName } from './Icon';
import { Colors, Radius, Shadows, Spacing } from '../constants/colors';

const STAT_ICONS: Record<string, IconName> = {
  'Мероприятий': 'crosshairs-gps',
  'Всего XP': 'lightning-bolt',
  'Уровень': 'chart-bar',
  'Серия': 'fire',
};

interface Props {
  label: string;
  value: string | number;
  icon: string;
}

export default function StatBox({ label, value }: Props) {
  return (
    <View style={styles.box}>
      <View style={styles.iconBox}>
        <Icon name={STAT_ICONS[label] || 'lightning-bolt'} size={18} color={Colors.primary} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: '46%', backgroundColor: Colors.card, borderRadius: Radius.lg,
    padding: Spacing.lg, alignItems: 'center', margin: '2%', ...Shadows.sm,
  },
  iconBox: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.accentSurface,
    justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.sm,
  },
  value: { fontSize: 22, fontWeight: '700', color: Colors.text, marginBottom: 2 },
  label: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
});
