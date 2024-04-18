import { RefreshControl, Text, StyleSheet, FlatList , Image} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import Colors from '@/constants/Colors'
import AppointmentCardItem from '@/components/AppointmentCardItem';
import { defaultStyles } from '@/constants/Styles';
import { useQuery } from '@tanstack/react-query';
import { getReservas } from '../api/api';
import Animated from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';


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

  const today = new Date().toISOString().slice(0, 10); // Obtiene la fecha de hoy en el formato YYYY-MM-DD

  const appointmentsToday = sortedAppointments.filter(item => {
    return item.fecha >= today;
  });
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
       {appointmentsToday && appointmentsToday.map((item, index) => (
        <AppointmentCardItem key={index} appointment={item} onReservaDeleted={handleReservaDeleted} />
      ))}
    </Animated.ScrollView>
  )
}
const styles = StyleSheet.create({
  headerStyle:{
    fontFamily:'appfont-bold',
    color:Colors.dark,
    textTransform:'capitalize',
    fontSize:20
  }
})

export default Page