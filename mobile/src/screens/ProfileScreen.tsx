import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from '../components/Icon';
import { useAuthStore } from '../store/authStore';
import { getStats, getAchievements } from '../api/gamification';
import StatBox from '../components/StatBox';
import AchievementBadge from '../components/AchievementBadge';
import { Achievement, StatsResponse } from '../types';
import { Colors, Spacing, Radius, Shadows } from '../constants/colors';

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
      setStats(statsRes.data); setEarned(achieveRes.data.earned); setAvailable(achieveRes.data.available);
    } catch { }
    setLoading(false);
  }, []);

  useFocusEffect(useCallback(() => { fetchData(); }, [fetchData]));

  return (
    <ScrollView
      style={styles.container} contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} tintColor={Colors.primary} />}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarLetter}>{user?.username?.charAt(0).toUpperCase() || '?'}</Text>
        </View>
        <Text style={styles.username}>{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {stats && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Статистика</Text>
          <View style={styles.statsGrid}>
            <StatBox label="Мероприятий" value={stats.events_completed} icon="" />
            <StatBox label="Всего XP" value={stats.total_xp} icon="" />
            <StatBox label="Уровень" value={stats.level} icon="" />
            <StatBox label="Серия" value={`${stats.streak_days} дн.`} icon="" />
          </View>
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Достижения</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{earned.length}/{earned.length + available.length}</Text>
          </View>
        </View>
        <View style={styles.achieveGrid}>
          {earned.map((a) => <AchievementBadge key={a.id} achievement={a} earned />)}
          {available.map((a) => <AchievementBadge key={a.id} achievement={a} earned={false} />)}
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.7}>
        <Icon name="logout" size={16} color={Colors.danger} />
        <Text style={styles.logoutText}>Выйти</Text>
      </TouchableOpacity>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingTop: Platform.OS === 'ios' ? 64 : 48 },
  profileHeader: { alignItems: 'center', paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl },
  avatar: {
    width: 72, height: 72, borderRadius: 24, backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md,
  },
  avatarLetter: { fontSize: 28, fontWeight: '700', color: '#FFF' },
  username: { fontSize: 22, fontWeight: '700', color: Colors.text, marginBottom: 2 },
  email: { fontSize: 14, color: Colors.textSecondary },
  section: { paddingHorizontal: Spacing.lg, marginTop: Spacing.lg },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: Spacing.md },
  countBadge: { backgroundColor: Colors.accentSurface, paddingHorizontal: 10, paddingVertical: 3, borderRadius: Radius.full, marginBottom: Spacing.md },
  countText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  achieveGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  logoutBtn: {
    marginHorizontal: Spacing.lg, marginTop: Spacing.xxxl, backgroundColor: Colors.card,
    borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, paddingVertical: 14,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
  },
  logoutText: { fontSize: 15, fontWeight: '600', color: Colors.danger },
});
