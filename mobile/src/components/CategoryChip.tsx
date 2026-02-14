import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, CategoryIcons, CategoryLabels } from '../constants/colors';

interface Props {
  category: string;
  selected: boolean;
  onPress: () => void;
}

export default function CategoryChip({ category, selected, onPress }: Props) {
  const color = Colors[category as keyof typeof Colors] || Colors.primary;

  return (
    <TouchableOpacity
      style={[styles.chip, selected && { backgroundColor: color, borderColor: color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, selected && styles.textSelected]}>
        {CategoryIcons[category]} {CategoryLabels[category]}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginRight: 8,
    backgroundColor: Colors.card,
  },
  text: { fontSize: 13, fontWeight: '600', color: Colors.text },
  textSelected: { color: '#FFF' },
});
