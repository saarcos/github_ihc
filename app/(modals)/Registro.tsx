import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Alert } from 'react-native';
import { defaultStyles } from '@/constants/Styles';
import RNPickerSelect from 'react-native-picker-select';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Svg, Path, Defs, LinearGradient, Stop, Image } from 'react-native-svg';
import { Link, useRouter} from 'expo-router';
import { Ionicons, MaterialIcons} from '@expo/vector-icons';
import { getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import {initializeApp} from 'firebase/app';
import {firebaseConfig} from 'firebase-config';
import { Usuario , insertarUsuario } from '@/app/api/api';

interface Props {
  usuario?: Usuario;
}

const Registro = ({ usuario}: Props) => {
  const router = useRouter();
  const [nombre, setUsuario] = useState(usuario?.nombre || '');
  const [apellido, setApellido] = useState(usuario?.apellido || '');
  const [telefono, setTelefono] = useState(usuario?.telefono ? usuario.telefono.toString() : '');
  const [email, setCorreo] = useState(usuario?.correo || '');
  const [password, setContraseña] = useState(usuario?.password_usuario || '');
  const [passwordMatch, setConfirmarContraseña] = useState(usuario?.password_usuario || '');
  const [showPassword, setMostrarContraseña] = useState<boolean>(false);
  const [showPasswordMatch, setMostrarConfirmarContraseña] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerShown: true,
      title: '',
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

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const createAccount = () => {
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
    })
    .catch(error => {
      Alert.alert(error.message);
    });
  }

  const handleCrearUsuario = async () => {
    try {
      const insertarUser = {
        nombre: nombre,
        apellido: apellido,
        telefono: parseFloat(telefono),
        correo: email,
        password_usuario: password
      };
      insertarUsuario(insertarUser);

      createAccount();
      Alert.alert('Usuario creado');

    } catch (error: any) {
      if (typeof error === 'string') {
        Alert.alert('Error al crear el usuario:', error);
      } else {
        Alert.alert('Error al crear el usuario:', 'Se produjo un error desconocido.');
      }
    }
    router.back();
  };

  const validarUsuario = (text: string) => {
    if (!/^[a-zA-Z]+$/.test(text.trim())) {
      setErrors(prevErrors => ({ ...prevErrors, usuario: 'El nombre debe contener solo letras' }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, usuario: '' }));
    }
    setUsuario(text);
    validateForm();
  };

  const validarApellido = (text: string) => {
    if (!/^[a-zA-Z]+$/.test(text.trim())) {
      setErrors(prevErrors => ({ ...prevErrors, apellido: 'El apellido debe contener solo letras' }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, apellido: '' }));
    }
    setApellido(text);
    validateForm();
  };

  const validarTelefono = (text: string) => {
    if (!/^\d+$/.test(text.trim())) {
      setErrors(prevErrors => ({ ...prevErrors, telefono: 'Complete el campo' }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, telefono: '' }));
    }
    setTelefono(text);
    validateForm();
  };

  const validarCorreo = (text: string) => {
    const emailValid = /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+\.[A-Za-z]{2,}$/;
    const trimmedEmail = text.trim();
    const invalidCharsRegex = /[^\w.+-@]/;
    if (/[A-Z]/.test(trimmedEmail)) {
      setErrors(prevErrors => ({ ...prevErrors, correo: 'Los correos electrónicos no deben contener letras mayúsculas.' }));
    } else if (!emailValid.test(trimmedEmail) || invalidCharsRegex.test(trimmedEmail)) {
      setErrors(prevErrors => ({ ...prevErrors, correo: 'Por favor, ingresa un correo electrónico válido' }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, correo: '' }));
    }
    setCorreo(text);
    validateForm();
  };

  const validarContraseña = (text: string) => {
    if (text.trim().length < 7) {
      setErrors(prevErrors => ({ ...prevErrors, contraseña: 'La contraseña debe tener al menos 7 caracteres' }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, contraseña: '' }));
    }
    setContraseña(text);
    validateForm();
  };

  const validarConfirmarContraseña = (text: string) => {
    if (text !== password) {
      setErrors(prevErrors => ({ ...prevErrors, confirmarContraseña: 'Las contraseñas no coinciden' }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, confirmarContraseña: '' }));
    }
    setConfirmarContraseña(text);
    validateForm();
  };

  const toggleMostrarContraseña = () => {
    setMostrarContraseña(!showPassword);
  };

  const toggleMostrarConfirmarContraseña = () => {
    setMostrarConfirmarContraseña(!showPasswordMatch);
  };

  const validateForm = () => {
    setIsFormValid(
      nombre.trim() !== '' &&
      apellido.trim() !== '' &&
      telefono.trim() !== '' &&
      email.trim() !== '' &&
      password.trim() !== '' &&
      passwordMatch === password &&
      Object.values(errors).every(error => error === '')
    );
  };

  useEffect(() => {
    validateForm();
  }, [nombre, apellido, telefono, email, password, passwordMatch, errors]);

  const SvgTop: React.FC = () => {
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
          x={150}
          y={42.5}
          width="195"
          height="195"
          href={require('./Imagen/logoBlanco.png')}
        />
      </Svg>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ marginHorizontal: -30, marginTop: -180 }}>
        <SvgTop />
      </View>
      <KeyboardAvoidingView style={styles.formContainer} behavior="padding">
        <ScrollView>
          <Text style={styles.label}>Nombre:</Text>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-circle" size={20} color="#777" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre"
                onChangeText={validarUsuario}
                value={nombre}
              />
            </View>
          </View>
          {errors.usuario && <Text style={styles.errorText}>{errors.usuario}</Text>}
          <Text style={styles.label}>Apellido:</Text>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-circle" size={20} color="#777" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Apellido"
                onChangeText={validarApellido}
                value={apellido}
              />
            </View>
          </View>
          {errors.apellido && <Text style={styles.errorText}>{errors.apellido}</Text>}
          <Text style={styles.label}>Teléfono:</Text>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons name="call-outline" size={20} color="#777" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Teléfono"
                onChangeText={validarTelefono}
                value={telefono}
                maxLength={10}
                keyboardType="phone-pad"
              />
            </View>
          </View>
          {errors.telefono && <Text style={styles.errorText}>{errors.telefono}</Text>}

          <Text style={styles.label}>Correo:</Text>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#777" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Correo"
                onChangeText={validarCorreo}
                value={email}
              />
            </View>
          </View>
          {errors.correo && <Text style={styles.errorText}>{errors.correo}</Text>}
          <Text style={styles.label}>Contraseña:</Text>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed" size={20} color="#777" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                onChangeText={validarContraseña}
                value={password}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={toggleMostrarContraseña}>
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="#777"
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
          </View>
          {errors.contraseña && <Text style={styles.errorText}>{errors.contraseña}</Text>}
          <Text style={styles.label}>Confirmar Contraseña:</Text>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed" size={20} color="#777" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Confirmar Contraseña"
                onChangeText={validarConfirmarContraseña}
                value={passwordMatch}
                secureTextEntry={!showPasswordMatch}
              />
              <TouchableOpacity onPress={toggleMostrarConfirmarContraseña}>
                <Ionicons
                  name={showPasswordMatch ? 'eye-off' : 'eye'}
                  size={20}
                  color="#777"
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
          </View>
          {errors.confirmarContraseña && <Text style={styles.errorText}>{errors.confirmarContraseña}</Text>}
          <TouchableOpacity
            style={[
              defaultStyles.btn,
              { 
                alignItems: 'center', 
                justifyContent: 'center', 
                alignContent: 'center', 
                backgroundColor: isFormValid ? '#E5332A' : '#E5332A80'
              }
            ]}
            onPress={handleCrearUsuario}
            disabled={!isFormValid}
          >
            <Text style={{ color: 'white', fontSize: 16 }}>Registrarse</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    marginTop: 150,
  },
  container1: {
    flex: 1,
    justifyContent: 'center',
  },
  formContainer: {
    flex: 5,
    width: '100%',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 30,
    backgroundColor: 'white',
    marginLeft: 25,
  },
  input: {
    flex: 1,
    height: 55,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 30
  },
  label: {
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 15,
  },
  icon: {
    marginHorizontal: 10,
    color: '#803530',
    backgroundColor: 'white'
  },
  button: {
    backgroundColor: '#E5332A',
    padding: 10,
    borderRadius: 10,
    marginRight: 45,
    marginLeft: 45
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButton: {
    marginLeft: 10,
  },
  errorText: {
    color: 'red',
    marginLeft: 15,
    marginBottom: 5,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 100,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 30,
    color: 'black',
    marginBottom: 10,
    width: '90%',
    backgroundColor: 'white',
    marginLeft: 25,
    height: 55
  },
});

export default Registro;
