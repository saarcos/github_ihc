import React, { useState, useLayoutEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Alert } from 'react-native';
import { defaultStyles } from '@/constants/Styles';
import RNPickerSelect from 'react-native-picker-select';
import { Image, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import * as ImagePicker from 'expo-image-picker'; // Para Expo
import { storage } from "@/firebase-config";
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { Svg, Path, Defs, LinearGradient, Stop, Image as SvgImage } from 'react-native-svg';
import { Link, useRouter } from 'expo-router';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { firebaseConfig } from 'firebase-config';
import { Restaurante, insertarRestaurante } from '@/app/api/api';
import { format } from 'date-fns';
import { Colors } from 'react-native/Libraries/NewAppScreen';

interface Props {
  restaurante?: Restaurante;
}

const Registro = ({ restaurante }: Props) => {



  const router = useRouter();
  const [categoria, setcategoriaRestaurante] = useState(restaurante?.categoria_id ? restaurante.categoria_id.toString() : '');
  const [nombreRestaurante, setNombreRestaurante] = useState(restaurante?.nombre || '');
  const [email, setCorreo] = useState(restaurante?.correo || '');
  const [password, setContraseña] = useState(restaurante?.password_restaurante || '');
  const [passwordMatch, setConfirmarContraseña] = useState(restaurante?.password_restaurante || '');
  const [direccion, setDireccion] = useState(restaurante?.direccion || '');
  const [foto, setfoto] = useState(restaurante?.foto || '');
  const [aforo, setAforo] = useState(restaurante?.aforo ? restaurante.aforo.toString() : '');
  const [ingresarHoraA, setIngresarHoraA] = useState<boolean>(true); // Estado para controlar si se debe mostrar el mensaje de ingresar la hora
  const [ingresarHoraC, setIngresarHoraC] = useState<boolean>(true); // Estado para controlar si se debe mostrar el mensaje de ingresar la hora
  const [horaapertura, setHoraapertura] = useState(restaurante?.horaApertura ? new Date(restaurante.horaApertura) : new Date());
  const [horacierre, setHoracierre] = useState(restaurante?.horaCierre ? new Date(restaurante.horaCierre) : new Date());
  const [showPassword, setMostrarContraseña] = useState<boolean>(false);
  const [showPasswordMatch, setMostrarConfirmarContraseña] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});


  const navigation = useNavigation(); // Obtiene la navegación

  const handlePress = () => {
    // Navega hacia atrás cuando se presiona el componente SVG
    navigation.goBack();
  };

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
        Alert.alert('Error', error.message); // Usar error.message en lugar de error
      })
  }

  const handleCrearRestaurante = async () => {
    try {
      const direccionConcatenada = `${nombreRestaurante}, ${direccion}`;
      const insertarRestaurantes = {
        categoria_id: parseFloat(categoria),
        nombre: nombreRestaurante,
        correo: email,
        password_restaurante: password,
        direccion: direccionConcatenada,
        foto: foto,
        aforo: parseFloat(aforo),
        horaApertura: format(horaapertura, 'HH:mm'),
        horaCierre: format(horacierre, 'HH:mm')
      };
      console.log(insertarRestaurantes)
      insertarRestaurante(insertarRestaurantes);

      createAccount();
      Alert.alert('Restaurante creado');

    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'Se produjo un error desconocido.');
      }
    }
    router.back();
  };

  const validarCategoriaRestaurante = (text: string) => {
    if (!text.trim()) {
      setErrors(prevErrors => ({ ...prevErrors, categoriaRestaurante: 'La categoria del restaurante es requerido' }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, categoriaRestaurante: '' }));
    }
    setcategoriaRestaurante(text);
  };
  const dateTimePickerStyle = Platform.OS === 'android' ? {
    backgroundColor: 'red', // Cambia el color de fondo para Android


  } : {
    // Define estilos adicionales para otras plataformas si es necesario
  };
  const validarAforo = (text: string) => {
    if (!text.trim()) {
      setErrors(prevErrors => ({ ...prevErrors, foto: 'El aforo es requerido' }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, foto: '' }));
    }
    setAforo(text);
  };
  const capitalizeWords = (text: string): string => {
    return text.replace(/\b\w/g, (char: string) => char.toUpperCase());
  };

  const validarNombreRestaurante = (text: string) => {
    if (!text.trim()) {
      setErrors(prevErrors => ({ ...prevErrors, nombreRestaurante: 'El nombre del restaurante es requerido' }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, nombreRestaurante: '' }));
    }
    const formattedText = capitalizeWords(text);
    setNombreRestaurante(formattedText);
  };


  const validarDireccion = (text: string) => {
    if (!text.trim()) {
      setErrors(prevErrors => ({ ...prevErrors, direccion: 'La dirección es requerida' }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, direccion: '' }));
    }
    setDireccion(text);
  };


  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setfoto(result.assets[0].uri);
      // upload the image
      await uploadImage(result.assets[0].uri);
    }
  }
  async function uploadImage(uri: string) {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, "Img/" + new Date().getTime());
    const uploadTask = uploadBytesResumable(storageRef, blob);

    // listen for events
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (errors) => {
        // handle error
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log("File available at", downloadURL);
          // save record
          setfoto(downloadURL);
        });
      }
    );
  }

  const validarCorreo = (text: string) => {
    const originalText = text;
    const filteredText = text.replace(/\s+/g, '');

    if (/[A-Z]/.test(originalText)) {
      setErrors(prevErrors => ({ ...prevErrors, correo: 'No se permite el ingreso de mayúsculas' }));
    } else if (!/\S+@\S+\.\S+/.test(filteredText)) {
      setErrors(prevErrors => ({ ...prevErrors, correo: 'Ingrese un correo electrónico válido' }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, correo: '' }));
    }

    setCorreo(filteredText.replace(/[A-Z]/g, ''));
  };

  const validarContraseña = (text: string) => {
    if (text.trim().length < 7) {
      setErrors(prevErrors => ({ ...prevErrors, contraseña: 'La contraseña debe tener al menos 7 caracteres' }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, contraseña: '' }));
    }
    setContraseña(text);
  };

  const validarConfirmarContraseña = (text: string) => {
    if (text !== password) {
      setErrors(prevErrors => ({ ...prevErrors, confirmarContraseña: 'Las contraseñas no coinciden' }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, confirmarContraseña: '' }));
    }
    setConfirmarContraseña(text);
  };


  const [showAperturaPicker, setShowAperturaPicker] = useState(false);
  const [showCierrePicker, setShowCierrePicker] = useState(false);

  // Función para manejar el cambio de hora de apertura
  const onChangeApertura = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || horaapertura;
    setShowAperturaPicker(false); // Ocultar el selector de hora de apertura
    setHoraapertura(currentDate); // Actualizar el estado de la hora de apertura
    setIngresarHoraA(false); // Después de ingresar la hora, cambiar el estado para dejar de mostrar el mensaje
  };

  // Función para manejar el cambio de hora de cierre
  const onChangeCierre = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || horacierre;
    setShowCierrePicker(false); // Ocultar el selector de hora de cierre
    setHoracierre(currentDate); // Actualizar el estado de la hora de cierre
    setIngresarHoraC(false); // Después de ingresar la hora, cambiar el estado para dejar de mostrar el mensaje
  };
  const handleIngresarHora = () => {
    setIngresarHoraA(false); // Después de hacer clic, cambiar el estado para dejar de mostrar el mensaje
    setShowAperturaPicker(true); // Mostrar el selector de hora de apertura
  };
  const handleCierreHora = () => {
    setIngresarHoraC(false); // Después de hacer clic, cambiar el estado para dejar de mostrar el mensaje
    setShowCierrePicker(true); // Mostrar el selector de hora de apertura
  };


  const toggleMostrarContraseña = () => {
    setMostrarContraseña(!showPassword);
  };

  const toggleMostrarConfirmarContraseña = () => {
    setMostrarConfirmarContraseña(!showPasswordMatch);
  };

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
        <SvgImage
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
          <Text style={styles.label}>Ingrese foto del Restaurante:</Text>
          {restaurante ? <View style={{ height: 200, margin: 10, position: 'relative' }}>
            {foto ? <Image source={{ uri: foto }} style={{ width: 230, height: 200 }} /> : null}
            <TouchableOpacity style={[styles.btnCamera, { position: 'absolute', bottom: 0, right: 0, margin: 10 }]} onPress={pickImage}>
              <AntDesign name="camera" size={24} color="white" />
            </TouchableOpacity>
          </View> :
            <View style={{ margin: 60 }}>
              {foto ? <Image source={{ uri: foto }} style={{ width: 230, height: 200 }} /> : <TouchableOpacity style={styles.btnCameraPlus} onPress={pickImage} >
                <MaterialIcons name="add-a-photo" size={94} color="gray" />
              </TouchableOpacity>}

            </View>}
          <Text style={styles.label}>Categoria del Restaurante:</Text>
          <View style={styles.inputContainer}>
            {/* Utiliza RNPickerSelect en lugar de TextInput */}
            <View style={styles.inputWrapper}>
              <Ionicons name="apps" size={20} color="#777" style={styles.icon} />
              <RNPickerSelect
                style={pickerSelectStyles}
                placeholder={{
                  label: 'Seleccionar categoría',
                  value: null,
                }}
                onValueChange={(value) => validarCategoriaRestaurante(value)}
                items={[
                  { label: 'Comida Rapida', value: '1' },
                  { label: 'Mariscos', value: '19' },
                  { label: 'Sushi', value: '21' },
                  { label: 'Mexicana', value: '23' },
                  // Agrega más opciones según sea necesario
                ]}
              />
            </View>
          </View>
          {errors.categoriaRestaurante && <Text style={styles.errorText}>{errors.categoriaRestaurante}</Text>}
          <Text style={styles.label}>Nombre de Restaurante:</Text>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons name="restaurant" size={20} color="#777" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre de Restaurante"
                onChangeText={validarNombreRestaurante}
                value={nombreRestaurante}
              />
            </View>
          </View>
          {errors.nombreRestaurante && <Text style={styles.errorText}>{errors.nombreRestaurante}</Text>}
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
          <Text style={styles.label}>Dirección:</Text>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons name="location-outline" size={20} color="#777" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Dirección"
                onChangeText={validarDireccion}
                value={direccion}
              />
            </View>
          </View>
          {errors.direccion && <Text style={styles.errorText}>{errors.direccion}</Text>}


          <Text style={styles.label}>Aforo:</Text>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons name="people" size={20} color="#777" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Aforo del Restaurante"
                onChangeText={validarAforo}
                keyboardType="numeric"
                value={aforo}
              />
            </View>
          </View>
          {errors.aforo && <Text style={styles.errorText}>{errors.aforo}</Text>}

          <View style={styles.horasContainer}>
            <View style={styles.horaContainer}>
              <Text style={styles.label2}>Hora de Apertura:</Text>
              <View style={styles.inputWrapper2}>
                <TouchableOpacity style={styles.inputContainer} onPress={handleIngresarHora}>
                  <Ionicons name="time" size={20} color="#777" style={styles.icon2} />
                  <Text style={styles.horaInput}>
                    {ingresarHoraA ? 'HH:MM Am' : format(horaapertura, 'HH:mm')}
                  </Text>
                </TouchableOpacity>
                {showAperturaPicker && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={horaapertura}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={onChangeApertura}
                    style={dateTimePickerStyle} // Aplica el estilo condicionalmente
                  />
                )}
              </View>
            </View>
            <View style={styles.horaContainer}>
              <Text style={styles.label2}>Hora de Cierre:</Text>
              <View style={styles.inputWrapper2}>
                <TouchableOpacity style={styles.inputContainer} onPress={handleCierreHora}>
                  <Ionicons name="time" size={20} color="#777" style={styles.icon2} />
                  <Text style={styles.horaInput}>
                    {ingresarHoraC ? 'HH:MM Pm' : format(horacierre, 'HH:mm')}
                  </Text>
                </TouchableOpacity>
                {showCierrePicker && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={horacierre}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={onChangeCierre}
                    style={dateTimePickerStyle} // Aplica el estilo condicionalmente
                  />
                )}
              </View>
            </View>
          </View>




          <TouchableOpacity style={[defaultStyles.btn, { alignItems: 'center', justifyContent: 'center', alignContent: 'center' }]} onPress={handleCrearRestaurante}>
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
  label2: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  inputWrapper2: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 30,
    backgroundColor: 'white',
    height: 55,

  },
  horasContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,

  },
  horaContainer: {
    flex: 1,
    marginRight: 10,
  },
  horaInput: {
    flexDirection: 'row',
    alignItems: 'center',
    color: 'gray'
  },
  icon2: {
    marginRight: 10, // Espacio entre el icono y el texto de la hora
    marginTop: 5,
    color: '#803530',

  },
  backButton: {
    padding: 10,
    borderRadius: 5,
    
    // Otros estilos que puedas tener
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
  btnCamera: {
    width: 50,
    height: 50,
    backgroundColor: '#E5332A',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnCameraPlus: {
    width: 250,
    height: 250,
    backgroundColor: '#E4E4E5',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center'
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
    borderRadius: 15,
    marginRight: 20,
    marginLeft: 30
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
  backIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
  },


});
const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 140,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 30,
    color: 'black',
    marginBottom: 10,
    width: '90%',
    backgroundColor: 'white',
    marginLeft: 0,
    height: 55

  },
  
});

export default Registro;