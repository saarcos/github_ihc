import React, {  useLayoutEffect, useState } from 'react';
import { View, StyleSheet, Image, ActivityIndicator, FlatList } from 'react-native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { useNavigation } from 'expo-router';
import { Restaurante, getRestaurantes } from '../api/api';
import Colors from '@/constants/Colors';
import Restaurantes from '@/components/Restaurantes';
import { defaultStyles } from '@/constants/Styles';
import { useQuery } from '@tanstack/react-query';
const Page = () => {

  const {data:restaurantes,isLoading,isError}=useQuery({queryKey:['restaurants'],queryFn:getRestaurantes,});
  // const [cargando, setCargando] = useState(false);
  //Con useEffect, sin tanstack query->not cached
  // const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  // useEffect(() => {
  //   const fetchRestaurantes = async () => {
  //     try {
  //       const restaurantesData = await getRestaurantes();
  //       setRestaurantes(restaurantesData);
  //       setCargando(false);
  //     } catch (error) {
  //       console.error('Error al obtener los restaurantes:', error);
  //       setCargando(false);
  //     }
  //   };
  //   fetchRestaurantes();
  // }, []);
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
      headerStyle: {
        backgroundColor: '#803530', 
      },
    })
  })
  return (
    <View style={[defaultStyles.container, { padding: 10 }]}>
    
    {isLoading ? (
      <ActivityIndicator style={styles.spinner} size="large" color={Colors.dark} />
    ) : (
      <FlatList
        data={restaurantes}
        renderItem={({ item }) => <Restaurantes restaurante={item} />}
      />
    )}
  </View>
  );
};

const styles = StyleSheet.create({
  headerTitle:{
    fontFamily:'appfont-bold',
    fontSize:22
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default gestureHandlerRootHOC(Page);
