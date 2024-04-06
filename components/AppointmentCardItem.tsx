import { View, Text, Image, StyleSheet} from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors';
import moment from 'moment'; 
import { Ionicons } from '@expo/vector-icons';

interface Props{
    appointment:{
        id: number;
        time: string;
        date: string;
        numberOfPeople: number;
        restaurant: {
            name: string;
            photo: string;
            address:string;
        };
    }
    
}
const AppointmentCardItem = ({appointment}:Props) => {
    const momentES=moment.locale('es');
    const formattedTime = moment(appointment.time).format('h:mma');
  return (
    <View style={styles.card}>
      <View style={{justifyContent:'space-between', flexDirection:'row', alignItems:'center'}}>
        <Text style={{fontSize:18, fontFamily:'appfont-semi', marginTop:10}}>Fecha: {moment(appointment.date).subtract(10, 'days').calendar()}</Text>
        <Text style={{fontFamily:'appfont-light', color:Colors.wine, fontSize:15}}>{formattedTime}</Text>
      </View>
      <View style={styles.divider} />
      <View style={{display:'flex', flexDirection:'row', gap:15, alignItems:'center'}}>
        <Image source={{uri: appointment.restaurant.photo}} style={styles.imgCard}/>
      
        <View>
            <Text style={{fontSize:16, fontFamily:'appfont-semi',maxWidth:'80%'}}>{appointment.restaurant.name}</Text>
            <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:5}}>
                <Ionicons name='location' size={20} color={Colors.red}/>
                <Text style={{maxWidth: '75%', fontFamily:'appfont-light'}}>{appointment.restaurant.address}</Text>
            </View>
            <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:5}}>
                <Ionicons name='people' size={20} color={Colors.red}/>
                <Text style={{width:'78%',fontFamily:'appfont-light'}}>{appointment.numberOfPeople}</Text>
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