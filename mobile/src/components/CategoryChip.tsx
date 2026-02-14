import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon, { IconName } from './Icon';
import { Colors, CategoryLabels, Radius } from '../constants/colors';

const CAT_ICONS: Record<string, IconName> = {
  all: 'format-list-bulleted',
  ecology: 'leaf',
  social: 'handshake-outline',
  animals: 'paw',
  education: 'book-open-variant',
};

interface Props {
  category: string;
  selected: boolean;
  onPress: () => void;
}

export default function CategoryChip({ category, selected, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Icon name={CAT_ICONS[category] || 'format-list-bulleted'} size={14} color={selected ? '#FFF' : Colors.textSecondary} />
      <Text style={[styles.text, selected && styles.textActive]}>{CategoryLabels[category]}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full,
    borderWidth: 1, borderColor: Colors.border, marginRight: 8, marginBottom: 8, backgroundColor: Colors.card,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  text: { fontSize: 13, fontWeight: '600', color: Colors.text },
  textActive: { color: '#FFF' },
});
