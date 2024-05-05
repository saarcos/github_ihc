import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import Colors from '@/constants/Colors';
import MenuRestaurante from '@/components/MenuRestaurante';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Restaurante, getRestauranteByID, getRestaurantes ,getPlatoRestauranteByID } from '../api/api';
import { defaultStyles } from '@/constants/Styles';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '@/components/LoadingSpinner';

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
  const { id } = useLocalSearchParams<{ id: string }>(); // Obtiene el ID del restaurante de los parámetros de la URL
  const restauranteID = parseInt(id); // Convertir a número
  const { data: restaurante} = useQuery({queryKey:['restaurante',restauranteID],queryFn:()=> getRestauranteByID(restauranteID)});  
  const { data: plato } = useQuery({queryKey:['plato',restauranteID],queryFn:()=> getPlatoRestauranteByID(restauranteID)});

  // console.log('restaurante:', restaurante);
  // console.log('plato:', plato);
  return (
    <View style={styles.container}>
      <View>
        {restaurante ? (
          <MenuRestaurante restaurante={restaurante} />
        ) : (
          <View style={styles.loadingContainer}>
            <LoadingSpinner />
          </View>
        )}
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Fondo blanco
  },
  headerStyle:{
    fontFamily:'appfont-bold',
    color:Colors.dark,
    textTransform:'capitalize',
    fontSize:20
  },
  loadingContainer: {
    flex: 1,
    marginTop:'100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Fondo blanco
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
  spinner: {
    padding:100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:200,
  },
});

export default gestureHandlerRootHOC(Page); 
