import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Event } from '../types';
import { Colors, CategoryIcons, CategoryLabels } from '../constants/colors';

interface Props {
  event: Event;
  onPress: () => void;
}

export default function EventCard({ event, onPress }: Props) {
  const categoryColor = Colors[event.category as keyof typeof Colors] || Colors.primary;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
        <Text style={styles.categoryText}>
          {CategoryIcons[event.category]} {CategoryLabels[event.category]}
        </Text>
      </View>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.address} numberOfLines={1}>📍 {event.address}</Text>
      <View style={styles.footer}>
        <Text style={styles.xp}>+{event.xp_reward} XP</Text>
        <Text style={styles.participants}>
          👥 {event.participants_count || 0}{event.max_participants ? `/${event.max_participants}` : ''}
        </Text>
        <Text style={styles.time}>
          🕐 {new Date(event.start_time).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginBottom: 8 },
  categoryText: { fontSize: 12, fontWeight: '600' },
  title: { fontSize: 17, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  address: { fontSize: 13, color: Colors.textSecondary, marginBottom: 10 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  xp: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  participants: { fontSize: 13, color: Colors.textSecondary },
  time: { fontSize: 12, color: Colors.textSecondary },
});
