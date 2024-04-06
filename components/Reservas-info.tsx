import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import Colors from '@/constants/Colors'
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
  calificacion:number;
  informacion_restaurante: {
    nombre: string;
    direccion: string;
    menu: Menu[];
  };
}
interface Props{
  restaurant:RestauranteFiltrado
}
const Info = ({restaurant}:Props) => {
  return (
    <View>
       <View style={{marginHorizontal:10, marginTop:10,display:'flex',gap:15, flexDirection:'row', alignItems:'center'}}>
          <Image source={{uri:restaurant.imagen[0]}} style={styles.image}/>
          <View>
            <Text style={{fontSize:20, marginBottom:8, width:'80%', fontFamily:'appfont-bold'}}>{restaurant.informacion_restaurante.nombre}</Text>
            <View style={{display:'flex', flexDirection:'row', gap:5, alignItems:'center'}}>
              <Ionicons name='location'size={22} color={Colors.red} />
              <Text style={{fontSize:16, color:Colors.dark, width:'68%', fontFamily:'appfont'}}>{restaurant.direccion}</Text>
            </View>
            <View style={{display:'flex', flexDirection:'row', gap:5, alignItems:'center'}}>
              <Ionicons name='star'size={22} color={Colors.red} />
              <Text style={{fontSize:16, color:Colors.dark, width:'80%', fontFamily:'appfont'}}>{restaurant.calificacion}</Text>
              
            </View>
          </View>
      </View>
      <View style={styles.divider} />
    </View>
  )
}
const styles = StyleSheet.create({
  image:{
    width:100,
    height:100,
    borderRadius:50,
  },
  divider:{
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.wine,
    marginVertical: 16,
    marginHorizontal:15,
  },
  card:{
    backgroundColor: '#E4E4E5',
    width: 170,
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    marginVertical: 10,
    marginHorizontal: 13,
  }
})

export default Info