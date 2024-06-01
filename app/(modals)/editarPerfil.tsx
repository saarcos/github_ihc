import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from 'expo-router';
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { app } from '../../firebase-config';
import Colors from '@/constants/Colors';
import { Svg, Path, Defs, LinearGradient, Stop} from 'react-native-svg';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Usuario, editarUsuario, obtenerIdUsuarioPorCorreo, obtenerUsuarioPorId, actualizarContraseñaUsuario } from '@/app/api/api';

const EditarPerfil: React.FC = () => {
  const navigation = useNavigation();
  const [nombre, setNombre] = useState<string>('');
  const [apellido, setApellido] = useState<string>('');
  const [telefono, setTelefono] = useState<string>('');
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [nombreValido, setNombreValido] = useState<boolean>(false);
  const [apellidoValido, setApellidoValido] = useState<boolean>(false);
  const [telefonoValido, setTelefonoValido] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [currentPasswordValida, setCurrentPasswordValida] = useState<boolean>(false);
  const [newPasswordValida, setNewPasswordValida] = useState<boolean>(false);

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

  useEffect(() => {
    const cargarDatosUsuario = async () => {
      const auth = getAuth(app);
      const currentUser = auth.currentUser;
      if (currentUser) {
        const correo = currentUser.email;
        setCurrentUserEmail(correo || '');
        if (correo) {
          const idUsuario = await obtenerIdUsuarioPorCorreo(correo);
          const usuario: Usuario | null = await obtenerUsuarioPorId(idUsuario);
          if (usuario) {
            let telefonoConCero = usuario.telefono ? usuario.telefono.toString() : '';
            if (!telefonoConCero.startsWith('0')) {
                telefonoConCero = '0' + telefonoConCero;
            }
            setNombre(usuario.nombre || '');
            setApellido(usuario.apellido || '');
            setTelefono(telefonoConCero);
            validarNombre(usuario.nombre || ''); 
            validarApellido(usuario.apellido || ''); 
            validarTelefono(telefonoConCero); 
          }
        }
      }
    };
    cargarDatosUsuario();
  }, []);
  

  const toggleOption = (option: string) => {
    setSelectedOption((prevOption) => (prevOption === option ? null : option));
  };

  const obtenerCorreoUsuario = (): string | null => {
    const auth = getAuth(app);
    const currentUser = auth.currentUser;
    if (currentUser) {
      return currentUser.email;
    } else {
      return null;
    }
  };

  const handleChangePassword = async () => {
    const auth = getAuth(app);
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const correo = obtenerCorreoUsuario();
        if (correo !== null) {
          const credential = EmailAuthProvider.credential(correo, currentPassword);
          await reauthenticateWithCredential(currentUser, credential);
          await updatePassword(currentUser, newPassword);
          const userId = await obtenerIdUsuarioPorCorreo(correo);
          const nuevaPassword = { password_usuario: newPassword };
          await actualizarContraseñaUsuario(userId, nuevaPassword);
          Alert.alert('Contraseña actualizada correctamente');
        } else {
          Alert.alert('No se pudo actualizar la contraseña');
        }
      } catch (error) {
        Alert.alert('La contraseña actual no coincide', 'Inténtelo nuevamente');
      }
    } else {
      Alert.alert('No hay un usuario actualmente autenticado');
    }
    setCurrentPassword('');
    setNewPassword('');
  };

  const handleChangeInfo = async () => {
    const auth = getAuth(app);
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const correo = obtenerCorreoUsuario();
        if (correo !== null) {
          const idUsuario = await obtenerIdUsuarioPorCorreo(correo);
          const modUsuario = {
            nombre: nombre,
            apellido: apellido,
            telefono: parseFloat(telefono),
          };
          await editarUsuario(idUsuario, modUsuario);
          Alert.alert('Tu perfil se actualizó correctamente');
        } else {
          Alert.alert('No se pudo obtener el correo del usuario');
        }
      } catch (error) {
        Alert.alert('Error al obtener el ID del usuario');
      }
    } else {
      Alert.alert('No hay un usuario actualmente autenticado');
    }
  };

  const validarNombre = (value: string) => {
    if (value.length < 3) {
      setNombreValido(false);
      setErrors((prevErrors) => ({ ...prevErrors, nombre: 'El nombre debe tener al menos 3 caracteres' }));
    } else if (!/^[a-zA-Z]+$/.test(value.trim())) {
      setNombreValido(false);
      setErrors((prevErrors) => ({ ...prevErrors, nombre: 'El nombre debe contener solo letras' }));
    } else {
      setNombreValido(true);
      setErrors((prevErrors) => ({ ...prevErrors, nombre: '' }));
    }
    setNombre(value);
  };

  const validarApellido = (value: string) => {
    if (value.length < 3) {
      setApellidoValido(false);
      setErrors((prevErrors) => ({ ...prevErrors, apellido: 'El apellido debe tener al menos 3 caracteres' }));
    } else if (!/^[a-zA-Z]+$/.test(value.trim())) {
      setApellidoValido(false);
      setErrors((prevErrors) => ({ ...prevErrors, apellido: 'El apellido debe contener solo letras' }));
    } else {
      setApellidoValido(true);
      setErrors((prevErrors) => ({ ...prevErrors, apellido: '' }));
    }
    setApellido(value);
  };

  const validarTelefono = (value: string) => {
    if (!value.startsWith('0')) {
        value = '0' + value;
    }
    if (!/^\d{10}$/.test(value)) {
      setTelefonoValido(false);
      setErrors((prevErrors) => ({ ...prevErrors, telefono: 'El teléfono debe contener exactamente 10 dígitos numéricos' }));
    } else {
      setTelefonoValido(true);
      setErrors((prevErrors) => ({ ...prevErrors, telefono: '' }));
    }
    setTelefono(value);
  };

  const validarCurrentPassword = (value: string) => {
    if (value.length < 7) {
      setCurrentPasswordValida(false);
      setErrors((prevErrors) => ({ ...prevErrors, currentPassword: 'La contraseña debe tener al menos 7 caracteres' }));
    } else {
      setCurrentPasswordValida(true);
      setErrors((prevErrors) => ({ ...prevErrors, currentPassword: '' }));
    }
    setCurrentPassword(value);
  };

  const validarNewPassword = (value: string) => {
    if (value.length < 7) {
      setNewPasswordValida(false);
      setErrors((prevErrors) => ({ ...prevErrors, newPassword: 'La contraseña debe tener al menos 7 caracteres' }));
    } else {
      setNewPasswordValida(true);
      setErrors((prevErrors) => ({ ...prevErrors, newPassword: '' }));
    }
    setNewPassword(value);
  };

  const renderOptionForm = (option: string) => {
    if (option === 'info') {
      return (
        <View style={styles.form}>
          <TextInput
            style={[styles.input, { backgroundColor: '#dddddd' }]}
            placeholder="Nombre"
            keyboardType="default"
            autoCapitalize="none"
            value={nombre}
            onChangeText={validarNombre}
          />
          <TextInput
            style={[styles.input, { backgroundColor: '#dddddd' }]}
            placeholder="Apellido"
            keyboardType="default"
            autoCapitalize="none"
            value={apellido}
            onChangeText={validarApellido}
          />
          <TextInput
            style={[styles.input, { backgroundColor: '#dddddd' }]}
            placeholder="Teléfono"
            keyboardType="phone-pad"
            autoCapitalize="none"
            value={telefono}
            maxLength={10}
            onChangeText={validarTelefono}
          />
        </View>
      );
    } else if (option === 'password') {
      return (
        <View style={styles.form}>
          <TextInput
            style={[styles.input, { backgroundColor: '#dddddd' }]}
            placeholder="Contraseña actual"
            secureTextEntry
            autoCapitalize="none"
            value={currentPassword}
            onChangeText={validarCurrentPassword}
          />
          <TextInput
            style={[styles.input, { backgroundColor: '#dddddd' }]}
            placeholder="Nueva contraseña"
            secureTextEntry
            autoCapitalize="none"
            value={newPassword}
            onChangeText={validarNewPassword}
          />
        </View>
      );
    }
    return null;
  };

  const handleUpdate = () => {
    if (selectedOption === 'info') {
      if (nombreValido && apellidoValido && telefonoValido) {
        handleChangeInfo();
      } else {
        Alert.alert('Por favor, completa todos los campos correctamente.');
      }
    } else if (selectedOption === 'password') {
      if (currentPasswordValida && newPasswordValida) {
        handleChangePassword();
      } else {
        Alert.alert('Por favor, ingresa contraseñas válidas.');
      }
    } else {
      Alert.alert('Por favor, selecciona una opción para actualizar.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.optionsContainer}>
        <TouchableOpacity onPress={() => toggleOption('info')} style={styles.option}>
          <FontAwesome5 name="envelope" size={24} color={selectedOption === 'info' ? Colors.primary : 'black'} />
          <Text style={styles.optionText}>Actualizar perfil</Text>
        </TouchableOpacity>
        {selectedOption === 'info' && (
          <>
            {renderOptionForm('info')}
            {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
            {errors.apellido && <Text style={styles.errorText}>{errors.apellido}</Text>}
            {errors.telefono && <Text style={styles.errorText}>{errors.telefono}</Text>}
          </>
        )}
        <TouchableOpacity onPress={() => toggleOption('password')} style={styles.option}>
          <FontAwesome5 name="key" size={24} color={selectedOption === 'password' ? Colors.primary : 'black'} />
          <Text style={styles.optionText}>Cambiar contraseña</Text>
        </TouchableOpacity>
        {selectedOption === 'password' && (
          <>
            {renderOptionForm('password')}
            {errors.currentPassword && <Text style={styles.errorText}>{errors.currentPassword}</Text>}
            {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}
          </>
        )}
      </View>
      <TouchableOpacity
        style={[
          styles.button,
          (selectedOption === 'info' && (!nombreValido || !apellidoValido || !telefonoValido)) ||
          (selectedOption === 'password' && (!currentPasswordValida || !newPasswordValida))
            ? styles.disabledButton
            : null,
        ]}
        onPress={handleUpdate}
        disabled={
          (selectedOption === 'info' && (!nombreValido || !apellidoValido || !telefonoValido)) ||
          (selectedOption === 'password' && (!currentPasswordValida || !newPasswordValida))
        }
      >
        <Text style={styles.buttonText}>Actualizar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    optionsContainer: {
        width: '100%',
        marginBottom: 20,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    optionText: {
        marginLeft: 10,
        fontSize: 16,
    },
    form: {
        marginTop: 20,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: Colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
    },
    disabledButton: {
        opacity: 0.5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
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

export default EditarPerfil;
