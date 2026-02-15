import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert,
  ActivityIndicator, Platform, Modal, Dimensions, Animated,
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import Icon, { IconName } from '../components/Icon';
import { getEventDetail, joinEvent, getEventQR } from '../api/events';
import { usePetStore } from '../store/petStore';
import { useAuthStore } from '../store/authStore';
import EventDetailSkeleton from '../components/skeletons/EventDetailSkeleton';
import { Event } from '../types';
import { Colors, CategoryColors, CategoryLabels, Radius, Shadows, Spacing } from '../constants/colors';

const { width } = Dimensions.get('window');
const MAP_HEIGHT = 220;

const CAT_ICONS: Record<string, IconName> = {
  ecology: 'leaf',
  social: 'handshake-outline',
  animals: 'paw',
  education: 'book-open-variant',
};

/** Distance in meters between two coordinates (Haversine) */
function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function EventDetailScreen({ route, navigation }: any) {
  const { eventId } = route.params;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showParticipateModal, setShowParticipateModal] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isNearby, setIsNearby] = useState(false);
  const [distanceText, setDistanceText] = useState('');
  const setPet = usePetStore((s) => s.setPet);
  const setAuthPet = useAuthStore((s) => s.setPet);
  const user = useAuthStore((s) => s.user);
  const mapRef = useRef<MapView>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => { loadEvent(); }, []);

  // Watch user location once joined
  useEffect(() => {
    if (!event?.is_joined || event?.is_completed) return;
    let sub: Location.LocationSubscription | null = null;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      sub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 10, timeInterval: 5000 },
        (loc) => {
          const pos = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
          setUserLocation(pos);
          if (event) {
            const dist = getDistanceMeters(pos.latitude, pos.longitude, event.latitude, event.longitude);
            setIsNearby(dist <= 200); // 200m radius
            if (dist < 1000) {
              setDistanceText(`${Math.round(dist)} м`);
            } else {
              setDistanceText(`${(dist / 1000).toFixed(1)} км`);
            }
          }
        },
      );
    })();

    return () => { sub?.remove(); };
  }, [event?.is_joined, event?.is_completed, event?.latitude, event?.longitude]);

  const loadEvent = async () => {
    try { const { data } = await getEventDetail(eventId); setEvent(data); }
    catch { Alert.alert('Ошибка', 'Не удалось загрузить мероприятие'); }
    setLoading(false);
  };

  const handleJoin = async () => {
    setActionLoading(true);
    try {
      await joinEvent(eventId);
      setEvent((e) => e ? { ...e, is_joined: true } : e);
      // Show the participation modal with details
      setShowParticipateModal(true);
      Animated.spring(slideAnim, { toValue: 1, useNativeDriver: true, tension: 50, friction: 9 }).start();
    } catch (e: any) {
      Alert.alert('Ошибка', e.response?.data?.detail || 'Не удалось присоединиться');
    }
    setActionLoading(false);
  };

  const handleOpenQR = () => {
    navigation.navigate('QRScanner', { eventId });
  };

  const handleShowQR = async () => {
    try {
      const { data } = await getEventQR(eventId);
      Alert.alert('QR-код мероприятия', `Код: ${data.qr_code}\n\nПокажите этот код участникам для подтверждения выполнения.`);
    } catch {
      Alert.alert('Ошибка', 'Не удалось получить QR-код');
    }
  };

  const closeModal = () => {
    Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      setShowParticipateModal(false);
    });
  };

  if (loading) return <EventDetailSkeleton />;
  if (!event) return <View style={styles.center}><Text style={{ color: Colors.textSecondary }}>Мероприятие не найдено</Text></View>;

  const catColor = CategoryColors[event.category] || Colors.primary;
  const startDate = new Date(event.start_time);
  const formattedDate = startDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  const formattedTime = startDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Map Header */}
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_DEFAULT}
            initialRegion={{
              latitude: event.latitude,
              longitude: event.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            <Marker
              coordinate={{ latitude: event.latitude, longitude: event.longitude }}
              pinColor={catColor}
            />
          </MapView>
          {/* Back button overlay */}
          <TouchableOpacity style={styles.backOverlay} onPress={() => navigation.goBack()}>
            <View style={styles.backCircle}>
              <Icon name="arrow-left" size={18} color={Colors.text} />
            </View>
          </TouchableOpacity>
          {/* XP Badge overlay */}
          <View style={styles.xpOverlay}>
            <View style={styles.xpBadge}>
              <Text style={styles.xpText}>+{event.xp_reward} XP</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentWrap}>
          <View style={styles.catRow}>
            <View style={[styles.catBadge, { backgroundColor: catColor + '12' }]}>
              <Icon name={CAT_ICONS[event.category] || 'leaf'} size={14} color={catColor} />
              <Text style={[styles.catText, { color: catColor }]}>{CategoryLabels[event.category]}</Text>
            </View>
            {event.is_joined && !event.is_completed && distanceText ? (
              <View style={[styles.distanceBadge, isNearby ? styles.distanceNearby : null]}>
                <Icon name="map-marker-outline" size={12} color={isNearby ? Colors.success : Colors.textSecondary} />
                <Text style={[styles.distanceText, isNearby ? { color: Colors.success } : null]}>{distanceText}</Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.title}>{event.title}</Text>
          {event.creator_username && (
            <Text style={styles.creator}>Создал @{event.creator_username}</Text>
          )}
          <Text style={styles.desc}>{event.description}</Text>

          {/* Info Cards */}
          <View style={styles.infoList}>
            <View style={styles.infoCard}>
              <View style={styles.infoIcon}><Icon name="map-marker-outline" size={18} color={Colors.primary} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Адрес</Text>
                <Text style={styles.infoValue}>{event.address}</Text>
              </View>
            </View>
            <View style={styles.infoCard}>
              <View style={styles.infoIcon}><Icon name="clock-outline" size={18} color={Colors.primary} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Время</Text>
                <Text style={styles.infoValue}>{formattedDate}, {formattedTime}</Text>
              </View>
            </View>
            <View style={styles.infoCard}>
              <View style={styles.infoIcon}><Icon name="account-group-outline" size={18} color={Colors.primary} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Участники</Text>
                <Text style={styles.infoValue}>{event.participants_count || 0}{event.max_participants ? ` / ${event.max_participants}` : ''}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 130 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        {event.creator_id === user?.id && (
          <TouchableOpacity style={[styles.actionBtn, { flex: undefined, backgroundColor: Colors.primaryLight, marginBottom: 8 }]} onPress={handleShowQR} activeOpacity={0.85}>
            <Icon name="qrcode" size={18} color="#FFF" />
            <Text style={styles.actionText}>Показать QR</Text>
          </TouchableOpacity>
        )}
        {event.is_completed ? (
          <View style={styles.completedBtn}>
            <Icon name="check-circle-outline" size={18} color={Colors.primary} />
            <Text style={styles.completedText}>Выполнено</Text>
          </View>
        ) : event.is_joined ? (
          <View style={styles.joinedActions}>
            {isNearby ? (
              <TouchableOpacity style={styles.actionBtn} onPress={handleOpenQR} activeOpacity={0.85}>
                <Icon name="qrcode-scan" size={18} color="#FFF" />
                <Text style={styles.actionText}>Сканировать QR-код</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ flex: 1 }}>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Colors.textLight }]} disabled activeOpacity={1}>
                  <Icon name="qrcode-scan" size={18} color="#FFF" />
                  <Text style={styles.actionText}>Сканировать QR-код</Text>
                </TouchableOpacity>
                <Text style={styles.nearbyHint}>
                  Подойдите ближе к месту события
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.infoBtn}
              onPress={() => {
                setShowParticipateModal(true);
                Animated.spring(slideAnim, { toValue: 1, useNativeDriver: true, tension: 50, friction: 9 }).start();
              }}
              activeOpacity={0.7}
            >
              <Icon name="information-outline" size={18} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Colors.primary }]} onPress={handleJoin} disabled={actionLoading} activeOpacity={0.85}>
            {actionLoading ? <ActivityIndicator color="#FFF" /> : (
              <><Icon name="hand-wave-outline" size={18} color="#FFF" /><Text style={styles.actionText}>Участвовать</Text></>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Participation Modal */}
      <Modal visible={showParticipateModal} transparent animationType="none">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeModal}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [400, 0],
                  }),
                }],
              },
            ]}
          >
            <TouchableOpacity activeOpacity={1}>
              {/* Modal Handle */}
              <View style={styles.modalHandle} />

              {/* Mini Map */}
              <View style={styles.modalMapWrap}>
                <MapView
                  style={styles.modalMap}
                  provider={PROVIDER_DEFAULT}
                  initialRegion={{
                    latitude: event.latitude,
                    longitude: event.longitude,
                    latitudeDelta: 0.008,
                    longitudeDelta: 0.008,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                >
                  <Marker
                    coordinate={{ latitude: event.latitude, longitude: event.longitude }}
                    pinColor={catColor}
                  />
                </MapView>
              </View>

              {/* Event Info in Modal */}
              <Text style={styles.modalTitle}>Вы записаны!</Text>
              <Text style={styles.modalEventTitle}>{event.title}</Text>

              <View style={styles.modalInfoList}>
                <View style={styles.modalInfoRow}>
                  <View style={styles.modalInfoIcon}>
                    <Icon name="calendar-month-outline" size={16} color={Colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.modalInfoLabel}>Дата</Text>
                    <Text style={styles.modalInfoValue}>{formattedDate}</Text>
                  </View>
                </View>
                <View style={styles.modalInfoRow}>
                  <View style={styles.modalInfoIcon}>
                    <Icon name="clock-outline" size={16} color={Colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.modalInfoLabel}>Время начала</Text>
                    <Text style={styles.modalInfoValue}>{formattedTime}</Text>
                  </View>
                </View>
                <View style={styles.modalInfoRow}>
                  <View style={styles.modalInfoIcon}>
                    <Icon name="map-marker-outline" size={16} color={Colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalInfoLabel}>Место</Text>
                    <Text style={styles.modalInfoValue}>{event.address}</Text>
                  </View>
                </View>
                <View style={styles.modalInfoRow}>
                  <View style={styles.modalInfoIcon}>
                    <Icon name="account-group-outline" size={16} color={Colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.modalInfoLabel}>Участники</Text>
                    <Text style={styles.modalInfoValue}>{event.participants_count || 0}{event.max_participants ? ` / ${event.max_participants}` : ''} человек</Text>
                  </View>
                </View>
                <View style={styles.modalInfoRow}>
                  <View style={styles.modalInfoIcon}>
                    <Icon name="star-outline" size={16} color={Colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.modalInfoLabel}>Награда</Text>
                    <Text style={styles.modalInfoValue}>+{event.xp_reward} XP</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.modalHint}>
                Придите на место события и отсканируйте QR-код организатора для подтверждения участия.
              </Text>

              <TouchableOpacity style={styles.modalBtn} onPress={closeModal} activeOpacity={0.85}>
                <Text style={styles.modalBtnText}>Понятно</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 0 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },

  // Map
  mapContainer: { width, height: MAP_HEIGHT, position: 'relative' },
  map: { width: '100%', height: '100%' },
  backOverlay: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 38,
    left: Spacing.lg,
  },
  backCircle: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center', alignItems: 'center',
    ...Shadows.sm,
  },
  xpOverlay: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 38,
    right: Spacing.lg,
  },
  xpBadge: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: Radius.full,
    ...Shadows.sm,
  },
  xpText: { fontSize: 14, fontWeight: '700', color: Colors.primary },

  // Content
  contentWrap: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl },
  catRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  catBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full },
  catText: { fontSize: 13, fontWeight: '600' },
  distanceBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5,
    backgroundColor: Colors.card, borderRadius: Radius.full,
    ...Shadows.sm,
  },
  distanceNearby: { backgroundColor: '#E8F8ED' },
  distanceText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  title: { fontSize: 24, fontWeight: '700', color: Colors.text, letterSpacing: -0.3, marginBottom: Spacing.sm, lineHeight: 30 },
  creator: { fontSize: 13, fontWeight: '600', color: Colors.primaryMuted, marginBottom: Spacing.sm },
  desc: { fontSize: 15, color: Colors.textSecondary, lineHeight: 23, marginBottom: Spacing.xxl },
  infoList: { gap: 10 },
  infoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.lg, gap: 12, ...Shadows.sm },
  infoIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.accentSurface, justifyContent: 'center', alignItems: 'center' },
  infoLabel: { fontSize: 11, color: Colors.textLight, fontWeight: '500', marginBottom: 2 },
  infoValue: { fontSize: 14, fontWeight: '600', color: Colors.text },

  // Bottom bar
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: Spacing.xl, paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    paddingTop: Spacing.lg, backgroundColor: Colors.background,
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
  },
  joinedActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: Colors.primary, borderRadius: Radius.md, paddingVertical: 16,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
  },
  actionText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  nearbyHint: {
    fontSize: 11, color: Colors.textSecondary, textAlign: 'center', marginTop: 6,
  },
  infoBtn: {
    width: 52, height: 52, borderRadius: Radius.md,
    backgroundColor: Colors.accentSurface,
    justifyContent: 'center', alignItems: 'center',
  },
  completedBtn: {
    backgroundColor: Colors.accentSurface, borderRadius: Radius.md, paddingVertical: 16,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
  },
  completedText: { fontSize: 16, fontWeight: '700', color: Colors.primary },

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    paddingTop: Spacing.md,
    maxHeight: '85%',
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center', marginBottom: Spacing.lg,
  },
  modalMapWrap: {
    height: 140, borderRadius: Radius.md, overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  modalMap: { width: '100%', height: '100%' },
  modalTitle: {
    fontSize: 20, fontWeight: '700', color: Colors.primary,
    textAlign: 'center', marginBottom: 4,
  },
  modalEventTitle: {
    fontSize: 16, fontWeight: '600', color: Colors.text,
    textAlign: 'center', marginBottom: Spacing.xl,
  },
  modalInfoList: { gap: 14 },
  modalInfoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  modalInfoIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.accentSurface,
    justifyContent: 'center', alignItems: 'center',
  },
  modalInfoLabel: { fontSize: 11, color: Colors.textLight, fontWeight: '500', marginBottom: 1 },
  modalInfoValue: { fontSize: 14, fontWeight: '600', color: Colors.text },
  modalHint: {
    fontSize: 13, color: Colors.textSecondary, textAlign: 'center',
    lineHeight: 19, marginTop: Spacing.xl, marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  modalBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.md,
    paddingVertical: 16, alignItems: 'center',
  },
  modalBtnText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
});
