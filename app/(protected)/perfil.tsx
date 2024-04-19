import React, { useLayoutEffect,useState } from 'react';
import { Image } from 'react-native';
import { View, SafeAreaView, StyleSheet, Text, Alert, TouchableOpacity} from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Svg, Path, Defs, LinearGradient, Stop} from 'react-native-svg';
import Colors from '@/constants/Colors'
import { useNavigation } from 'expo-router';
import { Link, useRouter } from 'expo-router';
import { getAuth, onAuthStateChanged, User, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../firebase-config';


const perfil: React.FC = () => {
  function SvgTop() {
    return (
      <Svg
        width={500}
        height={100}
        fill="none"
      >
        <Path
          fill="url(#a)"
          d="M0 100V0h500v100C266.166 42.824 69.236 76.177 0 100Z"
        />
        <Defs>
          <LinearGradient
            id="a"
            x1={250}
            x2={250}
            y1={278.5}
            y2={28}
            gradientUnits="userSpaceOnUse"
          >
            <Stop stopColor="#E5332A" />
            <Stop offset={0.12} stopColor="#BB342C" />
            <Stop offset={1} stopColor="#803530" />
          </LinearGradient>
        </Defs>
      </Svg>
    );
  }

  const router = useRouter();
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const LogIn = () => {
    router.push({ pathname: '/(modals)/login'});
  }

  const handleRegisterPress = () => {
    router.back();
  };

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useLayoutEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
    return unsubscribe;
  }, []);


  const handleSignOut = () => {
    signOut(auth)
    router.push({ pathname: '/(modals)/login'});
  };

  const handleDeleteAccount = () => {
    if (currentUser) {
      Alert.alert(
        'Eliminar cuenta',
        '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Eliminar',
            onPress: async () => {
              try {
                await currentUser.delete();
                Alert.alert('Cuenta eliminada correctamente');
              } catch (error) {
                Alert.alert('Error al eliminar la cuenta:');
              }
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  const navigation=useNavigation();
    useLayoutEffect(()=>{
      navigation.setOptions({
        headerTitle: () => ( 
        <Image
          source={require('../(modals)/Imagen/logoBlanco.png')}
          style={{ width: 47, height: 45 }}
        />
      ),
        headerTitleStyle: styles.headerTitle,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: '#803530', 
        },
      })
    })

    return (
      <SafeAreaView style={styles.container}>
        {/* Renderizar solo si hay un usuario autenticado */}
        {currentUser ? (
          <>
        <SvgTop />
            <View style={styles.info}>
              <View style={{ flexDirection: 'row', marginTop: 15 }}>
                <View style={{ marginLeft: 20 }}>
                  <Text style={[styles.titulo, { marginTop: 15, marginBottom: 5 }]}>Usuario</Text>
                </View>
              </View>
            </View>

            <View style={styles.info}>
              <View style={styles.fila}>
                <FontAwesome name="phone" size={20} color="#777777" style={{ marginRight: 10 }} />
                <Text style={{ color: "#777777", marginLeft: 20 }}>+593 987654321</Text>
              </View>
              <View style={styles.fila}>
                <MaterialIcons name="email" size={20} color="#777777" style={{ marginRight: 10 }} />
                {currentUser && <Text style={{ color: "#777777", marginLeft: 20 }}>{currentUser.email}</Text>}
              </View>
            </View>
  
            <View style={styles.separacion}></View>
  
            <View style={styles.menu}>
              <TouchableRipple onPress={() => { }}>
                <View style={styles.menuItem}>
                  <FontAwesome name="heart" size={20} color="#BC3A31" style={{ marginRight: 10 }} />
                  <Text style={styles.textoIcono}>Tus Favoritos</Text>
                </View>
              </TouchableRipple>
              <Link href="/(modals)/editarPerfil" asChild>
                <TouchableRipple onPress={handleRegisterPress}>
                  <View style={styles.menuItem}>
                    <MaterialIcons name="edit" size={20} color="#BC3A31" style={{ marginRight: 10 }} />
                    <Text style={styles.textoIcono}>Editar perfil</Text>
                  </View>
                </TouchableRipple>
              </Link>
              <TouchableRipple onPress={handleSignOut}>
                <View style={styles.menuItem}>
                  <MaterialIcons name="exit-to-app" size={20} color="#BC3A31" style={{ marginRight: 10 }} />
                  <Text style={styles.textoIcono}>Cerrar Sesión</Text>
                </View>
              </TouchableRipple>
              <TouchableRipple onPress={handleDeleteAccount}>
                <View style={styles.menuItem}>
                  <FontAwesome name="trash" size={20} color="#BC3A31" style={{ marginRight: 10 }} />
                  <Text style={styles.textoIcono}>Eliminar cuenta</Text>
                </View>
              </TouchableRipple>
            </View>
          </>
        ): (
          <View style={styles.messageContainer}>
            <Text style={styles.message}>Inicia sesión para ver el contenido</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={LogIn}>
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </SafeAreaView>
    );
  };

export default perfil;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  info: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  fila: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  separacion: {
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
  },
  btnText: {
    fontSize: 16,
    color: '#E5332A',
    textDecorationLine: 'underline'
  },
  menu: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  textoIcono: {
    color: '#777777',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
  headerStyle:{
    fontFamily:'appfont-bold',
    color:Colors.dark,
    textTransform:'capitalize',
    backgroundColor:'#803530',
    fontSize:20
  },
  headerTitle:{
    fontFamily:'appfont-bold',
    fontSize:22
  },
  messageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  message: {
    fontSize: 15,
    marginBottom: 20,
  },
  buttonContainer: {
    backgroundColor: Colors.primary,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
});
