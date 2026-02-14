import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import Skeleton, { SkeletonLine } from '../components/Skeleton';
import { Colors, Radius, Shadows, Spacing } from '../constants/colors';

function AppLoadingSkeleton() {
  return (
    <View style={loadingStyles.container}>
      {/* Fake header */}
      <View style={loadingStyles.header}>
        <SkeletonLine width={180} height={24} />
        <SkeletonLine width={220} height={14} style={{ marginTop: 6 }} />
      </View>
      {/* Big card */}
      <View style={loadingStyles.card}>
        <Skeleton width={120} height={120} borderRadius={60} style={{ alignSelf: 'center' }} />
        <SkeletonLine width="50%" height={12} style={{ alignSelf: 'center', marginTop: 16 }} />
      </View>
      {/* Small card */}
      <View style={loadingStyles.smallCard}>
        <Skeleton width={40} height={40} borderRadius={12} />
        <View style={{ marginLeft: 12 }}>
          <SkeletonLine width={80} height={16} />
          <SkeletonLine width={100} height={12} style={{ marginTop: 4 }} />
        </View>
      </View>
    </View>
  );
}

const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'ios' ? 64 : 48,
    paddingHorizontal: Spacing.lg,
  },
  header: { marginBottom: Spacing.xl },
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.lg,
    ...Shadows.md,
  },
  smallCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.sm,
  },
});

export default function RootNavigator() {
  const { isAuthenticated, isLoading, loadToken } = useAuthStore();

  useEffect(() => {
    loadToken();
  }, []);

  if (isLoading) {
    return <AppLoadingSkeleton />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
