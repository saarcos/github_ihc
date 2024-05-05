import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity,Image, Dimensions } from 'react-native';
import {  Text, IconButton, Button ,  } from 'react-native-paper';
import { EvilIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { MaterialIcons } from '@expo/vector-icons';
import Card from "./Card";
import { Link } from 'expo-router';
import Colors from '@/constants/Colors';
import Animated, {
    SlideInDown,
    interpolate,
    useAnimatedRef,
    useAnimatedStyle,
    useScrollViewOffset,
} from 'react-native-reanimated';
import { Restaurante , getPlatoRestauranteByID } from '@/app/api/api';

const { width } = Dimensions.get('window');
const IMG_HEIGHT = 300;


  
interface Props {
  restaurante: Restaurante;

}


const MenuRestaurante = ({ restaurante }: Props) => {
    const [estrellas, setEstrellas] = useState<number>(4);
    const [maxEstrellas, setMaxEstrellas] = useState<number>(5);
    const estrella = 'https://github.com/tranhonghan/images/blob/main/star_corner.png?raw=true';
    const estrellaPintada = 'https://github.com/tranhonghan/images/blob/main/star_filled.png?raw=true';
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const { data: plato } = useQuery({queryKey:['plato',restaurante.id],queryFn:()=> getPlatoRestauranteByID(restaurante.id)});

    const platoArray = Array.isArray(plato) ? plato : [plato];

    const pintarEstrellas = (numEstrellas: number) => {
        return Array.from({ length: maxEstrellas }, (_, index) => (
        <TouchableOpacity key={index}>
            <Image
            source={{ uri: index < numEstrellas ? estrellaPintada : estrella }}
            style={{ width: 24, height: 24 }}
            />
        </TouchableOpacity>
        ));
    };
    const scrollOffset = useScrollViewOffset(scrollRef);
    const imageAnimatedStyle = useAnimatedStyle(() => {
        return {
          transform: [
            {
              translateY: interpolate(
                scrollOffset.value,
                [-IMG_HEIGHT, 0, IMG_HEIGHT, IMG_HEIGHT],
                [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
              ),
            },
            {
              scale: interpolate(scrollOffset.value, [-IMG_HEIGHT, 0, IMG_HEIGHT], [2, 1, 1]),
            },
          ],
        };
      });
  return (
    
      <Animated.ScrollView contentContainerStyle={styles.container} ref={scrollRef} scrollEventThrottle={16}>
         <View style={styles.background}>
                <Animated.Image
                    style={[styles.image, imageAnimatedStyle]}
                    source={{ uri: restaurante.foto }}
                />
                <View style={styles.overlay}>
                    <Text style={styles.text}>{restaurante.nombre}</Text>
                    <View style={styles.btnContainer}>
                        <Link href={`/booking/${restaurante.id}`} asChild>
                            <TouchableOpacity style={styles.btnReserva}><Text style={{color:'#fff', fontFamily:'appfont-bold', fontSize:15}}>Reservar</Text></TouchableOpacity>
                        </Link>
                        
                        <Link href={`/mapa/${restaurante.id}`} asChild>
                                <TouchableOpacity
                                  style={{
                                      ...styles.btnUbicacion,
                                  }}
                                  activeOpacity={0.7}
                              >
                                  <Text style={{ color: 'black'}}>
                                      <EvilIcons name="location" size={24} color="black" />
                                  </Text>
                              </TouchableOpacity>
                        </Link>


                    </View>
                </View>
                <View style={styles.strellasContainer}>
                    {pintarEstrellas(estrellas)}
                </View>
            </View>

            <View>
                {plato ? (
                    platoArray.map((item, index) => {
                    if (index % 2 === 0) {
                        const nextItem = platoArray[index + 1];
                        return (
                        <View key={index} style={styles.containercard}>
                            <View style={{ flexDirection: 'row' }}>
                            <Card
                                titles={item.nombre}
                                content={`Precio: $${item.precio}`}
                                imageUrl={item.foto}
                            />
                            {nextItem && (
                                <Card
                                titles={nextItem.nombre}
                                content={`Precio: $${nextItem.precio}`}
                                imageUrl={nextItem.foto}
                                />
                            )}
                            </View>
                        </View>
                        );
                    } else {
                        return null;
                    }
                    })
                ) : (
                    <View style={styles.noPlatosContainer}>
                        <MaterialIcons name="no-food" size={224} color="black" />
                        <Text style={styles.noPlatosText}>No hay platos aún</Text>
                    </View>
                )}
                </View>


                    

      </Animated.ScrollView>
    
  );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    noPlatosContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '25%', 
      },
      noPlatosText: {
        marginTop: 8, 
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
        height: '100%',
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
      btnUbicacion: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        width: 40,
        height: 40,
        backgroundColor:'#E4E4E5'
    },
});

export default MenuRestaurante;