import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon, { IconName } from '../components/Icon';
import { useAuthStore } from '../store/authStore';
import { usePetStore } from '../store/petStore';
import PetDisplay from '../components/PetDisplay';
import XPBar from '../components/XPBar';
import ActivityChart from '../components/ActivityChart';
import { getActivity } from '../api/gamification';
import { ActivityResponse } from '../types';
import { Colors, Radius, Shadows, Spacing } from '../constants/colors';

const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function getDefaultActivity(): ActivityResponse {
  const today = new Date();
  const weekly_activity = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    weekly_activity.push({
      day: DAY_NAMES[d.getDay() === 0 ? 6 : d.getDay() - 1],
      date: d.toISOString().split('T')[0],
      count: 0,
      xp: 0,
    });
  }
  return { weekly_activity, this_week_events: 0, this_week_xp: 0, category_breakdown: {} };
}

export default function HomeScreen({ navigation }: any) {
  const authPet = useAuthStore((s) => s.pet);
  const user = useAuthStore((s) => s.user);
  const { pet: storePet, fetchPet, isLoading } = usePetStore();
  const pet = storePet || authPet;
  const [activity, setActivity] = useState<ActivityResponse>(getDefaultActivity());

  const fetchAll = useCallback(async () => {
    fetchPet();
    try {
      const res = await getActivity();
      setActivity(res.data);
    } catch {
      // API failed — keep default empty activity so section still renders
    }
  }, []);

  useFocusEffect(useCallback(() => { fetchAll(); }, [fetchAll]));

  if (!pet) return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={{ fontSize: 15, color: Colors.textSecondary }}>Загрузка...</Text>
    </View>
  );

  const actions: { icon: IconName; label: string; sub: string; tab: string }[] = [
    { icon: 'calendar-month-outline', label: 'Мероприятия', sub: 'Найти и помочь', tab: 'Events' },
    { icon: 'map-outline', label: 'Карта', sub: 'События рядом', tab: 'Map' },
    { icon: 'trophy-outline', label: 'Рейтинг', sub: 'Лучшие', tab: 'Leaderboard' },
    { icon: 'account-outline', label: 'Профиль', sub: 'Достижения', tab: 'Profile' },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchAll} tintColor={Colors.primary} />}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Привет, {user?.username || 'Волонтёр'}</Text>
        <Text style={styles.sub}>Твой питомец ждёт приключений</Text>
      </View>

      <View style={styles.petCard}>
        <PetDisplay pet={pet} />
        <XPBar xp={pet.xp} xpToNext={pet.xp_to_next_level} level={pet.level} />
      </View>

      <View style={styles.streakCard}>
        <View style={styles.streakIcon}>
          <Icon name="fire" size={18} color={Colors.primary} />
        </View>
        <View>
          <Text style={styles.streakNum}>{pet.streak_days} {pet.streak_days === 1 ? 'день' : 'дней'}</Text>
          <Text style={styles.streakLabel}>Серия подряд</Text>
        </View>
      </View>

      {/* Activity Statistics */}
      <Text style={styles.sectionTitle}>Моя активность</Text>
      <ActivityChart data={activity} />

      <Text style={styles.sectionTitle}>Быстрые действия</Text>
      <View style={styles.actions}>
        {actions.map((item, i) => (
          <TouchableOpacity key={i} style={styles.actionCard} onPress={() => navigation.navigate(item.tab)} activeOpacity={0.7}>
            <View style={styles.actionIcon}>
              <Icon name={item.icon} size={20} color={Colors.primary} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionLabel}>{item.label}</Text>
              <Text style={styles.actionSub}>{item.sub}</Text>
            </View>
            <Icon name="chevron-right" size={16} color={Colors.textLight} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingTop: Platform.OS === 'ios' ? 64 : 48, paddingHorizontal: Spacing.lg },
  header: { marginBottom: Spacing.xl },
  greeting: { fontSize: 24, fontWeight: '700', color: Colors.text, letterSpacing: -0.3 },
  sub: { fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
  petCard: { backgroundColor: Colors.card, borderRadius: Radius.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.xxl, ...Shadows.md },
  streakCard: {
    backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.lg,
    marginTop: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: 12, ...Shadows.sm,
  },
  streakIcon: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.accentSurface,
    justifyContent: 'center', alignItems: 'center',
  },
  streakNum: { fontSize: 16, fontWeight: '700', color: Colors.text },
  streakLabel: { fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginTop: Spacing.xxl, marginBottom: Spacing.md },
  actions: { gap: 8 },
  actionCard: {
    backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.lg,
    flexDirection: 'row', alignItems: 'center', ...Shadows.sm,
  },
  actionIcon: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.accentSurface,
    justifyContent: 'center', alignItems: 'center',
  },
  actionInfo: { flex: 1, marginLeft: 12 },
  actionLabel: { fontSize: 15, fontWeight: '600', color: Colors.text },
  actionSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
});
