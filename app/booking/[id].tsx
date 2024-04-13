import { View,  StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, {  useLayoutEffect, useState } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router';
import Info from '@/components/Reservas-info';
import ProcesoReserva from '@/components/Reservas-proceso'
import { defaultStyles } from '@/constants/Styles';
import Animated, { SlideInDown, interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import {  getRestauranteByID, getRestaurantes } from '../api/api';
import Colors from '@/constants/Colors';
import { useQuery } from '@tanstack/react-query';
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
    const idComoNumero = parseInt(id); 
    const {data:restaurante}=useQuery({queryKey:['restaurante',idComoNumero], queryFn:()=>getRestauranteByID(idComoNumero)})

  return (
    <View style={[defaultStyles.container]}>
      <Animated.ScrollView>
        {restaurante? (      
        <Info restaurant={restaurante}/>
      ):
      (<View style={defaultStyles.container}>
          <ActivityIndicator style={styles.spinner} size="large" color={Colors.dark} />
        </View>)}
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
  spinner: {
    padding:100,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default Booking