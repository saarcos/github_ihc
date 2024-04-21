import { RefreshControl, Text, StyleSheet, FlatList , Image, View, TouchableOpacity} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link, Stack } from 'expo-router'
import Colors from '@/constants/Colors'
import AppointmentCardItem from '@/components/AppointmentCardItem';
import { defaultStyles } from '@/constants/Styles';
import { useQuery } from '@tanstack/react-query';
import { getReservas } from '../api/api';
import Animated from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const Page = () => {
  const [refreshing, setRefreshing] = useState(false);
  const{data:appointments, refetch}=useQuery({queryKey:['reservas'], queryFn:getReservas}) ;
  const navigation=useNavigation();
  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const handleReservaDeleted = () => {
    refetch();
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch();
    });
    return unsubscribe;
  }, [navigation]);
  // Ordenar las reservas por fecha de más nuevas a más antiguas
  const sortedAppointments = appointments
  ? appointments.sort((a, b) => {
      const dateComparison = new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
        if (dateComparison === 0) {
        // Extraer las horas de las citas
        const horaA = parseInt(a.hora.split(':')[0]);
        const horaB = parseInt(b.hora.split(':')[0]);

        // Comparar por hora
        return horaB - horaA;
      }
      return dateComparison;
    })
  : [];

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // El mes se indexa desde 0
  const day = String(today.getDate()).padStart(2, '0');
  
  const todayFormatted = `${year}-${month}-${day}`;
  const appointmentsToday = sortedAppointments.filter(item => {
    return item.fecha >= todayFormatted;
  });
  // useEffect(() => {
  //   console.log("Fecha: ",todayFormatted)
  // }, [])

  return (
    <Animated.ScrollView style={[defaultStyles.container,{padding:10}]}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Colors.primary}/>
    }
    >
       <Stack.Screen
        options={{
          headerTitle: () => ( 
            <Image
              source={require('../(modals)/Imagen/logoBlanco.png')}
              style={{ width: 47, height: 45 }}
            />
          ),
          headerTitleStyle: styles.headerStyle,
          headerStyle: {
            backgroundColor: '#803530', 
          },
        }}
      />
        {appointmentsToday.length > 0 ? (
        appointmentsToday.map((item, index) => (
          <AppointmentCardItem key={index} appointment={item} onReservaDeleted={handleReservaDeleted} />
        ))
      ) : (
        
        <View style={styles.noReservasContainer}>
          <Ionicons name="calendar" size={50} color={Colors.wine} />
          <Text style={styles.noReservasText}>No tienes reservas para hoy</Text>
          <Link href={`/(tabs)/`} asChild>
          <TouchableOpacity  style={styles.button}>
            <Text style={styles.buttonText}>Explora restaurantes</Text>
          </TouchableOpacity>
          </Link>
        </View>
      )}
    </Animated.ScrollView>
  )
}
const styles = StyleSheet.create({
  headerStyle:{
    fontFamily:'appfont-bold',
    color:Colors.dark,
    textTransform:'capitalize',
    fontSize:20
  },
  noReservasContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noReservasText: {
    textAlign: 'center',
    fontSize: 18,
    color: Colors.wine,
    marginTop: 20,
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.wine,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: Colors.white,
  },
})

export default Page