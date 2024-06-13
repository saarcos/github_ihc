import React, { useState, useEffect, useLayoutEffect} from 'react';
import { Svg, Path, Defs, LinearGradient, Stop, Image } from 'react-native-svg';
import { Text, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, View, Alert, BackHandler, ActivityIndicator} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Link, router, useRouter, useNavigation } from 'expo-router';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { getAuth, signInWithEmailAndPassword, User, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebase-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { verificarCorreo } from '@/app/api/api';
import LoadingSpinner from '@/components/LoadingSpinner';

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
	persistence: getReactNativePersistence(AsyncStorage)
});


const Page = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const backAction = () => {
			return true;
		};
		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
		return () => backHandler.remove();
	}, []);

	const navigation = useNavigation();



	const handleRecoverPass = () => {
		router.push({ pathname: './(modals)/recoverPassword' });
	};
	const handleRegisterUser = () => {
		router.push({ pathname: '/(modals)/Registro' });
	};
	const handleRegisterAdmin = async () => {
		router.push({ pathname: '/(modals)/RegistroRestaurantes' });
	};
	const [showPassword, setMostrarContraseña] = useState<boolean>(false);
	const toggleMostrarContraseña = () => {
		setMostrarContraseña(!showPassword);
	};


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
					href={require('./(modals)/Imagen/logoBlanco.png')}
				/>


			</Svg>
		);
	}

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { onLogin } = useAuth();
	const [currentUser, setCurrentUser] = useState<User | null>(null);

	const SignIn = async () => {
		try {
			const emailValido = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        	const trimmedEmail = email.trim();
        	const trimmedPassword = password.trim();

        if (!trimmedEmail || !trimmedPassword) {
            Alert.alert('Error', 'Por favor, completa todos los campos.');
            return;
        }

        if (/[A-Z]/.test(trimmedEmail) || !emailValido.test(trimmedEmail) || trimmedPassword.length < 7) {
            Alert.alert('Error', 'Por favor, ingresa un correo electrónico válido y una contraseña de al menos 7 caracteres.');
            return;
        }
			setLoading(true);
			const { esRestaurante, esUsuario } = await verificarCorreo(trimmedEmail);
			signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword)
				.then((userCredential) => {
					const user = userCredential.user;
					setCurrentUser(user);
					if (esRestaurante) {
						onLogin!('admin', 'admin');
					} else if (esUsuario) {
						onLogin!('user', 'user');
					} else {
						console.log('El correo no está registrado');
					}
					setEmail('');
					setPassword('');
					setLoading(false);
				})
				.catch(error => {
					let errorMessage = 'Correo electrónico o contraseña incorrectos';
					Alert.alert(errorMessage);
					setLoading(false);
				});
		} catch (error) {
			Alert.alert('Error', 'Ocurrió un error al verificar el correo. Por favor, inténtalo de nuevo más tarde.');
			setLoading(false);
		}
	};
	

	return (
	<View style={styles.containerLoading}>
		{loading ? (
        <View style={styles.loadingContainer}>
            <LoadingSpinner />
        </View>
      	) : !loading && (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={styles.container}>
			<View style={{ marginHorizontal: -30, marginTop: -30 }}>
				<SvgTop />
			</View>

			<View style={{ justifyContent: 'center', alignItems: 'center', padding: 10, borderRadius: 10 }}>
				<Text style={{ fontSize: 16, color: loading ? 'transparent' : 'black' }}>Iniciar Sesión</Text>
			</View>

			<View style={{ opacity: loading ? 0 : 1 }}>
				<Text style={styles.label}>Correo:</Text>
				<View style={styles.inputContainer}>
					<View style={styles.inputWrapper}>
					<Ionicons name="mail-outline" size={20} color="#777" style={styles.icon} />
					<TextInput
						onChangeText={(text) => setEmail(text)}
						style={styles.input}
						placeholder="usuario@email.com"
					/>
					</View>
				</View>
				<Text style={styles.label}>Contraseña:</Text>
				<View style={styles.inputContainer}>
					<View style={styles.inputWrapper}>
					<Ionicons name="lock-closed" size={20} color="#777" style={styles.icon} />
					<TextInput
						onChangeText={(text) => setPassword(text)}
						style={styles.input}
						placeholder="contraseña"
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

				<TouchableOpacity style={[defaultStyles.btn]} onPress={SignIn}>
					<Text style={[defaultStyles.btnText]}>Ingresar</Text>
				</TouchableOpacity>

				<View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
					<TouchableOpacity onPress={handleRecoverPass}>
					<Text style={styles.btnText}>¿Olvidaste tu contraseña?</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.separatorView}>
					<View style={{ flex: 1, borderBottomColor: '#000', borderBottomWidth: StyleSheet.hairlineWidth }} />
				</View>
				<TouchableOpacity onPress={handleRegisterUser}>
				<Text style={styles.btnText}>Registrarse como Usuario</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={handleRegisterAdmin}>
				<Text style={styles.btnText}>Registrarse como Restaurante</Text>
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>)}
	</View>
);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f1f1f1',
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
		fontSize: 15,
		color: '#E5332A',
		textAlign: 'center',
		marginTop: 10,
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
	separatorView: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 10,
	},
	separator: {
		color: Colors.grey,
	},
	label: {
		width: '100%',
		fontSize: 16,
		fontWeight: 'bold',
		textAlign: 'left',
		marginLeft: 15,

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
	icon: {
		marginHorizontal: 10,
		color: '#803530',
		backgroundColor: 'white'
	},
	btnOutlineText: {
		color: '#000',
		fontSize: 16,
	},
	input: {
		flex: 1,
		height: 55,
		paddingHorizontal: 10,
		backgroundColor: 'white',
		borderRadius: 30
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	containerLoading:{
		flex: 1,
		backgroundColor: 'white',
		padding: 0,
	},
})
export default Page;