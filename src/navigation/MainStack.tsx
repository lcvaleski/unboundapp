import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import { MainStackParamList } from './types';

const Stack = createStackNavigator<MainStackParamList>();

export function MainStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Onboarding">
        {(props) => <OnboardingScreen {...props} onComplete={() => props.navigation.goBack()} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}