import React, { useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { Svg, Path, Defs, LinearGradient, Stop, Image } from 'react-native-svg';
import { Link, useNavigation, useRouter } from 'expo-router'; // Importa Link desde expo-router
import Animated from 'react-native-reanimated';
import { getAuth, signInWithEmailAndPassword, User } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../firebase-config';

const Page = () => {
  const router = useRouter();
  const navigation=useNavigation();
  useLayoutEffect(()=>{
    navigation.setOptions({
      headerShown:false,
    })
  })
  const handleRegisterPress = () => {
    // Vuelve a la pantalla anterior al presionar el botón "Registrarse"
    router.back();
  };
  useWarmUpBrowser();
  
  function SvgTop() {
    return (
      <Svg
        width={500}
        height={300}
        fill="none"
      >
        <Path
          fill="url(#a)"
          d="M0 258.36V0h500v258.36c-209.843 75.414-420.768 31.423-500 0Z"
        />
        <Defs>
          <LinearGradient
            id="a"
            x1={250}
            x2={250}
            y1={0}
            y2={300}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset={0.133} stopColor="#E5332A" />
            <Stop offset={0.534} stopColor="#BC3A31" />
            <Stop offset={0.84} stopColor="#953730" />
            <Stop offset={1} stopColor="#803530" />
          </LinearGradient>
        </Defs>
        <Image
          x={100.5} 
          y={42.5}
          width="195"
          height="195"
          href={require('../(modals)/Imagen/logoBlanco.png')}
        />
      </Svg>
    );
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const SignIn = () => {

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValid.test(email) || password.length < 6) {
      Alert.alert('Error', 'Por favor, ingresa un correo electrónico válido y una contraseña de al menos 6 caracteres');
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setCurrentUser(user);
        router.push({ pathname: '/(protected)'});
        setEmail('');
        setPassword('');
      })
      .catch(error => {
        let errorMessage = 'Correo electrónico o contraseña incorrectos';
        Alert.alert(errorMessage);
      })
  }

  return (
    <Animated.ScrollView>
      <View style={[defaultStyles.div]}>
        <View style={{ marginHorizontal: -20 }}>
          <SvgTop />
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', padding: 10, borderRadius: 10 }}>
          <Text style={{ fontSize: 16, color: 'black' }}>Iniciar Sesión</Text>
        </View>
        <View>
          <TextInput
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
            placeholder="usuario@gmail.com"
          />
          <TextInput
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            placeholder="contraseña"
            secureTextEntry={true}
          />
        </View>
        <TouchableOpacity style={[defaultStyles.btn]} onPress={SignIn}>
          <Text style={[defaultStyles.btnText]}>Ingresar</Text>
        </TouchableOpacity>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 5}}>
          <Link href="/(modals)/recoverPassword" asChild>
            <TouchableOpacity onPress={handleRegisterPress}>
              <Text style={styles.btnText}>¿Olvidó su contraseña?</Text>
            </TouchableOpacity>
          </Link>
        </View>
        <View style={styles.separatorView}>
          <View style={{
            flex: 1,
            borderBottomColor: '#000',
            borderBottomWidth: StyleSheet.hairlineWidth
          }} />
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Link href="/(modals)/Registro" asChild>
            <TouchableOpacity onPress={handleRegisterPress}>
              <Text style={styles.btnText}>Registrarse</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </Animated.ScrollView>
  )
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 26,
  },
  btn: {
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  btnText: {
    fontSize: 16,
    color: Colors.primary,
  },
  separatorView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  separator: {
    color: Colors.grey,
  },
  titulo: {
    width: '75%',
    position: 'absolute',
    fontSize: 35,
    top: 180,
    color: '#fff',
    textAlign: 'left',
    fontWeight: 'bold',
    marginHorizontal: 45,
  },
  texto: {
    color: '#827F78',
    fontSize: 15,
    textAlign: 'left',
    marginBottom: 20,
  },
  btnOutline: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.grey,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  btnOutlineText: {
    color: '#000',
    fontSize: 16,
  },
  input: {
    height: 55,
    marginTop: 20,
    borderRadius: 30,
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
})

export default Page;
