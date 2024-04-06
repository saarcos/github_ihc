import { View, Text, StyleSheet, FlatList , Image} from 'react-native'
import React, { useState } from 'react'
import { Stack } from 'expo-router'
import Colors from '@/constants/Colors'
import reservas from '@/assets/data/reservas.json';
import AppointmentCardItem from '@/components/AppointmentCardItem';
import { defaultStyles } from '@/constants/Styles';
const Page = () => {
  const [appointment, setAppointment] = useState(reservas);
  
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
      <FlatList data={appointment}
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