import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import Icon from '../components/Icon';
import { Colors, Radius, Shadows, Spacing } from '../constants/colors';

export default function WelcomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.top}>
        <View style={styles.iconBox}>
          <Icon name="leaf" size={28} color="#FFF" />
        </View>
        <Text style={styles.title}>Дух Города</Text>
        <Text style={styles.subtitle}>
          Волонтёрь, расти питомца{'\n'}и меняй город к лучшему
        </Text>
      </View>

      <View style={styles.features}>
        {[
          { icon: 'star-four-points-outline' as const, text: 'Участвуй в мероприятиях' },
          { icon: 'account-group-outline' as const, text: 'Соревнуйся с друзьями' },
          { icon: 'trophy-outline' as const, text: 'Получай достижения' },
        ].map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Icon name={f.icon} size={16} color="rgba(255,255,255,0.8)" />
            </View>
            <Text style={styles.featureText}>{f.text}</Text>
          </View>
        ))}
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>Войти</Text>
          <Icon name="arrow-right" size={18} color={Colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('Register')}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryBtnText}>Создать аккаунт</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: Colors.primary,
    justifyContent: 'space-between', paddingHorizontal: 28, paddingTop: 100, paddingBottom: 50,
  },
  top: { alignItems: 'center' },
  iconBox: {
    width: 64, height: 64, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 24,
  },
  title: { fontSize: 32, fontWeight: '700', color: '#FFF', letterSpacing: -0.5, marginBottom: 10 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.65)', textAlign: 'center', lineHeight: 24 },
  features: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: Radius.xl, padding: 24, gap: 18,
  },
  featureRow: { flexDirection: 'row', alignItems: 'center' },
  featureIcon: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  featureText: { fontSize: 15, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  bottom: { gap: 12 },
  primaryBtn: {
    backgroundColor: '#FFF', borderRadius: Radius.md,
    paddingVertical: 16, flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center', gap: 8,
  },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  secondaryBtn: {
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)',
    borderRadius: Radius.md, paddingVertical: 16, alignItems: 'center',
  },
  secondaryBtnText: { fontSize: 16, fontWeight: '600', color: '#FFF' },
});
