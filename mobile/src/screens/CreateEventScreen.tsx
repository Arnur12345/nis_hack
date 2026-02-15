import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView,
  Alert, ActivityIndicator, Platform, KeyboardAvoidingView,
} from 'react-native';
import Icon from '../components/Icon';
import { createEvent } from '../api/events';
import { Colors, Radius, Shadows, Spacing } from '../constants/colors';

const CATEGORIES = [
  { key: 'ecology', label: 'Экология', icon: 'leaf' },
  { key: 'social', label: 'Социальные', icon: 'handshake-outline' },
  { key: 'animals', label: 'Животные', icon: 'paw' },
  { key: 'education', label: 'Образование', icon: 'book-open-variant' },
] as const;

export default function CreateEventScreen({ navigation }: any) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('ecology');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('51.1694');
  const [longitude, setLongitude] = useState('71.4491');
  const [xpReward, setXpReward] = useState('50');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !address.trim()) {
      Alert.alert('Ошибка', 'Заполните обязательные поля: название, описание, адрес');
      return;
    }
    setLoading(true);
    try {
      const startTime = new Date();
      startTime.setHours(startTime.getHours() + 1);

      await createEvent({
        title: title.trim(),
        description: description.trim(),
        category,
        latitude: parseFloat(latitude) || 51.1694,
        longitude: parseFloat(longitude) || 71.4491,
        address: address.trim(),
        start_time: startTime.toISOString(),
        xp_reward: parseInt(xpReward) || 50,
        max_participants: maxParticipants ? parseInt(maxParticipants) : null,
      });
      Alert.alert('Успешно!', 'Мероприятие создано', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Ошибка', e.response?.data?.detail || 'Не удалось создать мероприятие');
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color={Colors.text} />
          <Text style={styles.backLabel}>Назад</Text>
        </TouchableOpacity>

        <Text style={styles.header}>Создать мероприятие</Text>
        <Text style={styles.sub}>Организуй событие для сообщества</Text>

        <Text style={styles.label}>Название *</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Название мероприятия" placeholderTextColor={Colors.textLight} />

        <Text style={styles.label}>Описание *</Text>
        <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Расскажите подробнее..." placeholderTextColor={Colors.textLight} multiline numberOfLines={4} textAlignVertical="top" />

        <Text style={styles.label}>Категория</Text>
        <View style={styles.chips}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.key}
              style={[styles.chip, category === cat.key && styles.chipActive]}
              onPress={() => setCategory(cat.key)}
              activeOpacity={0.7}
            >
              <Icon name={cat.icon as any} size={14} color={category === cat.key ? '#FFF' : Colors.primary} />
              <Text style={[styles.chipText, category === cat.key && styles.chipTextActive]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Адрес *</Text>
        <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="ул. Примерная, 1" placeholderTextColor={Colors.textLight} />

        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.label}>Широта</Text>
            <TextInput style={styles.input} value={latitude} onChangeText={setLatitude} placeholder="51.1694" placeholderTextColor={Colors.textLight} keyboardType="numeric" />
          </View>
          <View style={styles.halfField}>
            <Text style={styles.label}>Долгота</Text>
            <TextInput style={styles.input} value={longitude} onChangeText={setLongitude} placeholder="71.4491" placeholderTextColor={Colors.textLight} keyboardType="numeric" />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.label}>XP награда</Text>
            <TextInput style={styles.input} value={xpReward} onChangeText={setXpReward} placeholder="50" placeholderTextColor={Colors.textLight} keyboardType="numeric" />
          </View>
          <View style={styles.halfField}>
            <Text style={styles.label}>Макс. участников</Text>
            <TextInput style={styles.input} value={maxParticipants} onChangeText={setMaxParticipants} placeholder="Без лимита" placeholderTextColor={Colors.textLight} keyboardType="numeric" />
          </View>
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading} activeOpacity={0.85}>
          {loading ? <ActivityIndicator color="#FFF" /> : (
            <>
              <Icon name="plus-circle-outline" size={18} color="#FFF" />
              <Text style={styles.submitText}>Создать</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.xl, paddingTop: Platform.OS === 'ios' ? 64 : 48 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.lg },
  backLabel: { fontSize: 15, fontWeight: '600', color: Colors.text },
  header: { fontSize: 24, fontWeight: '700', color: Colors.text, letterSpacing: -0.3 },
  sub: { fontSize: 14, color: Colors.textSecondary, marginTop: 2, marginBottom: Spacing.xxl },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6, marginTop: Spacing.lg },
  input: {
    backgroundColor: Colors.inputBg, borderRadius: Radius.lg, paddingHorizontal: Spacing.lg,
    paddingVertical: 14, fontSize: 15, color: Colors.text,
  },
  textArea: { minHeight: 100 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14,
    paddingVertical: 8, borderRadius: Radius.full, backgroundColor: Colors.accentSurface,
  },
  chipActive: { backgroundColor: Colors.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  chipTextActive: { color: '#FFF' },
  row: { flexDirection: 'row', gap: 12 },
  halfField: { flex: 1 },
  submitBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.md, paddingVertical: 16,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: Spacing.xxl,
  },
  submitText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
});
