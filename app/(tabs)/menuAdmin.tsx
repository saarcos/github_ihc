import { View, Text, StyleSheet, FlatList , Image} from 'react-native'
import React, { useState } from 'react'
import { Link } from 'expo-router';
import { Button } from 'react-native-paper';

interface Restaurante {
    id:number;
    titulo: string;
    imagen: string[];
    direccion: string;
  }
  
  interface Props {
    restaurante: Restaurante;
  }

const Page = () => {
  
  return (
    <View>
        <Text>Hola</Text>
        <Link href={`/menuAdmin/${"6"}`} asChild>
              <Button
                mode="contained"
                onPress={() => console.log("Ver menú")}
              >
                Ver Menú
              </Button>
              </Link>
      
    </View>
  )
}
const styles = StyleSheet.create({

})

export default Page