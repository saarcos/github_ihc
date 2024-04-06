import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router';
import listingsData from '@/assets/data/restaurantes.json';
import Info from '@/components/Reservas-info';
import ProcesoReserva from '@/components/Reservas-proceso'
import { defaultStyles } from '@/constants/Styles';
import Animated, { SlideInDown, interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
const Booking = () => {
    const navigation=useNavigation();
    useLayoutEffect(()=>{
      navigation.setOptions({
        headerTitle: 'Reservación',
        headerTitleStyle: styles.headerTitle,

        headerLeft: () => (
          <TouchableOpacity style={styles.roundButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={'#fff'} />
          </TouchableOpacity>
        ),
      })
    })
    const {id}=useLocalSearchParams<{id:string}>();
    console.log("ID booking:",id);
    const idComoNumero = parseInt(id); 
    const listing=(listingsData as any[]).find((item)=>item.id===idComoNumero);
    console.log(listing)
  return (
    <View style={[defaultStyles.container]}>
      <Animated.ScrollView>
      <Info restaurant={listing}/>
      <ProcesoReserva/>
      </Animated.ScrollView>
    </View>
  )
}
const styles = StyleSheet.create({
  headerTitle:{
    fontFamily:'appfont-bold',
    fontSize:22
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    color: "#fff",
  },
})

export default Booking