import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import Colors from '@/constants/Colors'
import { Restaurante } from '@/app/api/api'

interface Props{
  restaurant:Restaurante
}
const Info = ({restaurant}:Props) => {
  const [imagenCargando, setImagenCargando] = useState(true);

  return (
    <View>
       <View style={{marginHorizontal:10, marginTop:10,display:'flex',gap:15, flexDirection:'row', alignItems:'center'}}>
        <View>
        <Image 
          source={{uri:restaurant.foto}} style={styles.image}
          onLoad={() => setImagenCargando(false)}
          />
          {imagenCargando && (
              <ActivityIndicator style={styles.spinner} size="large" color="gray" />
          )}
        </View>
          
          <View>
            <Text style={{fontSize:20, marginBottom:8, width:'80%', fontFamily:'appfont-bold'}}>{restaurant.nombre}</Text>
            <View style={{display:'flex', flexDirection:'row', gap:5, alignItems:'center'}}>
              <Ionicons name='location'size={22} color={Colors.red} />
              <Text style={{fontSize:16, color:Colors.dark, width:'68%', fontFamily:'appfont'}}>{restaurant.direccion}</Text>
            </View>
            <View style={{display:'flex', flexDirection:'row', gap:5, alignItems:'center'}}>
              <Ionicons name='star'size={22} color={Colors.red} />
              {/* <Text style={{fontSize:16, color:Colors.dark, width:'80%', fontFamily:'appfont'}}>{restaurant.calificacion}</Text> */}
              
            </View>
          </View>
      </View>
      <View style={styles.divider} />
    </View>
  )
}
const styles = StyleSheet.create({
  spinner: {
    position: 'absolute',
    top: '35%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
  },
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