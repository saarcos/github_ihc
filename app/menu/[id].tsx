import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import Colors from '@/constants/Colors';
import restaurantesData from '@/assets/data/restaurantes.json';
import MenuRestaurante from '@/components/MenuRestaurante';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
interface Menu {
    nombre: string;
    precio: number;
    foto: string;
  }
  interface RestauranteFiltrado {
    id: number;
    titulo: string;
    imagen: string[];
    direccion: string;
    informacion_restaurante: {
      nombre: string;
      direccion: string;
      menu: Menu[];
    };
  }
const Page = () =>{
  const navigation=useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerTransparent: true,
      headerLeft: () => (
        <TouchableOpacity style={styles.roundButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={'#000'} />
        </TouchableOpacity>
      ),
    });
  }, []);
  const [restaurantes, setRestaurantes] = useState<RestauranteFiltrado[]>(restaurantesData);
  const {id}=useLocalSearchParams<{id:string}>();
  const idComoNumero = parseInt(id); 
  const restauranteEncontrado = restaurantes.find(restaurante => restaurante.id === idComoNumero);




  return (
    <View>
      {restauranteEncontrado ? (
        <MenuRestaurante restaurante={restauranteEncontrado} />
      ) : (
        <Text>No se encontró ningún restaurante con el ID proporcionado.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerStyle:{
    fontFamily:'appfont-bold',
    color:Colors.dark,
    textTransform:'capitalize',
    fontSize:20
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    color: Colors.primary,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
});

export default gestureHandlerRootHOC(Page); 
