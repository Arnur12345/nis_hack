import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import Icon from '../components/Icon';
import { useAuthStore } from '../store/authStore';
import { Colors, Radius } from '../constants/colors';

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const register = useAuthStore((s) => s.register);

  const handleRegister = async () => {
    if (!email || !password || !username) return Alert.alert('Ошибка', 'Заполните все поля');
    if (password.length < 4) return Alert.alert('Ошибка', 'Пароль слишком короткий');
    setLoading(true);
    try {
      await register(email, password, username);
    } catch (e: any) {
      Alert.alert('Ошибка', e.response?.data?.detail || 'Не удалось зарегистрироваться');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={20} color={Colors.text} />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconBox}>
            <Icon name="sprout-outline" size={22} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Создать аккаунт</Text>
          <Text style={styles.subtitle}>Начни своё путешествие</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Имя пользователя</Text>
          <TextInput
            style={styles.input} placeholder="greenwarrior"
            value={username} onChangeText={setUsername}
            autoCapitalize="none" placeholderTextColor={Colors.textLight}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input} placeholder="your@email.com"
            value={email} onChangeText={setEmail}
            keyboardType="email-address" autoCapitalize="none"
            placeholderTextColor={Colors.textLight}
          />
          <Text style={styles.label}>Пароль</Text>
          <TextInput
            style={styles.input} placeholder="Минимум 4 символа"
            value={password} onChangeText={setPassword}
            secureTextEntry placeholderTextColor={Colors.textLight}
          />
          <TouchableOpacity style={styles.btn} onPress={handleRegister} disabled={loading} activeOpacity={0.85}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Создать аккаунт</Text>}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.link}>
          <Text style={styles.linkGrey}>Уже есть аккаунт? </Text>
          <Text style={styles.linkGreen}>Войти</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  backBtn: { paddingTop: Platform.OS === 'ios' ? 60 : 48, paddingHorizontal: 24, paddingBottom: 8 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, marginTop: -40 },
  header: { alignItems: 'center', marginBottom: 28 },
  iconBox: {
    width: 52, height: 52, borderRadius: 16, backgroundColor: Colors.accentSurface,
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
  },
  title: { fontSize: 26, fontWeight: '700', color: Colors.text, letterSpacing: -0.3, marginBottom: 4 },
  subtitle: { fontSize: 15, color: Colors.textSecondary },
  form: { gap: 4 },
  label: { fontSize: 13, fontWeight: '600', color: Colors.text, marginLeft: 2, marginTop: 8, marginBottom: 4 },
  input: {
    backgroundColor: Colors.inputBg, borderRadius: Radius.lg,
    paddingHorizontal: 16, paddingVertical: 14, fontSize: 15,
    color: Colors.text,
  },
  btn: { backgroundColor: Colors.primary, borderRadius: Radius.md, paddingVertical: 16, alignItems: 'center', marginTop: 16 },
  btnText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  link: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  linkGrey: { fontSize: 14, color: Colors.textSecondary },
  linkGreen: { fontSize: 14, color: Colors.primary, fontWeight: '700' },
});
