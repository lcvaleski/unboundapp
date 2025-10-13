import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import { ExerciseCardsScreen } from '../screens/ExerciseCardsScreen';
import { ChallengeFlowScreen } from '../screens/ChallengeFlowScreen';
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
      <Stack.Screen
        name="ChallengeFlow"
        component={ChallengeFlowScreen}
        options={{
          presentation: 'modal',
          gestureEnabled: true,
          gestureDirection: 'vertical',
          cardOverlayEnabled: true,
          gestureResponseDistance: 250,
          cardStyle: { backgroundColor: 'transparent' },
          ...(Platform.OS === 'ios' && {
            stackPresentation: 'formSheet',
            animationEnabled: true,
            cardStyleInterpolator: ({ current: { progress }, layouts }) => ({
              cardStyle: {
                transform: [
                  {
                    translateY: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.height, 0],
                    }),
                  },
                ],
              },
              overlayStyle: {
                opacity: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.5],
                }),
              },
            }),
          }),
        }}
      />
      <Stack.Screen
        name="ExerciseCards"
        component={ExerciseCardsScreen}
        options={{
          presentation: 'modal',
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}