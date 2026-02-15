import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Platform, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon, { IconName } from '../components/Icon';
import { getImpact } from '../api/gamification';
import { ImpactResponse } from '../types';
import { Colors, CategoryColors, CategoryLabels, Radius, Shadows, Spacing } from '../constants/colors';
import { TouchableOpacity } from 'react-native';

const CAT_ICONS: Record<string, IconName> = {
  ecology: 'leaf',
  social: 'handshake-outline',
  animals: 'paw',
  education: 'book-open-variant',
};

export default function ImpactScreen({ navigation }: any) {
  const [data, setData] = useState<ImpactResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getImpact();
      setData(res.data);
    } catch {}
    setLoading(false);
  }, []);

  useFocusEffect(useCallback(() => { fetchData(); }, [fetchData]));

  if (loading && !data) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!data) return null;

  const maxCat = Math.max(...Object.values(data.category_breakdown), 1);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} tintColor={Colors.primary} />}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={20} color={Colors.text} />
        <Text style={styles.backLabel}>Назад</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Наш вклад</Text>
      <Text style={styles.sub}>Общий вклад сообщества</Text>

      {/* Hero stat cards */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: Colors.accentSurface }]}>
            <Icon name="account-group" size={22} color={Colors.primary} />
          </View>
          <Text style={styles.statNum}>{data.total_volunteers}</Text>
          <Text style={styles.statLabel}>Волонтёров</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#FFF8E1' }]}>
            <Icon name="check-circle" size={22} color="#F59E0B" />
          </View>
          <Text style={styles.statNum}>{data.total_events_completed}</Text>
          <Text style={styles.statLabel}>Выполнено</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#E8F4FD' }]}>
            <Icon name="star" size={22} color="#5AC8FA" />
          </View>
          <Text style={styles.statNum}>{data.total_xp_earned}</Text>
          <Text style={styles.statLabel}>XP</Text>
        </View>
      </View>

      {/* Category breakdown */}
      <Text style={styles.sectionTitle}>По категориям</Text>
      <View style={styles.categoryCard}>
        {Object.entries(data.category_breakdown).map(([cat, count]) => (
          <View key={cat} style={styles.catRow}>
            <View style={styles.catInfo}>
              <Icon name={CAT_ICONS[cat] || 'leaf'} size={16} color={CategoryColors[cat] || Colors.primary} />
              <Text style={styles.catLabel}>{CategoryLabels[cat] || cat}</Text>
              <Text style={styles.catCount}>{count}</Text>
            </View>
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: `${(count / maxCat) * 100}%`, backgroundColor: CategoryColors[cat] || Colors.primary }]} />
            </View>
          </View>
        ))}
        {Object.keys(data.category_breakdown).length === 0 && (
          <Text style={styles.emptyText}>Пока нет данных</Text>
        )}
      </View>

      {/* Recent activity */}
      <Text style={styles.sectionTitle}>Недавняя активность</Text>
      <View style={styles.activityCard}>
        {data.recent_completions.map((item, i) => (
          <View key={i} style={[styles.activityRow, i < data.recent_completions.length - 1 && styles.activityBorder]}>
            <View style={[styles.activityDot, { backgroundColor: CategoryColors[item.category] || Colors.primary }]} />
            <View style={styles.activityInfo}>
              <Text style={styles.activityUser}>@{item.username}</Text>
              <Text style={styles.activityEvent}>{item.event_title}</Text>
              {item.completed_at && (
                <Text style={styles.activityTime}>
                  {new Date(item.completed_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </Text>
              )}
            </View>
          </View>
        ))}
        {data.recent_completions.length === 0 && (
          <Text style={styles.emptyText}>Пока нет активности</Text>
        )}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Spacing.xl, paddingTop: Platform.OS === 'ios' ? 64 : 48 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.lg },
  backLabel: { fontSize: 15, fontWeight: '600', color: Colors.text },
  header: { fontSize: 24, fontWeight: '700', color: Colors.text, letterSpacing: -0.3 },
  sub: { fontSize: 14, color: Colors.textSecondary, marginTop: 2, marginBottom: Spacing.xxl },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1, backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.lg,
    alignItems: 'center', ...Shadows.sm,
  },
  statIcon: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statNum: { fontSize: 22, fontWeight: '700', color: Colors.text },
  statLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginTop: Spacing.xxl, marginBottom: Spacing.md },
  categoryCard: { backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.lg, gap: 14, ...Shadows.sm },
  catRow: { gap: 6 },
  catInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  catLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: Colors.text },
  catCount: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
  barBg: { height: 6, backgroundColor: Colors.xpBarBg, borderRadius: 3 },
  barFill: { height: 6, borderRadius: 3 },
  activityCard: { backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.lg, ...Shadows.sm },
  activityRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 10 },
  activityBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  activityDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  activityInfo: { flex: 1 },
  activityUser: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  activityEvent: { fontSize: 14, fontWeight: '500', color: Colors.text, marginTop: 2 },
  activityTime: { fontSize: 12, color: Colors.textLight, marginTop: 2 },
  emptyText: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', paddingVertical: 12 },
});
