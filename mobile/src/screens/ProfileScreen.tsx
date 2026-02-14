import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import { getStats, getAchievements } from '../api/gamification';
import StatBox from '../components/StatBox';
import AchievementBadge from '../components/AchievementBadge';
import { Achievement, StatsResponse } from '../types';
import { Colors } from '../constants/colors';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [earned, setEarned] = useState<Achievement[]>([]);
  const [available, setAvailable] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, achieveRes] = await Promise.all([getStats(), getAchievements()]);
      setStats(statsRes.data);
      setEarned(achieveRes.data.earned);
      setAvailable(achieveRes.data.available);
    } catch { }
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
    >
      <Text style={styles.header}>👤 Профиль</Text>
      <Text style={styles.username}>{user?.username}</Text>
      <Text style={styles.email}>{user?.email}</Text>

      {stats && (
        <View style={styles.statsGrid}>
          <StatBox label="Мероприятий" value={stats.events_completed} icon="🎯" />
          <StatBox label="Всего XP" value={stats.total_xp} icon="⚡" />
          <StatBox label="Уровень" value={stats.level} icon="📊" />
          <StatBox label="Серия" value={`${stats.streak_days} дн.`} icon="🔥" />
        </View>
      )}

      <Text style={styles.sectionTitle}>Достижения</Text>
      <View style={styles.achievementsGrid}>
        {earned.map((a) => <AchievementBadge key={a.id} achievement={a} earned />)}
        {available.map((a) => <AchievementBadge key={a.id} achievement={a} earned={false} />)}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Выйти</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingTop: 60, paddingBottom: 40 },
  header: { fontSize: 24, fontWeight: '800', color: Colors.text, paddingHorizontal: 16, marginBottom: 4 },
  username: { fontSize: 20, fontWeight: '700', color: Colors.text, paddingHorizontal: 16 },
  email: { fontSize: 14, color: Colors.textSecondary, paddingHorizontal: 16, marginBottom: 20 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, paddingHorizontal: 16, marginTop: 24, marginBottom: 12 },
  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8 },
  logoutBtn: {
    marginHorizontal: 16,
    marginTop: 30,
    backgroundColor: Colors.danger,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
});
