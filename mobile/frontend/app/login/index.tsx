import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { styles } from './styles';
import { Colors } from '@/constants/theme';

interface Props {
  onLogin: () => void;      // switch to tabs after login
  onSignup?: () => void;    // optional callback to show signup
}

export default function LoginForm({ onLogin, onSignup }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    // Replace with real login logic
    onLogin();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to CVSUMPC Loan App</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {onSignup && (
        <TouchableOpacity onPress={onSignup} style={{ marginTop: 15 }}>
          <Text style={{ textAlign: 'center', color: Colors.light.tint }}>
            Don't have an account? Sign Up
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
