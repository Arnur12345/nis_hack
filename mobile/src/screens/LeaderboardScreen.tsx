import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getLeaderboard } from '../api/gamification';
import LeaderboardRow from '../components/LeaderboardRow';
import { LeaderboardEntry } from '../types';
import { Colors } from '../constants/colors';

export default function LeaderboardScreen() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getLeaderboard();
      setEntries(data.leaderboard);
    } catch { }
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🏆 Рейтинг</Text>
      <FlatList
        data={entries}
        keyExtractor={(item) => `${item.rank}`}
        renderItem={({ item }) => <LeaderboardRow entry={item} />}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Пока нет участников</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 60 },
  header: { fontSize: 24, fontWeight: '800', color: Colors.text, paddingHorizontal: 16, marginBottom: 12 },
  list: { paddingBottom: 20 },
  empty: { textAlign: 'center', color: Colors.textSecondary, marginTop: 40, fontSize: 16 },
});
