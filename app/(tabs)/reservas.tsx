import { View, Text, StyleSheet, FlatList , Image} from 'react-native'
import React, { useState } from 'react'
import { Stack } from 'expo-router'
import Colors from '@/constants/Colors'
import AppointmentCardItem from '@/components/AppointmentCardItem';
import { defaultStyles } from '@/constants/Styles';
import { useQuery } from '@tanstack/react-query';
import { getReservas } from '../api/api';
const Page = () => {
  const{data:appointments}=useQuery({queryKey:['reservas'], queryFn:getReservas})  
  return (
    <View style={[defaultStyles.container,{padding:10}]}>
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
      <FlatList data={appointments}
      renderItem={({item})=>(
        <AppointmentCardItem appointment={item}/>
      )} />

      
    </View>
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