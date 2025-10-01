import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { View, Text } from 'react-native';

export type MainTabsParamList = {
  Home: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

// Simple home icon - a house shape
const HomeIcon = ({ color, size }: { color: string; size: number }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{
      width: size * 0.7,
      height: size * 0.6,
      borderWidth: 2,
      borderColor: color,
      borderRadius: 2,
      marginTop: size * 0.15,
    }} />
    <View style={{
      position: 'absolute',
      top: 0,
      width: 0,
      height: 0,
      borderLeftWidth: size * 0.45,
      borderRightWidth: size * 0.45,
      borderBottomWidth: size * 0.35,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: color,
    }} />
  </View>
);

// Simple profile icon - a circle for head and arc for body
const ProfileIcon = ({ color, size }: { color: string; size: number }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{
      width: size * 0.35,
      height: size * 0.35,
      borderRadius: size * 0.175,
      backgroundColor: color,
      marginBottom: size * 0.15,
    }} />
    <View style={{
      width: size * 0.7,
      height: size * 0.35,
      borderTopLeftRadius: size * 0.35,
      borderTopRightRadius: size * 0.35,
      backgroundColor: color,
      position: 'absolute',
      bottom: 0,
    }} />
  </View>
);

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#888888',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: HomeIcon,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ProfileIcon,
        }}
      />
    </Tab.Navigator>
  );
}