import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity,Image, Dimensions } from 'react-native';
import {  Text, IconButton, Button ,  } from 'react-native-paper';
import { BtnReserva , BtnUbicacion } from "./Button";
import CardAdmin from "./CardAdmin";
import { Link } from 'expo-router';
import { Plato  } from '@/app/api/api';

import Colors from '@/constants/Colors';
import Animated, {
    SlideInDown,
    interpolate,
    useAnimatedRef,
    useAnimatedStyle,
    useScrollViewOffset,
} from 'react-native-reanimated';


interface Props {
  plato: Plato;
}


const MenuAdminRestaurante = ({ plato }: Props) => {

  useEffect(() => {
  }, [plato]); 

    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const platoArray = Array.isArray(plato) ? plato : [plato];
    
  return (
    
      <Animated.ScrollView contentContainerStyle={styles.container} ref={scrollRef} scrollEventThrottle={16}>

            {platoArray.map((item, index) => {
                    return (
                    <View key={index} style={styles.containercard}>
                        <View style={{ flexDirection: 'row' }}>
                        <CardAdmin
                            titles={item.nombre}
                            content={`Precio: $${item.precio}`}
                            imageUrl={item.foto}
                            id={item.id}
                            idRestaurante={item.id_restaurante}
                        />
                        </View>
                        
                    </View>
                    );
                })}
                <View style={{alignItems:'center'}}>
                  <Link href={`/editarPlato/${null}`} asChild>
                    <Button
                      mode="contained"
                      style={styles.verMenuButton}
                      labelStyle={styles.verMenuButtonLabel} 
                    >
                      Añadir Plato
                    </Button>
                </Link>
                </View>
      </Animated.ScrollView>
    
  );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    btnReserva:{
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        width:120,
        height:40,
        marginRight:10,
        backgroundColor:Colors.red,
    },
    background: {
        width: '100%',
        height: 300,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#FCE2AD',
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    containercard:{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-around', 

    },
    btnContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        margin: 20,
        flexDirection:'row',
      },
      strellasContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        marginLeft: 10,
        marginBottom: 20,
        flexDirection:'row',
      },
      verMenuButton: {
        borderRadius: 90,
        borderWidth:1,
        borderColor:'red',
        backgroundColor: "white",
        color:'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: 250, 
        height: 45,
        marginRight: 10,
      },
      
      verMenuButtonLabel: {
        color:'red',
        fontSize: 14, 
        fontFamily: 'appfont-bold',
      },
});

export default MenuAdminRestaurante;