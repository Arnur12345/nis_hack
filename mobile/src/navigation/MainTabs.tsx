import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet, Platform } from 'react-native';
import Icon, { IconName } from '../components/Icon';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import EventListScreen from '../screens/EventListScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Colors, Shadows } from '../constants/colors';

const Tab = createBottomTabNavigator();
const EventStack = createNativeStackNavigator();

function EventsNavigator() {
  return (
    <EventStack.Navigator screenOptions={{ headerShown: false }}>
      <EventStack.Screen name="EventList" component={EventListScreen} />
      <EventStack.Screen name="EventDetail" component={EventDetailScreen} />
    </EventStack.Navigator>
  );
}

const TAB_ICONS: Record<string, IconName> = {
  Home: 'home-outline',
  Map: 'map-outline',
  Events: 'calendar-month-outline',
  Leaderboard: 'trophy-outline',
  Profile: 'account-outline',
};

const TAB_ICONS_ACTIVE: Record<string, IconName> = {
  Home: 'home',
  Map: 'map',
  Events: 'calendar-month',
  Leaderboard: 'trophy',
  Profile: 'account',
};

const TAB_LABELS: Record<string, string> = {
  Home: 'Главная',
  Map: 'Карта',
  Events: 'События',
  Leaderboard: 'Рейтинг',
  Profile: 'Профиль',
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
            <Icon
              name={focused ? TAB_ICONS_ACTIVE[route.name] : TAB_ICONS[route.name]}
              size={20}
              color={focused ? Colors.tabActive : Colors.tabInactive}
            />
          </View>
        ),
        tabBarLabel: TAB_LABELS[route.name],
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Events" component={EventsNavigator} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 28 : 16,
    left: 20,
    right: 20,
    height: 64,
    backgroundColor: Colors.tabBar,
    borderRadius: 20,
    borderTopWidth: 0,
    paddingBottom: 0,
    paddingTop: 0,
    ...Shadows.lg,
  },
  tabItem: {
    paddingTop: 8,
    paddingBottom: 6,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: -2,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapActive: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
});
