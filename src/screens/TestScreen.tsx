import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

export const TestScreen = () => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Input Screen</Text>

      <TextInput
        style={styles.input}
        value={text1}
        onChangeText={setText1}
        placeholder="Type here..."
      />

      <TextInput
        style={styles.input}
        value={text2}
        onChangeText={setText2}
        placeholder="Type here too..."
        secureTextEntry
      />

      <Text>Text 1: {text1}</Text>
      <Text>Text 2: {text2}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    paddingTop: 100,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});