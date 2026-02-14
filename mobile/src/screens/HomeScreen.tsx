import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import { usePetStore } from '../store/petStore';
import PetDisplay from '../components/PetDisplay';
import XPBar from '../components/XPBar';
import { Colors } from '../constants/colors';

export default function HomeScreen({ navigation }: any) {
  const authPet = useAuthStore((s) => s.pet);
  const { pet: storePet, fetchPet, isLoading } = usePetStore();
  const pet = storePet || authPet;

  useFocusEffect(
    useCallback(() => {
      fetchPet();
    }, [])
  );

  if (!pet) return <View style={styles.container}><Text>Загрузка...</Text></View>;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchPet} />}
    >
      <Text style={styles.header}>🏙️ Дух Города</Text>

      <PetDisplay pet={pet} />
      <XPBar xp={pet.xp} xpToNext={pet.xp_to_next_level} level={pet.level} />

      <View style={styles.streakContainer}>
        <Text style={styles.streakIcon}>🔥</Text>
        <Text style={styles.streakText}>Серия: {pet.streak_days} {pet.streak_days === 1 ? 'день' : 'дней'}</Text>
      </View>

      <TouchableOpacity
        style={styles.ctaBtn}
        onPress={() => navigation.navigate('Events')}
        activeOpacity={0.8}
      >
        <Text style={styles.ctaText}>🎯 Найти мероприятия</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.mapBtn}
        onPress={() => navigation.navigate('Map')}
        activeOpacity={0.8}
      >
        <Text style={styles.mapBtnText}>🗺️ Открыть карту</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { alignItems: 'center', paddingTop: 60, paddingBottom: 30 },
  header: { fontSize: 24, fontWeight: '800', color: Colors.text, marginBottom: 10 },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 16,
  },
  streakIcon: { fontSize: 20, marginRight: 6 },
  streakText: { fontSize: 15, fontWeight: '600', color: Colors.text },
  ctaBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 40,
    marginTop: 24,
    width: '85%',
    alignItems: 'center',
  },
  ctaText: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  mapBtn: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginTop: 12,
    width: '85%',
    alignItems: 'center',
  },
  mapBtnText: { fontSize: 16, fontWeight: '700', color: Colors.primary },
});
