import { View, Text, Image, StyleSheet} from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors';
import moment from 'moment'; 
import { Ionicons } from '@expo/vector-icons';
import { Reserva, getRestauranteByID } from '@/app/api/api';
import { useQuery } from '@tanstack/react-query';

interface Props{
    appointment:Reserva   
}
const AppointmentCardItem = ({appointment}:Props) => {
    const { data: restaurante} = useQuery({queryKey:['restauranteEncontrado',appointment.id_restaurante],queryFn:()=> getRestauranteByID(appointment.id_restaurante)});
  return (
    <View style={styles.card}>
      <View style={{justifyContent:'space-between', flexDirection:'row', alignItems:'center'}}>
        <Text style={{fontSize:18, fontFamily:'appfont-semi', marginTop:10}}>Fecha: {moment(appointment.fecha).subtract(10, 'days').calendar()}</Text>
        <Text style={{fontFamily:'appfont-light', color:Colors.wine, fontSize:15}}>{appointment.hora}</Text>
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
        </View>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
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