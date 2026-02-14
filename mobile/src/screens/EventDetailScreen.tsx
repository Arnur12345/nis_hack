import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import Icon, { IconName } from '../components/Icon';
import { getEventDetail, joinEvent, completeEvent } from '../api/events';
import { usePetStore } from '../store/petStore';
import { useAuthStore } from '../store/authStore';
import EventDetailSkeleton from '../components/skeletons/EventDetailSkeleton';
import { Event } from '../types';
import { Colors, CategoryColors, CategoryLabels, Radius, Shadows, Spacing } from '../constants/colors';

const CAT_ICONS: Record<string, IconName> = {
  ecology: 'leaf',
  social: 'handshake-outline',
  animals: 'paw',
  education: 'book-open-variant',
};

export default function EventDetailScreen({ route, navigation }: any) {
  const { eventId } = route.params;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const setPet = usePetStore((s) => s.setPet);
  const setAuthPet = useAuthStore((s) => s.setPet);

  useEffect(() => { loadEvent(); }, []);

  const loadEvent = async () => {
    try { const { data } = await getEventDetail(eventId); setEvent(data); }
    catch { Alert.alert('Ошибка', 'Не удалось загрузить мероприятие'); }
    setLoading(false);
  };

  const handleJoin = async () => {
    setActionLoading(true);
    try { await joinEvent(eventId); setEvent((e) => e ? { ...e, is_joined: true } : e); }
    catch (e: any) { Alert.alert('Ошибка', e.response?.data?.detail || 'Не удалось присоединиться'); }
    setActionLoading(false);
  };

  const handleComplete = async () => {
    setActionLoading(true);
    try {
      const { data } = await completeEvent(eventId);
      setEvent((e) => e ? { ...e, is_completed: true, is_joined: true } : e);
      setPet(data.pet); setAuthPet(data.pet);
      let message = `+${data.xp_earned} XP получено!`;
      if (data.streak_bonus > 0) message += `\nБонус серии: +${data.streak_bonus} XP`;
      if (data.new_achievements.length > 0) {
        message += '\n\nНовые достижения:';
        data.new_achievements.forEach((a: any) => { message += `\n${a.title}`; });
      }
      Alert.alert('Выполнено!', message);
    } catch (e: any) { Alert.alert('Ошибка', e.response?.data?.detail || 'Не удалось отметить выполнение'); }
    setActionLoading(false);
  };

  if (loading) return <EventDetailSkeleton />;
  if (!event) return <View style={styles.center}><Text style={{ color: Colors.textSecondary }}>Мероприятие не найдено</Text></View>;

  const catColor = CategoryColors[event.category] || Colors.primary;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color={Colors.text} />
          <Text style={styles.backLabel}>Назад</Text>
        </TouchableOpacity>

        <View style={styles.catRow}>
          <View style={[styles.catBadge, { backgroundColor: catColor + '12' }]}>
            <Icon name={CAT_ICONS[event.category] || 'leaf'} size={14} color={catColor} />
            <Text style={[styles.catText, { color: catColor }]}>{CategoryLabels[event.category]}</Text>
          </View>
          <View style={styles.xpBadge}>
            <Text style={styles.xpText}>+{event.xp_reward} XP</Text>
          </View>
        </View>

        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.desc}>{event.description}</Text>

        <View style={styles.infoList}>
          {([
            { icon: 'map-marker-outline' as IconName, label: 'Адрес', value: event.address },
            { icon: 'clock-outline' as IconName, label: 'Время', value: new Date(event.start_time).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) },
            { icon: 'account-group-outline' as IconName, label: 'Участники', value: `${event.participants_count || 0}${event.max_participants ? ` / ${event.max_participants}` : ''}` },
          ]).map((item, i) => (
            <View key={i} style={styles.infoCard}>
              <View style={styles.infoIcon}><Icon name={item.icon} size={18} color={Colors.primary} /></View>
              <View>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        {event.is_completed ? (
          <View style={styles.completedBtn}>
            <Icon name="check-circle-outline" size={18} color={Colors.primary} />
            <Text style={styles.completedText}>Выполнено</Text>
          </View>
        ) : event.is_joined ? (
          <TouchableOpacity style={styles.actionBtn} onPress={handleComplete} disabled={actionLoading} activeOpacity={0.85}>
            {actionLoading ? <ActivityIndicator color="#FFF" /> : (
              <><Icon name="crosshairs-gps" size={18} color="#FFF" /><Text style={styles.actionText}>Отметить выполнение</Text></>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Colors.accent }]} onPress={handleJoin} disabled={actionLoading} activeOpacity={0.85}>
            {actionLoading ? <ActivityIndicator color="#FFF" /> : (
              <><Icon name="hand-wave-outline" size={18} color="#FFF" /><Text style={styles.actionText}>Присоединиться</Text></>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.xl, paddingTop: Platform.OS === 'ios' ? 64 : 48 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.xl },
  backLabel: { fontSize: 15, fontWeight: '600', color: Colors.text },
  catRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  catBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full },
  catText: { fontSize: 13, fontWeight: '600' },
  xpBadge: { backgroundColor: Colors.accentSurface, paddingHorizontal: 14, paddingVertical: 6, borderRadius: Radius.full },
  xpText: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  title: { fontSize: 24, fontWeight: '700', color: Colors.text, letterSpacing: -0.3, marginBottom: Spacing.sm, lineHeight: 30 },
  desc: { fontSize: 15, color: Colors.textSecondary, lineHeight: 23, marginBottom: Spacing.xxl },
  infoList: { gap: 10 },
  infoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.lg, gap: 12, ...Shadows.sm },
  infoIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.accentSurface, justifyContent: 'center', alignItems: 'center' },
  infoLabel: { fontSize: 11, color: Colors.textLight, fontWeight: '500', marginBottom: 2 },
  infoValue: { fontSize: 14, fontWeight: '600', color: Colors.text },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: Spacing.xl, paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    paddingTop: Spacing.lg, backgroundColor: Colors.background,
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
  },
  actionBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.md, paddingVertical: 16,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
  },
  actionText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  completedBtn: {
    backgroundColor: Colors.accentSurface, borderRadius: Radius.md, paddingVertical: 16,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
  },
  completedText: { fontSize: 16, fontWeight: '700', color: Colors.primary },
});
