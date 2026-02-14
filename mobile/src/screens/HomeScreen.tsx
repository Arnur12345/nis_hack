import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon, { IconName } from '../components/Icon';
import { useAuthStore } from '../store/authStore';
import { usePetStore } from '../store/petStore';
import PetDisplay from '../components/PetDisplay';
import XPBar from '../components/XPBar';
import { Colors, Radius, Shadows, Spacing } from '../constants/colors';

export default function HomeScreen({ navigation }: any) {
  const authPet = useAuthStore((s) => s.pet);
  const user = useAuthStore((s) => s.user);
  const { pet: storePet, fetchPet, isLoading } = usePetStore();
  const pet = storePet || authPet;

  useFocusEffect(useCallback(() => { fetchPet(); }, []));

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
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchPet} tintColor={Colors.primary} />}
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
