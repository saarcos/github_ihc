import { View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors';
import moment from 'moment'; 
import { Ionicons } from '@expo/vector-icons';
import { Reserva, eliminarReserva, getRestauranteByID } from '@/app/api/api';
import { useMutation, useQuery } from '@tanstack/react-query';

interface Props{
    appointment:Reserva   
}
const AppointmentCardItem = ({appointment}:Props) => {
  const { data: restaurante} = useQuery({queryKey:['restauranteEncontrado',appointment.id_restaurante],queryFn:()=> getRestauranteByID(appointment.id_restaurante)});
  const deleteMutation=useMutation({mutationFn: ({ idReserva }: { idReserva: number }) => eliminarReserva(idReserva),
  onSuccess: () => {
    console.log('Reserva eliminada corectamente');
  },
  onError: (error: Error) => { 
    console.error('Error al eliminarReserva:', error.message);
  },
  })
  const handleEliminarReserva=()=>{
    deleteMutation.mutate({idReserva: appointment.id});
  }
  return (
    <View style={styles.card}>
      <View style={{justifyContent:'space-between', flexDirection:'row', alignItems:'center'}}>
        <Text style={{fontSize:18, fontFamily:'appfont-semi', marginTop:10}}>Fecha: {appointment.fecha}</Text>
        <Text style={{fontFamily:'appfont-light', color:Colors.wine, fontSize:15}}>{appointment.hora}</Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 2}}>
        <Text style={{fontFamily: 'appfont-semi', fontSize: 15, marginRight: 5}}>Estado: </Text>
        <View style={{
            borderRadius: 99, 
            overflow: 'hidden', 
          }}>
            <Text style={{
                fontFamily: 'appfont-light',
                fontSize: 15,
                borderRadius:99,
                padding:4,
                backgroundColor: appointment.estado === 'confirmada' ?  '#8BC34A': Colors.orange,
              }}>{appointment.estado}</Text>
        </View>
        
  </View>
      <View style={styles.divider} />
      <View style={{display:'flex', flexDirection:'row', gap:15, alignItems:'center'}}>
        <Image source={{uri: restaurante?.foto}} style={styles.imgCard}/>
        <View>
            <Text style={{fontSize:16, fontFamily:'appfont-semi',maxWidth:'80%'}}>{restaurante?.nombre}</Text>
            <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:5}}>
                <Ionicons name='location' size={20} color={Colors.red}/>
                <Text style={{maxWidth: '75%', fontFamily:'appfont-light'}}>{restaurante?.direccion}</Text>
            </View>
            <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:5}}>
                <Ionicons name='people' size={20} color={Colors.red}/>
                <Text style={{width:'78%',fontFamily:'appfont-light'}}>{appointment.num_personas}</Text>
            </View>
            <View style={{alignSelf: 'flex-start',marginTop: 10}}>
              <TouchableOpacity style={styles.btnCancelarAppointment} onPress={handleEliminarReserva}><Text style={styles.btnText}>Cancelar Reserva</Text></TouchableOpacity>
            </View>
        </View>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  btnCancelarAppointment: {
    backgroundColor: 'red', // Color de fondo del botón
    paddingVertical: 5, // Espaciado vertical dentro del botón
    paddingHorizontal: 10, // Espaciado horizontal dentro del botón
    borderRadius: 5, // Radio de borde para hacerlo redondeado
  },
  btnText: {
    color: 'white', // Color del texto dentro del botón
    fontFamily: 'appfont-semi', // Familia de fuente del texto
    fontSize: 16, // Tamaño del texto
  },
    imgCard:{
        height:100,
        width:90,
        borderRadius:10,
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: Colors.wine,
        marginVertical: 16,
      },
      card:{
        backgroundColor: '#E9E9E9',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
        marginVertical: 10,
        marginHorizontal: 13,
        marginTop:10,
      }
})

export default AppointmentCardItem