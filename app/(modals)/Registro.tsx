import React, { useState, useLayoutEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Alert } from 'react-native';
import { defaultStyles } from '@/constants/Styles';
import RNPickerSelect from 'react-native-picker-select';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Svg, Path, Defs, LinearGradient, Stop, Image } from 'react-native-svg';
import { Link } from 'expo-router'; // Importa Link desde expo-router
import { Ionicons } from '@expo/vector-icons';
const Registro: React.FC = () => {
  const [usuario, setUsuario] = useState<string>('');
  const [tipoUsuario, setTipoUsuario] = useState<string>('');
  const [apellido, setApellido] = useState<string>('');
  const [telefono, setTelefono] = useState<string>('');
  const [correo, setCorreo] = useState<string>('');
  const [contraseña, setContraseña] = useState<string>('');
  const [confirmarContraseña, setConfirmarContraseña] = useState<string>('');
  const [mostrarContraseña, setMostrarContraseña] = useState<boolean>(false);
  const [mostrarConfirmarContraseña, setMostrarConfirmarContraseña] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const navigation=useNavigation();
  useLayoutEffect(()=>{
    navigation.setOptions({
      headerShown:false,
    })
  })
  const validarUsuario = (text: string) => {
    if (!/^[a-zA-Z]+$/.test(text.trim())) {
      setErrors(prevErrors => ({ ...prevErrors, usuario: 'El nombre debe contener solo letras' }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, usuario: '' }));
    }
    setUsuario(text);
  };

  const validarApellido = (text: string) => {
    if (!/^[a-zA-Z]+$/.test(text.trim())) {
      setErrors(prevErrors => ({ ...prevErrors, apellido: 'El apellido debe contener solo letras' }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, apellido: '' }));
    }
    setApellido(text);
  };

  const validarTipoUsuario = (value: string) => {
    if (!value || value.trim() === '') {
      setErrors(prevErrors => ({ ...prevErrors, tipoUsuario: 'Debe seleccionar un tipo de usuario' }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, tipoUsuario: '' }));
    }
    setTipoUsuario(value);
  };

  const validarTelefono = (text: string) => {
    if (!/^\d+$/.test(text.trim())) {
      setErrors(prevErrors => ({ ...prevErrors, telefono: 'Complete el campo' }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, telefono: '' }));
    }
    setTelefono(text);
  };

  const validarCorreo = (text: string) => {
    if (!/\S+@\S+\.\S+/.test(text.trim())) {
      setErrors(prevErrors => ({ ...prevErrors, correo: 'Ingrese un correo electrónico válido' }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, correo: '' }));
    }
    setCorreo(text);
  };

  const validarContraseña = (text: string) => {
    if (text.trim().length < 8) {
      setErrors(prevErrors => ({ ...prevErrors, contraseña: 'La contraseña debe tener al menos 8 caracteres' }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, contraseña: '' }));
    }
    setContraseña(text);
  };

  const validarConfirmarContraseña = (text: string) => {
    if (text !== contraseña) {
      setErrors(prevErrors => ({ ...prevErrors, confirmarContraseña: 'Las contraseñas no coinciden' }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, confirmarContraseña: '' }));
    }
    setConfirmarContraseña(text);
  };

  const handleRegistro = () => {
    // Aquí puedes realizar la validación final antes de enviar el formulario
    // Esta función se llamará cuando el usuario presione el botón de registro

    // Simulando una validación exitosa
    if (usuario && apellido && tipoUsuario && telefono && correo && contraseña && confirmarContraseña) {
      // Si todas las validaciones pasan, mostrar el mensaje de ingreso exitoso
      Alert.alert(
        'Ingreso exitoso',
        '¡Tu registro ha sido exitoso!',
        [
          { text: 'Aceptar', onPress: () => console.log('Registro exitoso') }
        ],
        { cancelable: false }
      );
      
    }
  };

  const toggleMostrarContraseña = () => {
    setMostrarContraseña(!mostrarContraseña);
  };

  const toggleMostrarConfirmarContraseña = () => {
    setMostrarConfirmarContraseña(!mostrarConfirmarContraseña);
  };

  const SvgTop: React.FC = () => {
    return (
      <Svg
        width={600}
        height={760}
        fill="none"
      >
        <Path
          fill="url(#a)"
          d="M0 361.705V0h500v361.705c-209.843 105.578-420.768 43.991-500 0Z"
          fillOpacity={0.5}
        />
        <Path
          fill="url(#a)"
          d="M0 361.705V0h500v361.705c-209.843 105.578-420.768 1.1-9 0Z"
        />
        <Defs>
          <LinearGradient
            id="a"
            x1={400}
            x2={0}
            y1={0}
            y2={360.557}
            gradientUnits="userSpaceOnUse"
          >
            <Stop stopColor="#803530" />
            <Stop offset={0.47} stopColor="#E5332A" />
            <Stop offset={1} stopColor="#E5332A" />
          </LinearGradient>
        </Defs>
        <Image
          x="225"
          y="200"
          width="165"
          height="165"
          href={require('./Imagen/logoBlanco.png')}
        />
      </Svg>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.container1}>
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
                value={usuario}
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
                keyboardType="phone-pad" // Aquí establecemos el tipo de teclado como teléfono
              />
            </View>
          </View>
          {errors.telefono && <Text style={styles.errorText}>{errors.telefono}</Text>}
          <Text style={styles.label}>Tipo de Usuario:</Text>
          <RNPickerSelect
            onValueChange={validarTipoUsuario}
            items={[
              { label: 'Estudiante', value: 'estudiante' },
              { label: 'Restaurante', value: 'restaurante' },
            ]}
            style={pickerSelectStyles}
            value={tipoUsuario}
            useNativeAndroidPickerStyle={false}
          />
          {errors.tipoUsuario && <Text style={styles.errorText}>{errors.tipoUsuario}</Text>}
          <Text style={styles.label}>Correo:</Text>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#777" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Correo"
                onChangeText={validarCorreo}
                value={correo}
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
                value={contraseña}
                secureTextEntry={!mostrarContraseña} // Usa secureTextEntry basado en mostrarContraseña
              />
              <TouchableOpacity onPress={toggleMostrarContraseña}>
                <Ionicons
                  name={mostrarContraseña ? 'eye-off' : 'eye'}
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
                value={confirmarContraseña}
                secureTextEntry={!mostrarConfirmarContraseña} // Usa secureTextEntry basado en mostrarContraseña
              />
              <TouchableOpacity onPress={toggleMostrarConfirmarContraseña}>
                <Ionicons
                  name={mostrarConfirmarContraseña ? 'eye-off' : 'eye'}
                  size={20}
                  color="#777"
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
          </View>
          {errors.confirmarContraseña && <Text style={styles.errorText}>{errors.confirmarContraseña}</Text>}
            {/* <Link href="/(tabs)/perfil" style={[defaultStyles.btn, { textAlign: 'center', alignItems:'center', justifyContent:'center', alignContent:'center'}]} onPress={handleRegistro}>
              <Text style={{color:'white', fontSize:16}}>Registrarse</Text>
            </Link> */}
            <TouchableOpacity style={[defaultStyles.btn, { alignItems: 'center', justifyContent: 'center', alignContent: 'center' }]} onPress={handleRegistro}>
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
    borderRadius:30

    
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
