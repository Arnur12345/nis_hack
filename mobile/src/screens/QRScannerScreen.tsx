import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Icon from '../components/Icon';
import { verifyQR } from '../api/events';
import { usePetStore } from '../store/petStore';
import { useAuthStore } from '../store/authStore';
import { Colors, Radius, Spacing } from '../constants/colors';

export default function QRScannerScreen({ route, navigation }: any) {
  const { eventId } = route.params;
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const setPet = usePetStore((s) => s.setPet);
  const setAuthPet = useAuthStore((s) => s.setPet);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || loading) return;
    setScanned(true);
    setLoading(true);

    try {
      // The QR code data could be just the code, or "event_id:qr_code"
      let qrCode = data;
      if (data.includes(':')) {
        qrCode = data.split(':').pop() || data;
      }

      const { data: result } = await verifyQR(eventId, qrCode);
      setPet(result.pet);
      setAuthPet(result.pet);

      let message = `+${result.xp_earned} XP получено!`;
      if (result.streak_bonus > 0) message += `\nБонус серии: +${result.streak_bonus} XP`;
      if (result.new_achievements.length > 0) {
        message += '\n\nНовые достижения:';
        result.new_achievements.forEach((a: any) => { message += `\n${a.title}`; });
      }
      Alert.alert('Выполнено!', message, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Ошибка', e.response?.data?.detail || 'Неверный QR-код');
      setScanned(false);
    }
    setLoading(false);
  };

  if (!permission) return <View style={styles.container}><ActivityIndicator color={Colors.primary} /></View>;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionCard}>
          <Icon name="camera-outline" size={48} color={Colors.primary} />
          <Text style={styles.permTitle}>Нужен доступ к камере</Text>
          <Text style={styles.permSub}>Для сканирования QR-кода необходим доступ к камере</Text>
          <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
            <Text style={styles.permBtnText}>Разрешить</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />

      {/* Overlay */}
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#FFF" />
          <Text style={styles.backText}>Назад</Text>
        </TouchableOpacity>

        <View style={styles.scanFrame}>
          <View style={[styles.corner, styles.tl]} />
          <View style={[styles.corner, styles.tr]} />
          <View style={[styles.corner, styles.bl]} />
          <View style={[styles.corner, styles.br]} />
        </View>

        <View style={styles.bottomInfo}>
          {loading ? (
            <ActivityIndicator color="#FFF" size="large" />
          ) : (
            <>
              <Icon name="qrcode-scan" size={24} color="#FFF" />
              <Text style={styles.scanText}>Наведите камеру на QR-код мероприятия</Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between' },
  backBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingTop: Platform.OS === 'ios' ? 64 : 48, paddingHorizontal: Spacing.xl,
  },
  backText: { fontSize: 15, fontWeight: '600', color: '#FFF' },
  scanFrame: { width: 250, height: 250, alignSelf: 'center' },
  corner: { position: 'absolute', width: 30, height: 30, borderColor: '#FFF', borderWidth: 3 },
  tl: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 12 },
  tr: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 12 },
  bl: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 12 },
  br: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 12 },
  bottomInfo: {
    alignItems: 'center', gap: 12, paddingBottom: Platform.OS === 'ios' ? 60 : 40,
  },
  scanText: { fontSize: 15, fontWeight: '600', color: '#FFF', textAlign: 'center', paddingHorizontal: 40 },
  permissionCard: { alignItems: 'center', gap: 12, padding: 40, backgroundColor: Colors.card, borderRadius: Radius.xl, marginHorizontal: 20 },
  permTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  permSub: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
  permBtn: { backgroundColor: Colors.primary, borderRadius: Radius.md, paddingHorizontal: 24, paddingVertical: 12, marginTop: 8 },
  permBtnText: { fontSize: 15, fontWeight: '700', color: '#FFF' },
});
