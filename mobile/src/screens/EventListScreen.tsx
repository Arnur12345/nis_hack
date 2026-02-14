import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, RefreshControl, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from '../components/Icon';
import { getEvents } from '../api/events';
import EventCard from '../components/EventCard';
import CategoryChip from '../components/CategoryChip';
import { Event } from '../types';
import { CATEGORIES } from '../constants/categories';
import { Colors, Spacing } from '../constants/colors';

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

  useFocusEffect(useCallback(() => { fetchData(); }, [fetchData]));

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.header}>Мероприятия</Text>
        <Text style={styles.sub}>Найди возможность помочь</Text>
      </View>
      <View style={styles.chipsWrap}>
        <FlatList
          horizontal showsHorizontalScrollIndicator={false}
          data={['all', ...CATEGORIES]}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.chips}
          renderItem={({ item }) => (
            <CategoryChip
              category={item}
              selected={item === 'all' ? selectedCategory === null : selectedCategory === item}
              onPress={() => setSelectedCategory(item === 'all' ? null : (selectedCategory === item ? null : item))}
            />
          )}
        />
      </View>
      <FlatList
        data={events} keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventCard event={item} onPress={() => navigation.navigate('EventDetail', { eventId: item.id })} />}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} tintColor={Colors.primary} />}
        contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="magnify" size={32} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>Нет мероприятий</Text>
            <Text style={styles.emptySub}>Попробуй сменить категорию</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  headerSection: { paddingTop: Platform.OS === 'ios' ? 64 : 48, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md },
  header: { fontSize: 26, fontWeight: '700', color: Colors.text, letterSpacing: -0.3 },
  sub: { fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
  chipsWrap: { marginBottom: Spacing.sm },
  chips: { paddingHorizontal: Spacing.lg },
  list: { paddingBottom: 100 },
  empty: { alignItems: 'center', marginTop: 60, gap: 8 },
  emptyTitle: { fontSize: 17, fontWeight: '600', color: Colors.text },
  emptySub: { fontSize: 14, color: Colors.textSecondary },
});
