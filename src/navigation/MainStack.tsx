import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import { MainTabs } from './MainTabs';
import { MainStackParamList } from './types';

const Stack = createStackNavigator<MainStackParamList>();

export function MainStack() {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Onboarding">
        {(props) => <OnboardingScreen {...props} onComplete={() => props.navigation.goBack()} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}