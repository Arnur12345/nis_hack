import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, RefreshControl, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from '../components/Icon';
import { getLeaderboard } from '../api/gamification';
import LeaderboardRow from '../components/LeaderboardRow';
import { LeaderboardEntry } from '../types';
import { Colors, Spacing, Radius } from '../constants/colors';

export default function LeaderboardScreen() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const { data } = await getLeaderboard(); setEntries(data.leaderboard); } catch { }
    setLoading(false);
  }, []);

  useFocusEffect(useCallback(() => { fetchData(); }, [fetchData]));

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <View>
          <Text style={styles.header}>Рейтинг</Text>
          <Text style={styles.sub}>Лучшие волонтёры города</Text>
        </View>
        <View style={styles.trophyBox}>
          <Icon name="trophy-outline" size={20} color={Colors.primary} />
        </View>
      </View>
      <FlatList
        data={entries} keyExtractor={(item) => `${item.rank}`}
        renderItem={({ item }) => <LeaderboardRow entry={item} />}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} tintColor={Colors.primary} />}
        contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="trophy-outline" size={32} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>Пока нет участников</Text>
            <Text style={styles.emptySub}>Будь первым!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  headerSection: {
    paddingTop: Platform.OS === 'ios' ? 64 : 48, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
  },
  header: { fontSize: 26, fontWeight: '700', color: Colors.text, letterSpacing: -0.3 },
  sub: { fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
  trophyBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.accentSurface, justifyContent: 'center', alignItems: 'center' },
  list: { paddingBottom: 100 },
  empty: { alignItems: 'center', marginTop: 60, gap: 8 },
  emptyTitle: { fontSize: 17, fontWeight: '600', color: Colors.text },
  emptySub: { fontSize: 14, color: Colors.textSecondary },
});
