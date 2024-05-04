import React, { useLayoutEffect, useState } from 'react';
import Colors from '@/constants/Colors';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { app } from '../../firebase-config';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigation, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const Page = () => {
  const [email, setEmail] = useState('');
  const router = useRouter();
  const navigation=useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: '',
      headerLeft: () => (
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleChangePassword = () => {
    const auth = getAuth(app);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert('Correo de recuperación enviado');
      })
      .catch((error) => {
        Alert.alert('Error al enviar el correo de recuperación:', error);
      });
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Enviar correo de recuperación</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  backText: {
    color: Colors.primary,
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  backButton: {
    marginLeft: 10,
  },
});

export default Page;
