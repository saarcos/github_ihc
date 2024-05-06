import React, { useEffect, useState, useLayoutEffect, useMemo } from 'react';
import { View, StyleSheet, Image, ActivityIndicator, Text, ScrollView, FlatList, Modal, TouchableHighlight, TouchableOpacity } from 'react-native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { useNavigation } from 'expo-router';
import { Restaurante, getRestaurantes, Categoria, getCategoria, getPlatos } from '../api/api';
import Categorias from '@/components/Categorias';
import Colors from '@/constants/Colors';
import Restaurantes from '@/components/Restaurantes';
import { defaultStyles } from '@/constants/Styles';
import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Page = () => {
    const { data: restaurantes, isLoading: loadingRestaurantes, isError: errorRestaurantes } = useQuery({
        queryKey: ['restaurants'],
        queryFn: getRestaurantes,
    });
    const { data: categorias, isLoading: loadingCategorias, isError: errorCategorias } = useQuery({
        queryKey: ['categorias'],
        queryFn: getCategoria,
    });
    const { data: platos, isLoading: loadingPlatos, isError: errorPlatos } = useQuery({
        queryKey: ['platos'],
        queryFn: getPlatos,
    });
    const navigation = useNavigation();
    const [activeCategory, setActiveCategory] = useState<number | null>(-1); // Inicializa con un valor que represente "ver todos"
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null); // Inicializa con un valor nulo

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <Image
                    source={require('../(modals)/Imagen/logoBlanco.png')}
                    style={{ width: 47, height: 45 }}
                />
            ),
            headerTitleStyle: styles.headerTitle,
            headerStyle: {
                backgroundColor: '#E5332A',
            },
        });
    }, []);

    const handleCategoryPress = (categoryId: number) => {
        if (categoryId === -2) {
            // Si se hizo clic en la categoría "Precio", abre la ventana modal
            setModalVisible(true);
        } else {
            setActiveCategory(categoryId);
            setSelectedPriceRange(null); // Resetea el rango de precios seleccionado
        }
    };

    const handlePriceRangeSelect = (priceRange: string) => {
        setSelectedPriceRange(priceRange);
        setModalVisible(false); // Cierra la ventana modal
        setActiveCategory(null); // Desactiva cualquier categoría activa
    };

    // Filtrar restaurantes según la categoría activa o el rango de precios seleccionado
    const filteredRestaurantes = useMemo(() => {
        if (selectedPriceRange) {
            // Obtener los platos dentro del rango de precios seleccionado
            const platosInRange = platos ? platos.filter(plato => {
                const [minPrice, maxPrice] = selectedPriceRange.split(' - ');
                return plato.precio >= parseFloat(minPrice.replace('$', '')) && plato.precio <= parseFloat(maxPrice.replace('$', ''));
            }) : [];

            // Obtener los IDs de los restaurantes asociados con esos platos
            const restaurantIds = platosInRange.map(plato => plato.id_restaurante);

            // Filtrar los restaurantes que tienen platos dentro del rango de precios seleccionado
            return restaurantes ? restaurantes.filter(restaurante => restaurantIds.includes(restaurante.id)) : [];
        } else if (activeCategory !== -1) {
            // Filtrar por categoría activa
            return restaurantes ? restaurantes.filter(restaurante => restaurante.categoria_id === activeCategory) : [];
        } else {
            return restaurantes || [];
        }
    }, [restaurantes, platos, activeCategory, selectedPriceRange]);

    return (
        <View  style={[defaultStyles.container, { padding: 10 }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriasContainer} >
                  {loadingCategorias && <ActivityIndicator style={styles.spinner} size="large" color={Colors.dark} />}
                  {errorCategorias && <Text>Error al cargar las categorías</Text>}
                  {categorias &&
                      [...categorias, { id: -2, nombre: 'Precio' }].map(categoria => (
                          <Categorias
                              key={categoria.id}
                              categoriaId={categoria.id}
                              nombre={categoria.nombre}
                              setActiveCategory={handleCategoryPress}
                              isActive={categoria.id === activeCategory}
                          />
                      ))}
              </ScrollView>

              {loadingRestaurantes && <ActivityIndicator style={styles.spinner} size="large" color={Colors.dark} />}
              {errorRestaurantes && <Text>Error al cargar los restaurantes</Text>}
              {!loadingRestaurantes && !errorRestaurantes && (
                        <FlatList
                        data={filteredRestaurantes}
                        renderItem={({ item }) => <Restaurantes restaurante={item} isFavoriteView={true} />}
                        style={{ height: filteredRestaurantes.length > 1  && filteredRestaurantes.length > 0 ? 'auto' : '100%' }} 
                    />
              )}

            {/* Ventana modal para la lista de precios */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                      <Text style={styles.modalTitle}>Precios:</Text>
                      <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>X</Text>
                      </TouchableOpacity>
                      <TouchableHighlight
                          style={{ ...styles.openButton, backgroundColor: Colors.primary }}
                          onPress={() => handlePriceRangeSelect("$1 - $5")}
                      >
                          <Text style={styles.textStyle}>$1 - $5</Text>
                      </TouchableHighlight>
                      <TouchableHighlight
                          style={{ ...styles.openButton, backgroundColor: Colors.primary }}
                          onPress={() => handlePriceRangeSelect("$5 - $10")}
                      >
                          <Text style={styles.textStyle}>$5 - $10</Text>
                      </TouchableHighlight>
                      {/* Agrega más botones para otros rangos de precios */}
                      <TouchableHighlight
                          style={{ ...styles.openButton, backgroundColor: Colors.primary }}
                          onPress={() => handlePriceRangeSelect("$10 - $15")}
                      >
                          <Text style={styles.textStyle}>$10 - $15</Text>
                      </TouchableHighlight>
                      {/* Agrega más botones para otros rangos de precios */}
                      <TouchableHighlight
                          style={{ ...styles.openButton, backgroundColor: Colors.primary }}
                          onPress={() => handlePriceRangeSelect("$15 - $20")}
                      >
                          <Text style={styles.textStyle}>$15 - $20</Text>
                      </TouchableHighlight>
                    </View>  
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    headerTitle: {
        fontFamily: 'appfont-bold',
        fontSize: 22,
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 999, // Asegura que esté por encima de otros elementos en la modal
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 20,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
  },
  closeButtonText: {
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
  },
    categoriasContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
    },
    spinner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
      flex: 2,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 30,
      width: '80%', // Reducir el ancho de la ventana modal
      maxHeight: '80%',
      justifyContent: 'center', // Centra los elementos verticalmente
      alignItems: 'center',  // Limitar la altura de la ventana modal
    },
    modalTitle: {
      fontSize: 24,
      marginBottom: 20,
      fontWeight: 'bold', // Añade negrita al texto
      textAlign: 'center',
    },
    openButton: {
        backgroundColor: '#F194FF',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginBottom: 10, 
        width: 120,
        justifyContent: 'center', // Centra el contenido verticalmente
        alignItems: 'center',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default gestureHandlerRootHOC(Page);
