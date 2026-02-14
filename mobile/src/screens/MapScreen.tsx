import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';
import Icon, { IconName } from '../components/Icon';
import { getEvents } from '../api/events';
import { Event } from '../types';
import { Colors, CategoryColors, CategoryLabels, Radius, Shadows, Spacing } from '../constants/colors';

const { width, height } = Dimensions.get('window');
const ALMATY = { latitude: 43.238, longitude: 76.945, latitudeDelta: 0.08, longitudeDelta: 0.08 };

const MARKER_COLORS: Record<string, string> = {
  ecology: Colors.ecology, social: Colors.social, animals: Colors.animals, education: Colors.education,
};

const CAT_ICONS: Record<string, IconName> = {
  ecology: 'leaf', social: 'handshake-outline', animals: 'paw', education: 'book-open-variant',
};

export default function MapScreen({ navigation }: any) {
  const [events, setEvents] = useState<Event[]>([]);
  const [selected, setSelected] = useState<Event | null>(null);
  const mapRef = useRef<MapView>(null);

  useFocusEffect(useCallback(() => {
    (async () => { try { const { data } = await getEvents(); setEvents(data.events); } catch { } })();
  }, []));

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} initialRegion={ALMATY} provider={PROVIDER_DEFAULT}>
        {events.map((event) => (
          <Marker
            key={event.id}
            coordinate={{ latitude: event.latitude, longitude: event.longitude }}
            pinColor={MARKER_COLORS[event.category] || Colors.primary}
            onPress={() => setSelected(event)}
          />
        ))}
      </MapView>

      <View style={styles.floatingHeader}>
        <Icon name="map-marker-outline" size={16} color={Colors.primary} />
        <Text style={styles.headerTitle}>Карта событий</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{events.length}</Text>
        </View>
      </View>

      {selected && (
        <TouchableOpacity
          style={styles.card} activeOpacity={0.9}
          onPress={() => navigation.navigate('Events', { screen: 'EventDetail', params: { eventId: selected.id } })}
        >
          <View style={styles.cardTop}>
            <View style={[styles.catBadge, { backgroundColor: (MARKER_COLORS[selected.category] || Colors.primary) + '12' }]}>
              <Icon name={CAT_ICONS[selected.category] || 'leaf'} size={12} color={MARKER_COLORS[selected.category] || Colors.primary} />
              <Text style={[styles.catText, { color: MARKER_COLORS[selected.category] }]}>{CategoryLabels[selected.category]}</Text>
            </View>
            <Text style={styles.xp}>+{selected.xp_reward} XP</Text>
          </View>
          <Text style={styles.cardTitle} numberOfLines={1}>{selected.title}</Text>
          <View style={styles.cardMeta}>
            <Icon name="map-marker-outline" size={12} color={Colors.textLight} />
            <Text style={styles.cardAddress} numberOfLines={1}>{selected.address}</Text>
          </View>
          <View style={styles.cardFooter}>
            <View style={styles.metaItem}>
              <Icon name="clock-outline" size={12} color={Colors.textLight} />
              <Text style={styles.metaText}>
                {new Date(selected.start_time).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            <View style={styles.arrowBtn}>
              <Icon name="chevron-right" size={14} color="#FFF" />
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width, height },
  floatingHeader: {
    position: 'absolute', top: Platform.OS === 'ios' ? 60 : 44,
    left: Spacing.lg, right: Spacing.lg,
    backgroundColor: Colors.card, borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    flexDirection: 'row', alignItems: 'center', gap: 8, ...Shadows.md,
  },
  headerTitle: { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.text },
  countBadge: { backgroundColor: Colors.accentSurface, paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full },
  countText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  card: {
    position: 'absolute', bottom: 100, left: Spacing.lg, right: Spacing.lg,
    backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.lg, ...Shadows.lg,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  catBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.sm },
  catText: { fontSize: 12, fontWeight: '600' },
  xp: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  cardTitle: { fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: 6 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: Spacing.md },
  cardAddress: { fontSize: 13, color: Colors.textSecondary, flex: 1 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: Colors.textSecondary },
  arrowBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
});
