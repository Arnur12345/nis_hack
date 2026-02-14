import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getEvents } from '../api/events';
import EventCard from '../components/EventCard';
import CategoryChip from '../components/CategoryChip';
import { Event } from '../types';
import { CATEGORIES } from '../constants/categories';
import { Colors } from '../constants/colors';

export default function EventListScreen({ navigation }: any) {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getEvents(selectedCategory || undefined);
      setEvents(data.events);
    } catch { }
    setLoading(false);
  }, [selectedCategory]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Мероприятия</Text>
      <View style={styles.chips}>
        <CategoryChip
          category="all"
          selected={selectedCategory === null}
          onPress={() => setSelectedCategory(null)}
        />
        {CATEGORIES.map((cat) => (
          <CategoryChip
            key={cat}
            category={cat}
            selected={selectedCategory === cat}
            onPress={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
          />
        ))}
      </View>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard event={item} onPress={() => navigation.navigate('EventDetail', { eventId: item.id })} />
        )}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Нет мероприятий</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 60 },
  header: { fontSize: 24, fontWeight: '800', color: Colors.text, paddingHorizontal: 16, marginBottom: 12 },
  chips: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 8, flexWrap: 'wrap' },
  list: { paddingBottom: 20 },
  empty: { textAlign: 'center', color: Colors.textSecondary, marginTop: 40, fontSize: 16 },
});
