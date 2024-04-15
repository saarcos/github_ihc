import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Animated, ActivityIndicator } from 'react-native';
import { Card, Text, IconButton, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import Colors from '@/constants/Colors';
import { Restaurante } from '@/app/api/api';


interface Props {
  restaurante: Restaurante;
}

const Restaurantes = ({ restaurante }: Props) => {
  // const [imagena, imagenb] = useState<string[]>(restaurante.imagen);
  const [opacity] = useState(new Animated.Value(1));
  const [favoritos, setFavoritos] = useState<boolean>(false);
  const [imagenCargando, setImagenCargando] = useState(true);


  // useEffect(() => {
  //   const intervaloId = setInterval(() => {
  //     Animated.timing(opacity, {
  //       toValue: 0,
  //       duration: 500,
  //       useNativeDriver: true,
  //     }).start(() => {
  //       imagenb(imagenAnterior => {
  //         const imagenActualIndex = imagenAnterior.findIndex(imagen => imagen === imagena[0]);
  //         const imagenSiguiente = (imagenActualIndex + 1) % imagenAnterior.length;
  //         return [imagenAnterior[imagenSiguiente]];
  //       });
  //       Animated.timing(opacity, {
  //         toValue: 1,
  //         duration: 500,
  //         useNativeDriver: true,
  //       }).start();
  //     });
  //   }, 5000);

  //   return () => clearInterval(intervaloId);
  // }, []);

  const toggleFavorito = () => {
    setFavoritos(prevFavorito => !prevFavorito);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Card>
          <View style={styles.imagenContenedor}>
            <Animated.Image
              source={{ uri: restaurante.foto }}
              style={[styles.imagen, { opacity, borderRadius: 10 }]}
              onLoad={() => setImagenCargando(false)}
            />
          </View>
          {imagenCargando && (
              <ActivityIndicator style={styles.spinner} size="large" color="gray" />
          )}
          <Card.Content style={styles.cardContent}>
            <View style={styles.infoContainer}>
              <View style={styles.tituloContainer}>
                <Text style={styles.titulo}>{restaurante.nombre}</Text>
              </View>
              <Text>{restaurante.direccion}</Text>
              <Link href={`/menu/${restaurante.id}`} asChild>
              <Button
                mode="contained"
                style={styles.verMenuButton}
                labelStyle={styles.verMenuButtonLabel} 
              >
                Ver Menú
              </Button>
              </Link>
              
            </View>
            <View style={styles.iconoContainer}>
              <IconButton
                icon={() => (
                  <MaterialCommunityIcons
                    name={favoritos ? 'heart' : 'heart-outline'}
                    size={30}
                    color={favoritos ? 'red' : 'black'}
                  />
                )}
                onPress={toggleFavorito}
              />
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  spinner: {
    position: 'absolute',
    top: '35%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  imagenContenedor: {
    alignItems: 'center',
    position: 'relative',
  },
  imagen: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  infoContainer: {
    flex: 1,
  },
  tituloContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 20,
    marginRight: 10,
    fontFamily: 'appfont-bold', 
  },
  iconoContainer: {
    marginLeft: 'auto',
  },
  verMenuButton: {
    borderRadius: 10,
    backgroundColor: Colors.red,
    justifyContent: 'center',
    alignItems: 'center',
    width: 150, 
    height: 40,
    marginRight: 10,
  },
  
  verMenuButtonLabel: {
    fontSize: 14, 
    fontFamily: 'appfont-bold',
  },
  
});

export default Restaurantes;
