import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from 'expo-router';
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { app } from '../../firebase-config';
import Colors from '@/constants/Colors';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { editarUsuarioR, obtenerIdUsuarioRPorCorreo, actualizarContraseñaUsuarioR, Restaurante } from '@/app/api/api';

interface Props {
    restaurante?: Restaurante;
}

const EditarPerfil = ({ restaurante}: Props) => {

    const navigation = useNavigation();

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

    const [categoria_id, setCategoria_id] = useState(restaurante?.categoria_id ? restaurante.categoria_id.toString() : '');
    const [nombre, setNombre] = useState(restaurante?.nombre || '');
    const [direccion, setDireccion] = useState(restaurante?.direccion || '');
    const [foto, setFoto] = useState(restaurante?.foto || '');
    const [aforo, setAforo] = useState(restaurante?.aforo ? restaurante.aforo.toString() : '');
    const [horaapertura, setHoraapertura] = useState(restaurante?.horaApertura || '');
    const [horacierre, setHoracierre] = useState(restaurante?.horaCierre || '');

    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const [currentUserEmail, setCurrentUserEmail] = useState<string>('');

    const [categoriaValido, setCategoriaValido] = useState<boolean>(false);
    const [nombreValido, setNombreValido] = useState<boolean>(false);
    const [direccionValido, setDireccionValido] = useState<boolean>(false);
    const [fotoValido, setFotoValido] = useState<boolean>(false);
    const [aforoValido, setAforoValido] = useState<boolean>(false);
    const [horaaperturaValido, setHoraaperturaValido] = useState<boolean>(false);
    const [horacierreValido, setHoracierreValido] = useState<boolean>(false);
    const [currentPasswordValida, setCurrentPasswordValida] = useState<boolean>(false);
    const [newPasswordValida, setNewPasswordValida] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    type Option = "info" | "password";

    useEffect(() => {
        const auth = getAuth(app);
        const currentUser = auth.currentUser;
        if (currentUser) {
            setCurrentUserEmail(currentUser.email || '');
        }
    }, []);

    const toggleOption = (option: Option) => {
        setSelectedOption((prevOption) => (prevOption === option ? null : option));
    };

    const obtenerCorreoUsuario = () => {
        const auth = getAuth(app);
        const currentUser = auth.currentUser;
        if (currentUser) {
            const correo = currentUser.email;
            return correo;
        } else {
            return null;
        }
    };

    const handleChangePassword = async () => {
        const auth = getAuth(app);
        const currentUser = auth.currentUser;
        if (currentUser) {
            try {
                const correo = await obtenerCorreoUsuario();
                if (correo !== null) {
                    const credential = EmailAuthProvider.credential(correo, currentPassword);
                    await reauthenticateWithCredential(currentUser, credential);
                    await updatePassword(currentUser, newPassword);
                    const userId = await obtenerIdUsuarioRPorCorreo(correo);
                    const nuevaPassword = {
                        password_restaurante: newPassword
                    };
                    await actualizarContraseñaUsuarioR(userId, nuevaPassword);
                    Alert.alert('Contraseña actualizada correctamente');
                } else {
                    Alert.alert('No se pudo actualizar la contraseña');
                }
            } catch (error) {
                Alert.alert(
                    'La contraseña actual no coincide',
                    'Inténtelo nuevamente',
                    [
                      { text: 'OK', onPress: () => console.log('OK Pressed') }
                    ],
                    { cancelable: false }
                );
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
                const correo = await obtenerCorreoUsuario();
                if (correo !== null) {
                    const idUsuario = await obtenerIdUsuarioRPorCorreo(correo);
                    const modUsuario = {
                        categoria_id: parseFloat(categoria_id),
                        nombre: nombre,
                        direccion: direccion,
                        foto: foto,
                        aforo: parseFloat(aforo),
                        horaApertura: horaapertura,
                        horaCierre: horacierre

                    };
                    editarUsuarioR(idUsuario, modUsuario);
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
        setNombre('');
        setDireccion('');
        setCategoria_id('');
        setFoto('');
        setAforo('');
        setHoraapertura('');
        setHoracierre('');
    };

    const validarCategoria = (value: string) => {
        if (!/^\d+$/.test(value)) {
            setCategoriaValido(false);
            setErrors(prevErrors => ({ ...prevErrors, categoria_id: 'La categoría debe ser un número' }));
        } else {
            setCategoriaValido(true);
            setErrors(prevErrors => ({ ...prevErrors, categoria_id: '' }));
        }
        setCategoria_id(value);
    };
    const validarNombre = (value: string) => {
        if (value.trim() === '') {
            setNombreValido(false);
            setErrors(prevErrors => ({ ...prevErrors, nombre: 'Por favor ingresa un nombre' }));
        } else {
            setNombreValido(true);
            setErrors(prevErrors => ({ ...prevErrors, nombre: '' }));
        }
        setNombre(value);
    };

    const validarDireccion = (value: string) => {
        if (value.trim() === '') {
            setDireccionValido(false);
            setErrors(prevErrors => ({ ...prevErrors, direccion: 'Por favor ingresa una dirección' }));
        } else {
            setDireccionValido(true);
            setErrors(prevErrors => ({ ...prevErrors, direccion: '' }));
        }
        setDireccion(value);
    };
    const validarFoto = (value: string) => {
        if (value.trim() === '') {
            setFotoValido(false);
            setErrors(prevErrors => ({ ...prevErrors, foto: 'Por favor ingresa una URL de foto' }));
        } else {
            setFotoValido(true);
            setErrors(prevErrors => ({ ...prevErrors, foto: '' }));
        }
        setFoto(value);
    };
    const validarApertura = (value: string) => {
        if (value.trim() === '') {
            setHoraaperturaValido(false);
            setErrors(prevErrors => ({ ...prevErrors, horaapertura: 'Por favor ingresa una hora de apertura' }));
        } else {
            setHoraaperturaValido(true);
            setErrors(prevErrors => ({ ...prevErrors, horaapertura: '' }));
        }
        setHoraapertura(value);
    };
    const validarCierre = (value: string) => {
        if (value.trim() === '') {
            setHoracierreValido(false);
            setErrors(prevErrors => ({ ...prevErrors, horacierre: 'Por favor ingresa una hora de cierre' }));
        } else {
            setHoracierreValido(true);
            setErrors(prevErrors => ({ ...prevErrors, horacierre: '' }));
        }
        setHoracierre(value);
    };

    const validarAforo = (value: string) => {
        if (value.trim() === '') {
            setAforoValido(false);
            setErrors(prevErrors => ({ ...prevErrors, aforo: 'Por favor ingresa el aforo' }));
        } else if (!/^\d+$/.test(value)) {
            setAforoValido(false);
            setErrors(prevErrors => ({ ...prevErrors, aforo: 'El aforo debe ser un número entero positivo' }));
        } else {
            setAforoValido(true);
            setErrors(prevErrors => ({ ...prevErrors, aforo: '' }));
        }
        setAforo(value);
    };

    const validarCurrentPassword = (value: string) => {
        if (value.length < 7) {
            setCurrentPasswordValida(false);
            setErrors(prevErrors => ({ ...prevErrors, currentPassword: 'La contraseña debe tener al menos 7 caracteres' }));
        } else {
            setCurrentPasswordValida(true);
            setErrors(prevErrors => ({ ...prevErrors, currentPassword: '' }));
        }
        setCurrentPassword(value);
    };
    
    const validarNewPassword = (value: string) => {
        if (value.length < 7) {
            setNewPasswordValida(false);
            setErrors(prevErrors => ({ ...prevErrors, newPassword: 'La contraseña debe tener al menos 7 caracteres' }));
        } else {
            setNewPasswordValida(true);
            setErrors(prevErrors => ({ ...prevErrors, newPassword: '' }));
        }
        setNewPassword(value);
    };
    

    const renderOptionForm = (option: Option) => {
        if (option === 'info') {
            return (
                <View style={styles.form}>
                    <TextInput
                        style={[styles.input, { backgroundColor: '#dddddd' }]}
                        placeholder="Categoria"
                        keyboardType="default"
                        autoCapitalize="none"
                        value={categoria_id}
                        onChangeText={validarCategoria}
                    />
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
                        placeholder="Dirección"
                        keyboardType="default"
                        autoCapitalize="none"
                        value={direccion}
                        onChangeText={validarDireccion}
                    />
                    <TextInput
                        style={[styles.input, { backgroundColor: '#dddddd' }]}
                        placeholder="Foto"
                        keyboardType="default"
                        autoCapitalize="none"
                        value={foto}
                        onChangeText={validarFoto}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Aforo"
                        keyboardType="phone-pad"
                        autoCapitalize="none"
                        value={aforo}
                        onChangeText={validarAforo}
                    />
                    <TextInput
                        style={[styles.input, { backgroundColor: '#dddddd' }]}
                        placeholder="Apertura"
                        keyboardType="default"
                        autoCapitalize="none"
                        value={horaapertura}
                        onChangeText={validarApertura}
                    />
                    <TextInput
                        style={[styles.input, { backgroundColor: '#dddddd' }]}
                        placeholder="Cierre"
                        keyboardType="default"
                        autoCapitalize="none"
                        value={horacierre}
                        onChangeText={validarCierre}
                    />
                </View>
            );
        } else if (option === 'password') {
            return (
                <View style={styles.form}>
                    <TextInput style={styles.input} placeholder="Contraseña actual" value={currentPassword} secureTextEntry={true} onChangeText={validarCurrentPassword} />
                    <TextInput style={styles.input} placeholder="Nueva contraseña" value={newPassword} secureTextEntry={true} onChangeText={validarNewPassword} />
                </View>
            );
        }
        return null;
    };

    const handleUpdate = () => {
        setSelectedOption(null);
        if (selectedOption === 'info') {
            if (categoriaValido && nombreValido && direccionValido && fotoValido && aforoValido && horaaperturaValido && horacierreValido) {
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

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

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
                        {errors.categoria_id && <Text style={styles.errorText}>{errors.categoria_id}</Text>}
                        {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
                        {errors.direccion && <Text style={styles.errorText}>{errors.direccion}</Text>}
                        {errors.foto && <Text style={styles.errorText}>{errors.foto}</Text>}
                        {errors.aforo && <Text style={styles.errorText}>{errors.aforo}</Text>}
                        {errors.horaapertura && <Text style={styles.errorText}>{errors.horaapertura}</Text>}
                        {errors.horacierre && <Text style={styles.errorText}>{errors.horacierre}</Text>}
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
                style={[styles.button, 
                    (selectedOption === 'info' && (!categoriaValido || !nombreValido || !direccionValido || !fotoValido || !aforoValido || !horaaperturaValido || !horacierreValido)) ||
                    (selectedOption === 'password' && (!currentPasswordValida || !newPasswordValida)) ? styles.disabledButton : null]}
                onPress={handleUpdate}
                disabled={
                    (selectedOption === 'info' && (!categoriaValido || !nombreValido || !direccionValido || !fotoValido || !aforoValido || !horaaperturaValido || !horacierreValido)) ||
                    (selectedOption === 'password' && (!currentPasswordValida || !newPasswordValida))
                }>
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
