import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';
import { getEvents } from '../api/events';
import { Event } from '../types';
import { Colors, CategoryIcons, CategoryLabels } from '../constants/colors';

const ALMATY = { latitude: 43.238, longitude: 76.945, latitudeDelta: 0.08, longitudeDelta: 0.08 };

const MARKER_COLORS: Record<string, string> = {
  ecology: '#00B894',
  social: '#E17055',
  animals: '#FDCB6E',
  education: '#74B9FF',
};

export default function MapScreen({ navigation }: any) {
  const [events, setEvents] = useState<Event[]>([]);
  const [selected, setSelected] = useState<Event | null>(null);
  const mapRef = useRef<MapView>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const { data } = await getEvents();
          setEvents(data.events);
        } catch { }
      })();
    }, [])
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={ALMATY}
        provider={PROVIDER_DEFAULT}
      >
        {events.map((event) => (
          <Marker
            key={event.id}
            coordinate={{ latitude: event.latitude, longitude: event.longitude }}
            pinColor={MARKER_COLORS[event.category] || Colors.primary}
            onPress={() => setSelected(event)}
          />
        ))}
      </MapView>

      {selected && (
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Events', {
            screen: 'EventDetail',
            params: { eventId: selected.id },
          })}
        >
          <View style={[styles.dot, { backgroundColor: MARKER_COLORS[selected.category] }]} />
          <View style={styles.cardContent}>
            <Text style={styles.cardCategory}>
              {CategoryIcons[selected.category]} {CategoryLabels[selected.category]}
            </Text>
            <Text style={styles.cardTitle}>{selected.title}</Text>
            <Text style={styles.cardAddress} numberOfLines={1}>📍 {selected.address}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.cardXP}>+{selected.xp_reward} XP</Text>
              <Text style={styles.cardArrow}>Подробнее →</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
  card: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 6, marginRight: 12 },
  cardContent: { flex: 1 },
  cardCategory: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  cardAddress: { fontSize: 13, color: Colors.textSecondary, marginBottom: 8 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  cardXP: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  cardArrow: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
});
