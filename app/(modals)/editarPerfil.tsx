import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { getAuth, updateEmail, updatePassword } from 'firebase/auth';
import { app } from '../../firebase-config';
import Colors from '@/constants/Colors';
import { FontAwesome5 } from '@expo/vector-icons';





const EditarPerfil = () => {
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const [currentUserEmail, setCurrentUserEmail] = useState<string>('');
    const navigation=useNavigation();
    useLayoutEffect(()=>{
      navigation.setOptions({
        headerShown:false,
      })
    })
    type Option = "email" | "password" | "user" | "phone";

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

    const handleChangeEmail = () => {
        const auth = getAuth(app);
        const currentUser = auth.currentUser;
        if (currentUser) {
            updateEmail(currentUser, newEmail)
                .then(() => {
                    Alert.alert('Correo electrónico actualizado correctamente');
                })
                .catch((error) => {
                    Alert.alert('Error al actualizar el correo electrónico:', error.code);
                });
        } else {
            Alert.alert('No hay usuario actualmente autenticado');
        }
    };

    const handleChangePassword = () => {
        const auth = getAuth(app);
        const currentUser = auth.currentUser;
        if (currentUser) {
            updatePassword(currentUser, newPassword)
                .then(() => {
                    Alert.alert('Contraseña actualizada correctamente');
                })
                .catch((error) => {
                    Alert.alert('Error al actualizar la contraseña:', error);
                });
        } else {
            Alert.alert('No hay usuario actualmente autenticado');
        }
    };

    const renderOptionForm = (option: Option) => {
        if (option === 'email') {
            return (
                <View style={styles.form}>
                    <TextInput
                        style={[styles.input, { backgroundColor: '#dddddd' }]}
                        placeholder="Correo electrónico actual"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={currentUserEmail}
                        onChangeText={setCurrentUserEmail}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Nuevo correo electrónico"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onChangeText={setNewEmail}
                    />
                </View>
            );
        } else if (option === 'user') {
            return (
                <View style={styles.form}>
                    <TextInput
                        style={[styles.input, { backgroundColor: '#dddddd' }]}
                        placeholder="Nombre de usuario actual"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Nuevo nombre de Usuario"
                        autoCapitalize="none"
                    />
                </View>
            );
        } else if (option === 'phone') {
            return (
                <View style={styles.form}>
                    <TextInput
                        style={[styles.input, { backgroundColor: '#dddddd' }]}
                        placeholder="Número de teléfono actual"
                        autoCapitalize="none"
                        keyboardType="phone-pad"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Nuevo número de teléfono"
                        autoCapitalize="none"
                        keyboardType="phone-pad"
                    />
                </View>
            );
        } else if (option === 'password') {
            return (
                <View style={styles.form}>
                    <TextInput style={styles.input} placeholder="Contraseña actual" secureTextEntry={true} onChangeText={setCurrentPassword} />
                    <TextInput style={styles.input} placeholder="Nueva contraseña" secureTextEntry={true} onChangeText={setNewPassword} />
                </View>
            );
        }
        return null;
    };

    const [newEmail, setNewEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    return (
        <View style={styles.container}>
            <View style={styles.optionsContainer}>
                <TouchableOpacity onPress={() => toggleOption('user')} style={styles.option}>
                    <FontAwesome5 name="user" size={24} color={selectedOption === 'user' ? Colors.primary : 'black'} />
                    <Text style={styles.optionText}>Cambiar nombre de usuario</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleOption('phone')} style={styles.option}>
                    <FontAwesome5 name="phone" size={24} color={selectedOption === 'phone' ? Colors.primary : 'black'} />
                    <Text style={styles.optionText}>Cambiar número de teléfono</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleOption('email')} style={styles.option}>
                    <FontAwesome5 name="envelope" size={24} color={selectedOption === 'email' ? Colors.primary : 'black'} />
                    <Text style={styles.optionText}>Cambiar correo electrónico</Text>
                </TouchableOpacity>
                {selectedOption === 'email' && renderOptionForm('email')}
                <TouchableOpacity onPress={() => toggleOption('password')} style={styles.option}>
                    <FontAwesome5 name="key" size={24} color={selectedOption === 'password' ? Colors.primary : 'black'} />
                    <Text style={styles.optionText}>Cambiar contraseña</Text>
                </TouchableOpacity>
                {selectedOption === 'password' && renderOptionForm('password')}
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={() =>
                    selectedOption ? (selectedOption === 'email' ? handleChangeEmail() : handleChangePassword()) : Alert.alert('Por favor, selecciona una opción para actualizar.')
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
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default EditarPerfil;
