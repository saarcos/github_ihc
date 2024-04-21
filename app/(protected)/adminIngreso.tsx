import React, { useLayoutEffect,useState } from 'react';
import { Image  } from 'react-native';
import { View, SafeAreaView, StyleSheet, Text } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Svg, Path, Defs, LinearGradient, Stop} from 'react-native-svg';
import Colors from '@/constants/Colors'
import { useNavigation } from 'expo-router';
import { Link, useRouter } from 'expo-router';
import { Button } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import {getPlatoRestauranteByID } from '../api/api';
import MenuAdminRestaurante from '@/components/MenuAdminRestaurante';


const perfil: React.FC = () => {


  const router = useRouter();

    const handleRegisterPress = () => {
      router.back();
    };
    // const {id}=useLocalSearchParams<{id:string}>();
    const idComoNumero = 6; 
    const { data: plato } = useQuery({queryKey:['plato',idComoNumero],queryFn:()=> getPlatoRestauranteByID(idComoNumero)});
  
  
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
          backgroundColor: '#E5332A', 
        },
      })
    })

  return (
    <SafeAreaView >
      <View style={styles.info}>
        <View style={{ flexDirection: 'row', marginTop: 15 }}>
          <View >
              {plato ? (
                <MenuAdminRestaurante plato={plato} />
              ) : (
                <Text>No se encontró ningún restaurante con el ID proporcionado.</Text>
              )}
          </View>
        </View>
      </View>

      
    </SafeAreaView>
  );
};

export default perfil;

const styles = StyleSheet.create({

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
});