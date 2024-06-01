import React, { useLayoutEffect, useState } from 'react';
import Colors from '@/constants/Colors';
import { Svg, Path, Defs, LinearGradient, Stop} from 'react-native-svg';
import { defaultStyles } from '@/constants/Styles';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert, Image} from 'react-native';
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
      headerShadowVisible: false,
      headerShown: true,
      headerTitle: '',
      headerLeft: () => (
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={'white'} />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: '#E5332A',
      },
    });
  }, [navigation]);

  const handleChangePassword = () => {
    const auth = getAuth(app);
    try{
      const emailValid = /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+\.[A-Za-z]{2,}$/;
			const trimmedEmail = email.trim();
			const invalidCharsRegex = /[^\w.+-@]/;

			if (trimmedEmail === '') {
				Alert.alert('Error', 'Por favor, ingresa tu correo.');
				return;
			}
			if (email !== trimmedEmail) {
				Alert.alert('Error', 'No se permiten espacios en blanco. Por favor, vuelve a escribir tu correo.');
				return;
			}
			if (/[A-Z]/.test(trimmedEmail)) {
				Alert.alert('Error', 'Los correos electrónicos no deben contener letras mayúsculas.');
				return;
			}
			if (!emailValid.test(trimmedEmail) || invalidCharsRegex.test(trimmedEmail)) {
				Alert.alert('Error', 'Por favor, ingresa un correo electrónico válido');
				return;
			}
      sendPasswordResetEmail(auth, email)
        .then(() => {
          Alert.alert('Correo de recuperación enviado');
        })
        .catch((error) => {
          Alert.alert('Error al enviar el correo de recuperación:', error);
        });
      setEmail('');
    }catch (error) {
      Alert.alert('Error', 'Ocurrió un error al enviar el correo. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  function SvgTop(){
    return(
      <Svg
        width={499}
        height={182}
        fill="none"
      >
        <Path
          fill="url(#a)"
          d="M0 170.789V0h499v166.519c-28.684-8.46-119.844-16.035-255.009 4.27-135.166 20.305-218.98 8.46-243.991 0Z"
        />
        <Defs>
          <LinearGradient
            id="a"
            x1={250}
            x2={249.213}
            y1={0}
            y2={156.615}
            gradientUnits="userSpaceOnUse"
          >
            <Stop stopColor="#E5332A" />
            <Stop offset={0.47} stopColor="#BC3A31" />
            <Stop offset={1} stopColor="#803530" />
          </LinearGradient>
        </Defs>
      </Svg>
    )
  }

  return (
    <View style={styles.container}>
      <View>
				<SvgTop />
			</View>
      <View style={{ marginTop: 60, paddingHorizontal: 50, marginBottom: 20}}>
        <Text style={styles.title}>Recuperar contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.containerButton}>
        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
					<Text style={styles.buttonText}>Enviar correo de recuperación</Text>
				</TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
		height: 55,
		paddingHorizontal: 30,
		backgroundColor: 'white',
		borderRadius: 30,
    fontSize: 14
	},
  containerButton:{
    alignItems: 'center',
		padding: 10,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 30,
    height: 50,
    borderRadius: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 16
  },
  backButton: {
    marginLeft: 10,
  },
});

export default Page;
