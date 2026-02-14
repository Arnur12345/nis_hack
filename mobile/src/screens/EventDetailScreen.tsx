import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { getEventDetail, joinEvent, completeEvent } from '../api/events';
import { usePetStore } from '../store/petStore';
import { useAuthStore } from '../store/authStore';
import { Event, CompleteEventResponse } from '../types';
import { Colors, CategoryIcons, CategoryLabels } from '../constants/colors';

export default function EventDetailScreen({ route, navigation }: any) {
  const { eventId } = route.params;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const setPet = usePetStore((s) => s.setPet);
  const setAuthPet = useAuthStore((s) => s.setPet);

  useEffect(() => {
    loadEvent();
  }, []);

  const loadEvent = async () => {
    try {
      const { data } = await getEventDetail(eventId);
      setEvent(data);
    } catch {
      Alert.alert('Ошибка', 'Не удалось загрузить мероприятие');
    }
    setLoading(false);
  };

  const handleJoin = async () => {
    setActionLoading(true);
    try {
      await joinEvent(eventId);
      setEvent((e) => e ? { ...e, is_joined: true } : e);
    } catch (e: any) {
      Alert.alert('Ошибка', e.response?.data?.detail || 'Не удалось присоединиться');
    }
    setActionLoading(false);
  };

  const handleComplete = async () => {
    setActionLoading(true);
    try {
      const { data } = await completeEvent(eventId);
      setEvent((e) => e ? { ...e, is_completed: true, is_joined: true } : e);
      setPet(data.pet);
      setAuthPet(data.pet);

      let message = `+${data.xp_earned} XP получено!`;
      if (data.streak_bonus > 0) message += `\n🔥 Бонус серии: +${data.streak_bonus} XP`;
      if (data.new_achievements.length > 0) {
        message += '\n\n🏆 Новые достижения:';
        data.new_achievements.forEach((a) => {
          message += `\n${a.icon} ${a.title}`;
        });
      }
      Alert.alert('🎉 Выполнено!', message);
    } catch (e: any) {
      Alert.alert('Ошибка', e.response?.data?.detail || 'Не удалось отметить выполнение');
    }
    setActionLoading(false);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>;
  if (!event) return <View style={styles.center}><Text>Мероприятие не найдено</Text></View>;

  const categoryColor = Colors[event.category as keyof typeof Colors] || Colors.primary;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
        <Text style={styles.categoryText}>
          {CategoryIcons[event.category]} {CategoryLabels[event.category]}
        </Text>
      </View>

      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.description}>{event.description}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.infoItem}>📍 {event.address}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoItem}>
          🕐 {new Date(event.start_time).toLocaleDateString('ru-RU', {
            day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
          })}
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoItem}>
          👥 {event.participants_count || 0}{event.max_participants ? ` / ${event.max_participants}` : ''} участников
        </Text>
      </View>

      <View style={styles.xpBadge}>
        <Text style={styles.xpText}>+{event.xp_reward} XP</Text>
      </View>

      {event.is_completed ? (
        <View style={[styles.actionBtn, styles.completedBtn]}>
          <Text style={styles.completedBtnText}>✅ Выполнено</Text>
        </View>
      ) : event.is_joined ? (
        <TouchableOpacity style={styles.actionBtn} onPress={handleComplete} disabled={actionLoading}>
          {actionLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.actionBtnText}>🎯 Отметить выполнение</Text>}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.actionBtn, styles.joinBtn]} onPress={handleJoin} disabled={actionLoading}>
          {actionLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.actionBtnText}>✋ Присоединиться</Text>}
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingTop: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  categoryBadge: { alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 14, marginBottom: 12 },
  categoryText: { fontSize: 14, fontWeight: '600' },
  title: { fontSize: 24, fontWeight: '800', color: Colors.text, marginBottom: 12 },
  description: { fontSize: 16, color: Colors.textSecondary, lineHeight: 24, marginBottom: 20 },
  infoRow: { marginBottom: 10 },
  infoItem: { fontSize: 15, color: Colors.text },
  xpBadge: {
    backgroundColor: Colors.primary + '15',
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    marginTop: 10,
    marginBottom: 24,
  },
  xpText: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  actionBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  joinBtn: { backgroundColor: Colors.success },
  completedBtn: { backgroundColor: Colors.border },
  actionBtnText: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  completedBtnText: { fontSize: 18, fontWeight: '700', color: Colors.textSecondary },
});
