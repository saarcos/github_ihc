import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { app, storage } from '../../firebase-config';
import { Picker } from '@react-native-picker/picker';
import { AntDesign, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { editarUsuarioR, obtenerIdUsuarioRPorCorreo, actualizarContraseñaUsuarioR, Restaurante } from '@/app/api/api';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Colors from '@/constants/Colors';

interface Props {
    restaurante?: Restaurante;
}

const EditarPerfil = ({ restaurante }: Props) => {

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
    const [horaapertura, setHoraapertura] = useState(restaurante?.horaApertura ? new Date(restaurante.horaApertura) : new Date());
    const [horacierre, setHoracierre] = useState(restaurante?.horaCierre ? new Date(restaurante.horaCierre) : new Date());

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

    async function pickImage() {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [5, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setFoto(result.assets[0].uri);
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
                    setFoto(downloadURL);
                });
            }
        );
    }

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
                        horaApertura: format(horaapertura, 'HH:mm'),
                        horaCierre: format(horacierre, 'HH:mm')
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
        setHoraapertura(new Date()); // Reiniciar a una nueva fecha
        setHoracierre(new Date()); // Reiniciar a una nueva fecha
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
    const validarApertura = (selectedDate: Date | undefined) => {
        if (!selectedDate) {
            setHoraaperturaValido(false);
            setErrors(prevErrors => ({ ...prevErrors, horaapertura: 'Por favor ingresa una hora de apertura' }));
        } else {
            const horaAperturaString = selectedDate.toLocaleTimeString();
            setHoraaperturaValido(true);
            setErrors(prevErrors => ({ ...prevErrors, horaapertura: '' }));
            setHoraapertura(selectedDate);
        }
    };

    const validarCierre = (selectedDate: Date | undefined) => {
        if (!selectedDate) {
            setHoracierreValido(false);
            setErrors(prevErrors => ({ ...prevErrors, horacierre: 'Por favor ingresa una hora de cierre' }));
        } else {
            const horaCierreString = selectedDate.toLocaleTimeString();
            setHoracierreValido(true);
            setErrors(prevErrors => ({ ...prevErrors, horacierre: '' }));
            setHoracierre(selectedDate);
        }
    };
    const handleIngresarHora = () => {
        setHoraaperturaValido(true); // Después de hacer clic, cambiar el estado para dejar de mostrar el mensaje
        setShowAperturaPicker(true); // Mostrar el selector de hora de apertura
    };
    const handleCierreHora = () => {
        setHoracierreValido(true); // Después de hacer clic, cambiar el estado para dejar de mostrar el mensaje
        setShowCierrePicker(true); // Mostrar el selector de hora de apertura
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


    const [showAperturaPicker, setShowAperturaPicker] = useState(false);
    const [showCierrePicker, setShowCierrePicker] = useState(false);
    const onChangeApertura = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || horaapertura;
        setShowAperturaPicker(false); // Ocultar el selector de hora de apertura
        validarApertura(currentDate); // Validar la hora de apertura seleccionada
        setHoraaperturaValido(false); // Después de ingresar la hora, cambiar el estado para dejar de mostrar el mensaje

    };

    // Función para manejar el cambio de hora de cierre
    const onChangeCierre = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || horacierre;
        setShowCierrePicker(false); // Ocultar el selector de hora de cierre
        validarCierre(currentDate); // Validar la hora de cierre seleccionada
        setHoracierreValido(false); // Después de ingresar la hora, cambiar el estado para dejar de mostrar el mensaje

    };

    const renderOptionForm = (option: Option) => {
        if (option === 'info') {
            return (
                
                <View style={styles.form}>
                    <Picker
                        selectedValue={categoria_id}
                        style={[styles.input, { backgroundColor: '#dddddd' }]}
                        onValueChange={(itemValue: string, itemIndex: number) => validarCategoria(itemValue)}
                    >
                        <Picker.Item label="Seleccione una categoría" value="" />
                        <Picker.Item label="Comida Rapida" value="1" />
                        <Picker.Item label="Mariscos" value="19" />
                        <Picker.Item label="Sushi" value="21" />
                        <Picker.Item label="Mexicana" value="23" />
                    </Picker>
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
                    <Text style={styles.label}>Ingrese foto del Restaurante:</Text>
                    {restaurante ? <View style={{ height: 200, margin: 10, position: 'relative' }}>
                        {foto ? <Image source={{ uri: foto }} style={{ width: 230, height: 200 }} /> : null}
                        <TouchableOpacity style={[styles.btnCamera, { position: 'absolute', bottom: 0, right: 0, margin: 10 }]} onPress={pickImage}>
                            <AntDesign name="camera" size={24} color="white" />
                        </TouchableOpacity>
                    </View> :
                        <View style={{ marginTop: 5, alignItems:'center'}}>
                            {foto ? <Image source={{ uri: foto }} style={{ width: 230, height: 200 }} /> : <TouchableOpacity style={styles.btnCameraPlus} onPress={pickImage} >
                                <MaterialIcons name="add-a-photo" size={94} color="gray" />
                            </TouchableOpacity>}

                        </View>}

                    <TextInput
                        style={[styles.input, { backgroundColor: '#dddddd' ,marginTop:10}]}
                        placeholder="Aforo"
                        keyboardType="phone-pad"
                        autoCapitalize="none"
                        value={aforo}
                        onChangeText={validarAforo}
                    />
                    <View style={styles.horasContainer}>
                        <View style={styles.horaContainer}>
                            <Text style={styles.label2}>Hora de Apertura:</Text>
                            <View style={styles.inputWrapper2}>
                                <TouchableOpacity style={styles.inputContainer} onPress={handleIngresarHora}>
                                    <Ionicons name="time" size={20} color="#777" style={styles.icon2} />
                                    <Text style={styles.horaInput}>
                                        {horaaperturaValido ? 'HH:MM Am' : format(horaapertura, 'HH:mm')}
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
                                    />
                                )}
                            </View>
                            {errors.horaapertura && <Text style={styles.errorText}>{errors.horaapertura}</Text>}
                        </View>
                        <View style={styles.horaContainer}>
                            <Text style={styles.label2}>Hora de Cierre:</Text>
                            <View style={styles.inputWrapper2}>
                                <TouchableOpacity style={styles.inputContainer} onPress={handleCierreHora}>
                                    <Ionicons name="time" size={20} color="#777" style={styles.icon2} />
                                    <Text style={styles.horaInput}>
                                        {horacierreValido ? 'HH:MM Pm' : format(horacierre, 'HH:mm')}
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
                                    />
                                )}
                            </View>
                            {errors.horacierre && <Text style={styles.errorText}>{errors.horacierre}</Text>}
                        </View>
                    </View>

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
            if (categoriaValido && nombreValido && direccionValido  && aforoValido ) {
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
                    <FontAwesome5 name="envelope" size={20} color={selectedOption === 'info' ? Colors.primary : 'black'} />
                    <Text style={styles.optionText}>Editar Información</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleOption('password')} style={styles.option}>
                    <FontAwesome5 name="lock" size={20} color={selectedOption === 'password' ? Colors.primary : 'black'} />
                    <Text style={styles.optionText}>Cambiar Contraseña</Text>
                </TouchableOpacity>
            </View>
            {renderOptionForm(selectedOption || 'info')}
            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Actualizar</Text>
            </TouchableOpacity>
        </View>
    );
};

export default EditarPerfil;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionText: {
        marginLeft: 10,
        fontSize: 14,
    },
    form: {
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
    label2: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
        textAlign: 'center',
    },
    horasContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    horaContainer: {
        flex: 1,
        marginRight: 5,
    },
    inputWrapper2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: '80%',
        alignSelf: 'center',
    },
    horaInput: {
        fontSize: 16,
        color: '#777',
    },
    icon2: {
        marginRight: 5,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginLeft: 5,
    },
    button: {
        backgroundColor: Colors.primary,
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    backButton: {
        marginLeft: 10,
    },
    btnCamera: {
        backgroundColor: '#03A9F4',
        padding: 10,
        borderRadius: 5,
    },
    btnCameraPlus: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        width: 250,
        height: 180,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
    }
});