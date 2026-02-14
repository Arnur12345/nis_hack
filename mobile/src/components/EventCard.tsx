import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon, { IconName } from './Icon';
import { Event } from '../types';
import { Colors, CategoryColors, CategoryLabels, Radius, Shadows, Spacing } from '../constants/colors';

const CAT_ICONS: Record<string, IconName> = {
  ecology: 'leaf',
  social: 'handshake-outline',
  animals: 'paw',
  education: 'book-open-variant',
};

interface Props {
  event: Event;
  onPress: () => void;
}

export default function EventCard({ event, onPress }: Props) {
  const catColor = CategoryColors[event.category] || Colors.primary;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.top}>
        <View style={[styles.catBadge, { backgroundColor: catColor + '12' }]}>
          <Icon name={CAT_ICONS[event.category] || 'leaf'} size={12} color={catColor} />
          <Text style={[styles.catText, { color: catColor }]}>{CategoryLabels[event.category]}</Text>
        </View>
        <View style={styles.xpBadge}>
          <Text style={styles.xpText}>+{event.xp_reward} XP</Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>{event.title}</Text>

      <View style={styles.row}>
        <Icon name="map-marker-outline" size={13} color={Colors.textLight} />
        <Text style={styles.meta} numberOfLines={1}>{event.address}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Icon name="account-group-outline" size={12} color={Colors.textLight} />
          <Text style={styles.footerText}>
            {event.participants_count || 0}{event.max_participants ? `/${event.max_participants}` : ''}
          </Text>
        </View>
        <View style={styles.footerItem}>
          <Icon name="clock-outline" size={12} color={Colors.textLight} />
          <Text style={styles.footerText}>
            {new Date(event.start_time).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        <View style={styles.arrow}>
          <Icon name="chevron-right" size={14} color={Colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.lg, marginHorizontal: Spacing.lg, marginVertical: 5, ...Shadows.sm },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  catBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.sm },
  catText: { fontSize: 12, fontWeight: '600' },
  xpBadge: { backgroundColor: Colors.accentSurface, paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.sm },
  xpText: { fontSize: 11, fontWeight: '700', color: Colors.primary },
  title: { fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: Spacing.sm, lineHeight: 22 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: Spacing.md },
  meta: { fontSize: 13, color: Colors.textSecondary, flex: 1 },
  footer: { flexDirection: 'row', alignItems: 'center', paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: 4, marginRight: Spacing.lg },
  footerText: { fontSize: 12, color: Colors.textSecondary },
  arrow: { marginLeft: 'auto', width: 28, height: 28, borderRadius: 8, backgroundColor: Colors.accentSurface, justifyContent: 'center', alignItems: 'center' },
});
