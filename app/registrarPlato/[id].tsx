import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import Colors from '@/constants/Colors';
import RegistrarPlato from '@/components/RegistrarPlato';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { getPlatoByID } from '../api/api';
import LoadingSpinner from '@/components/LoadingSpinner';
const Page = () =>{
  const navigation=useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerTransparent: false,
      headerLeft: () => (
        <TouchableOpacity style={styles.roundButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={'#000'} />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: '#803530',
      },
    });
  }, []);
  const {id}=useLocalSearchParams<{id:string}>();
  const idComoNumero = parseInt(id); 

  




  return (
    <View>
        <RegistrarPlato  idRestaurante={idComoNumero}  />

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
  backNav:{
    backgroundColor:"red"
  }
});

export default gestureHandlerRootHOC(Page); 
