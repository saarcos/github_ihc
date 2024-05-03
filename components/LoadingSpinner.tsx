import React from 'react';
import { View, Image, StyleSheet, Text} from 'react-native';

// Estilo para el GIF de carga
const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white', // Fondo blanco
      },
  loadingImage: {
    width:150,
    height:150,
    margin:0
  },
  loadingImage2: {
    width:100,
    height:100,
    marginTop:-50,
  },
});

// Componente de carga
const LoadingSpinner = () => (
  <View style={styles.loadingContainer}>
    <Image
      style={[styles.loadingImage]}
      source={require('../assets/images/loadingfood.gif')} // Ruta a tu archivo GIF de carga
    />
    <Image
      style={[styles.loadingImage2]}
      source={require('../assets/images/loading2.gif')} // Ruta a tu archivo GIF de carga
    />
  </View>
);

export default LoadingSpinner;
