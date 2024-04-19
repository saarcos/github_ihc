import React, { useLayoutEffect, useState } from 'react';
import { Image } from 'react-native';
import { View, SafeAreaView, StyleSheet, Text } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Svg, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Colors from '@/constants/Colors';
import { useNavigation } from 'expo-router';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

const PerfilPage = () => {
  function SvgTop() {
    return (
      <Svg width={500} height={100} fill="none">
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
  const { authState, onLogout } = useAuth();
  const onLogoutPressed = () => {
    onLogout!();
  };
  const router = useRouter();

  const handleRegisterPress = () => {
    router.back();
  };

  const navigation = useNavigation();
  useLayoutEffect(() => {
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
    });
  });

  return (
    <SafeAreaView style={styles.container}>
      <SvgTop />
      <View style={styles.info}>
        <View style={{ flexDirection: 'row', marginTop: 15 }}>
          <View style={{ marginLeft: 20 }}>
            <Text style={[styles.titulo, { marginTop: 15, marginBottom: 5 }]}>
              Perfil Restaurante
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.info}>
        <View style={styles.fila}>
          <FontAwesome
            name="phone"
            size={20}
            color="#777777"
            style={{ marginRight: 10 }}
          />
          <Text style={{ color: '#777777', marginLeft: 20 }}>
            +593 987654321
          </Text>
        </View>
        <View style={styles.fila}>
          <MaterialIcons
            name="email"
            size={20}
            color="#777777"
            style={{ marginRight: 10 }}
          />
          <Text style={{ color: '#777777', marginLeft: 20 }}>
            usuario@email.com
          </Text>
        </View>
      </View>

      <View style={styles.separacion}></View>

      <View style={styles.menu}>
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItem}>
            <FontAwesome
              name="heart"
              size={20}
              color="#BC3A31"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.textoIcono}>Tus Favoritos</Text>
          </View>
        </TouchableRipple>
        <Link href="/(modals)/editarPerfil" asChild>
          <TouchableRipple onPress={handleRegisterPress}>
            <View style={styles.menuItem}>
              <MaterialIcons
                name="edit"
                size={20}
                color="#BC3A31"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.textoIcono}>Editar perfil</Text>
            </View>
          </TouchableRipple>
        </Link>
        <TouchableRipple onPress={onLogoutPressed}>
          <View style={styles.menuItem}>
            <MaterialIcons
              name="exit-to-app"
              size={20}
              color="#BC3A31"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.textoIcono}>Cerrar Sesión</Text>
          </View>
        </TouchableRipple>

        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItem}>
            <FontAwesome
              name="trash"
              size={20}
              color="#BC3A31"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.textoIcono}>Eliminar cuenta</Text>
          </View>
        </TouchableRipple>
      </View>
    </SafeAreaView>
  );
};

export default PerfilPage;

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
  headerStyle: {
    fontFamily: 'appfont-bold',
    color: Colors.dark,
    textTransform: 'capitalize',
    backgroundColor: '#803530',
    fontSize: 20,
  },
  headerTitle: {
    fontFamily: 'appfont-bold',
    fontSize: 22,
  },
});
