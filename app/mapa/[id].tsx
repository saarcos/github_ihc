import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Alert, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { getRestauranteByID } from '../api/api';
import Colors from '@/constants/Colors';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_KEY } from '@/components/enviroments';
import { useQuery } from '@tanstack/react-query';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const Page = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const idComoNumero = parseInt(id);
  const { data: restaurante } = useQuery({
    queryKey: ['Restaurante', idComoNumero],
    queryFn: () => getRestauranteByID(idComoNumero),
  });

  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<any>(null); // Cambiado a any para flexibilidad de tipo
  const [destination, setDestination] = useState<any>(null); // Cambiado a any para flexibilidad de tipo

  useEffect(() => {
    getLocationPermission();
  }, []);

  useEffect(() => {
    if (restaurante) {
      navigation.setOptions({
        headerTitle: restaurante.nombre,
        headerTransparent: true,
        headerTitleStyle: {
          color: '#000',
          marginLeft: 10,
        },
        headerLeft: () => (
          <TouchableOpacity style={styles.roundButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={'#000'} />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, restaurante]);

  const getLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permiso de ubicación denegado');
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });

      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        });
      }
    } catch (error: any) {
      console.log('Error al obtener la ubicación:', error.message);
      Alert.alert('Error', 'No se pudo obtener la ubicación actual del usuario.');
    }
  };

  const handleCenterMap = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    }
  };

  const onPlaceSelected = async (direccion: string | null) => {
    if (direccion) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            direccion
          )}&key=${GOOGLE_MAPS_KEY}`
        );
        const data = await response.json();
  
        if (data.error_message) {
          throw new Error(data.error_message); // Manejar errores de la API de Google Maps
        }
  
        if (data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          const destinationCoords = { latitude: lat, longitude: lng };
          setDestination(destinationCoords);
  
          if (mapRef.current) {
            mapRef.current.animateToRegion({
              ...destinationCoords,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            });
          }
        } else {
          console.log('No se encontraron coordenadas para la dirección:', direccion);
          Alert.alert('Error', 'No se encontraron coordenadas para la dirección proporcionada.');
        }
      } catch (error) {
        console.error('Error al obtener coordenadas:', error);
        Alert.alert('Error', 'Hubo un problema al obtener las coordenadas.');
      }
    } else {
      console.log('La dirección proporcionada es nula o vacía.');
      Alert.alert('Error', 'La dirección proporcionada es inválida.');
    }
  };

  useEffect(() => {
    if (restaurante && restaurante.direccion) {
      onPlaceSelected(restaurante.direccion);
    }
  }, [restaurante]);

  useEffect(() => {
    if (userLocation && destination && mapRef.current) {
      const points = [userLocation, destination];

      // Calcula los límites de la región que contiene ambas ubicaciones
      mapRef.current.fitToCoordinates(points, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }, // Margen para asegurar que los puntos estén en la pantalla
      });
    }
  }, [userLocation, destination]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: userLocation?.latitude || 0,
          longitude: userLocation?.longitude || 0,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >
        {/* Marcador de la ubicación del usuario */}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="Mi ubicación"
            pinColor="blue"
          />
        )}

        {/* Marcador del restaurante (destino) */}
        {restaurante && destination && (
          <Marker
            coordinate={destination}
            title={restaurante.nombre}
            description={restaurante.direccion} // Descripción opcional con la dirección
          />
        )}

        {/* Direcciones en el mapa si se ha seleccionado un destino */}
        {userLocation && restaurante && destination && (
          <MapViewDirections
            origin={userLocation}
            destination={destination}
            apikey={GOOGLE_MAPS_KEY}
            strokeWidth={8}
            strokeColor={Colors.primary}
          />
        )}
      </MapView>

      {/* Botón para centrar el mapa en la ubicación del usuario */}
      {userLocation && (
        <TouchableOpacity style={styles.centerButton} onPress={handleCenterMap}>
          <Ionicons name="paper-plane-outline" size={24} color="#fff" />
          <Text style={styles.centerButtonText}>Centrar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    color: Colors.primary,
  },
  centerButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButtonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 8,
  },
});

export default Page;