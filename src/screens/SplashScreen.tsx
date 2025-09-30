import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Button } from '../design-system/components/Button';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/types';
import { colors } from '../design-system/theme';

const { width, height } = Dimensions.get('window');

type SplashScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Splash'>;

export const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  
  return (
    <View style={styles.gradient}>
      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title="Continue"
          onPress={() => {
            console.log('Continue button pressed, navigating to SignUp');
            navigation.navigate('SignUp');
          }}
          variant="secondary"
          size="medium"
          style={{ width: '75%' }}
        />
        <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.white,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: height * 0.25,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  link: {
    padding: 8,
    marginTop: 16,
  },
  linkText: {
    color: colors.primary.black,
    fontSize: 16,
  },
});