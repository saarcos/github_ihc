import { RefreshControl, Text, StyleSheet, FlatList , Image, View, TouchableOpacity} from 'react-native'
import React, { useEffect, useState } from 'react'
import {Stack } from 'expo-router'
import Colors from '@/constants/Colors'
import AppointmentCardItemRestaurante from '@/components/AppointmentCardItemRestaurante';
import { defaultStyles } from '@/constants/Styles';
import { useQuery } from '@tanstack/react-query';
import { getReservas, getUsuarioAdminByEmail } from '../api/api';
import Animated from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';


const Page = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const auth = getAuth(); // Obtener el objeto de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);
  const { data: usuario } = useQuery({
    queryKey: ['usuarioAdminEncontrado', currentUser?.email || ''], // Utiliza una cadena vacía como valor predeterminado si currentUser?.email es null
    queryFn: () => {
      if (currentUser?.email) {
        return getUsuarioAdminByEmail(currentUser.email);
      } else {
        return null; 
      }
    }
  });
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
 // Obtener las reservas del usuario actual
const userAppointments = appointments
? appointments.filter(item => item.id_restaurante === usuario?.id)
: [];

// Ordenar las reservas del usuario por estado primero y luego por fecha de más nuevas a más antiguas
const sortedAppointments = userAppointments.sort((a, b) => {
    // Comparar por estado
    if (a.estado === 'pendiente' && b.estado !== 'pendiente') {
      return -1; // 'pendiente' va primero
    } else if (a.estado !== 'pendiente' && b.estado === 'pendiente') {
      return 1; // 'pendiente' va después
    } else {
      // Si los estados son iguales, comparar por fecha
      const dateComparison = new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
      if (dateComparison === 0) {
        // Extraer las horas de las citas
        const horaA = parseInt(a.hora.split(':')[0]);
        const horaB = parseInt(b.hora.split(':')[0]);
        // Comparar por hora
        return horaB - horaA;
      }
      return dateComparison;
    }
  });

// Filtrar las reservas del usuario para el día de hoy
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0'); // El mes se indexa desde 0
const day = String(today.getDate()).padStart(2, '0');
const todayFormatted = `${year}-${month}-${day}`;

const appointmentsToday = sortedAppointments.filter(item => item.fecha >= todayFormatted);

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
          <AppointmentCardItemRestaurante key={index} appointment={item} onReservaDeleted={handleReservaDeleted} />
        ))
      ) : (
        
        <View style={styles.noReservasContainer}>
          <Ionicons name="calendar" size={50} color={Colors.wine} />
          <Text style={styles.noReservasText}>No tienes reservas aún</Text>
          
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