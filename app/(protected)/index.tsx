import React, { useEffect, useState, useLayoutEffect, useMemo } from 'react';
import { View, StyleSheet, Image, ActivityIndicator, Text, ScrollView, FlatList, Modal, TouchableHighlight, TouchableOpacity } from 'react-native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { useNavigation } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { MaterialIcons } from '@expo/vector-icons';
import Categorias from '@/components/Categorias';
import Colors from '@/constants/Colors';
import Restaurantes from '@/components/Restaurantes';
import { defaultStyles } from '@/constants/Styles';
import Card2 from '@/components/Card';
import { Link } from 'expo-router';
import { Button } from 'react-native-paper';
import {  getRestaurantes,  getCategoria, getPlatos } from '../api/api';

interface Plato {
    id: number;
    nombre: string;
    precio: number;
    foto: string;
    id_restaurante: number;
}

interface PlatosModalProps {
    isVisible: boolean;
    platos: Plato[];
    onBack: () => void;
    onClose: () => void;
}
const PlatosModal: React.FC<PlatosModalProps> = ({ isVisible, platos, onBack, onClose }) => {
    if (platos.length > 0) {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={isVisible}
                onRequestClose={onClose}
            >
                <View style={styles.modalContainer1}>
                    <ScrollView contentContainerStyle={styles.modalContent1}>
                        <Text style={styles.modalTitle}>Platos:</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}
                        >
                            <Text style={styles.closeButtonText}>X</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={onBack}
                        >
                            <MaterialIcons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        {platos.map((item, index) => {
                            if (index % 2 === 0) {
                                const nextItem = platos[index + 1];
                                return (
                                    <View key={index} style={styles.containerCard}>
                                        <View style={styles.cardWrapper}>
                                            <Card2
                                                titles={item.nombre}
                                                content={`Precio: $${item.precio}`}
                                                imageUrl={item.foto}
                                            />
                                             <Link href={`/menu/${item.id_restaurante}`} asChild>
                                                    <Button
                                                        mode="contained"
                                                        style={styles.verMenuButton}
                                                        labelStyle={styles.verMenuButtonLabel}
                                                    >
                                                        Ver Menú
                                                    </Button>
                                            </Link>
                                            {nextItem && (
                                                <Card2
                                                    titles={nextItem.nombre}
                                                    content={`Precio: $${nextItem.precio}`}
                                                    imageUrl={nextItem.foto}
                                                />
                                                
                                            )}
                                            {nextItem && (
                                                    <Link href={`/menu/${nextItem.id_restaurante}`} asChild>
                                                        <Button
                                                            mode="contained"
                                                            style={styles.verMenuButton}
                                                            labelStyle={styles.verMenuButtonLabel}
                                                        >
                                                            Ver Menú
                                                        </Button>
                                                    </Link>
                                            )}
                                        </View>
                                    </View>
                                );
                            } else {
                                return null;
                            }
                        })}
                    </ScrollView>
                </View>
            </Modal>
        );
    } else {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={isVisible}
                onRequestClose={onClose}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>No hay platos aún</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}
                        >
                            <Text style={styles.closeButtonText}>X</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={onBack}
                        >
                            <MaterialIcons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <MaterialIcons name="no-food" size={100} color="black" />
                        <Text style={styles.noPlatosText}>No hay platos disponibles en este momento.</Text>
                    </View>
                </View>
            </Modal>
        );
    }
};



const Page: React.FC = () => {
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
    const [platosModalVisible, setPlatosModalVisible] = useState(false);
    const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null); // Inicializa con un valor nulo
    const [filteredPlatos, setFilteredPlatos] = useState<Plato[]>([]);

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
        setSelectedPriceRange(null); // Resetea el rango de precios seleccionado al cambiar de categoría
        if (categoryId === -2) {
            setModalVisible(true);
        } else {
            setActiveCategory(categoryId);
            if (categoryId === -1) {
                setSelectedPriceRange(null);
            }
        }
    };

    const handlePriceRangeSelect = (priceRange: string) => {
        setSelectedPriceRange(priceRange);
        setModalVisible(false); // Cierra la ventana modal
        if (platos) {
            const [minPrice, maxPrice] = priceRange.split(' - ').map(price => parseFloat(price.replace('$', '')));
            const platosInRange = platos.filter(plato => plato.precio >= minPrice && plato.precio <= maxPrice);
            setFilteredPlatos(platosInRange);
        }
        setPlatosModalVisible(true); // Abre la ventana modal de platos
    };

 

    // Filtrar restaurantes según la categoría activa
    const filteredRestaurantes = useMemo(() => {
        if (activeCategory !== -1) {
            return restaurantes ? restaurantes.filter(restaurante => restaurante.categoria_id === activeCategory) : [];
        } else {
            return restaurantes || [];
        }
    }, [restaurantes, activeCategory]);

    const handleBack = () => {
        setPlatosModalVisible(false);
        setModalVisible(true);
    };

    const handlePlatosModalClose = () => {
        setPlatosModalVisible(false);
    };
    
    useEffect(() => {
        let savedCategory = -1; // Categoría activa guardada
    
        // Restablecer la categoría activa y cerrar la ventana modal de platos cuando regresas a la página de inicio
        const unsubscribe = navigation.addListener('focus', () => {
            if (savedCategory !== -1) {
                setActiveCategory(savedCategory); // Establece la categoría activa guardada
            }
            setPlatosModalVisible(false); // Cierra la ventana modal de platos
        });
    
        return unsubscribe;
    }, [navigation]);

    return (
        <View style={[defaultStyles.container, { padding: 10 }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriasContainer}>
                {loadingCategorias && <ActivityIndicator style={styles.spinner} size="large" color={Colors.dark} />}
                {errorCategorias && <Text>Error al cargar las categorías</Text>}
                {categorias &&
                    [{ id: -1, nombre: 'Todos' }, ...categorias, { id: -2, nombre: 'Precio' }].map(categoria => (
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
                    style={{ height: filteredRestaurantes.length > 1 && filteredRestaurantes.length > 0 ? 'auto' : '100%' }}
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
                        <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: Colors.primary }}
                            onPress={() => handlePriceRangeSelect("$10 - $15")}
                        >
                            <Text style={styles.textStyle}>$10 - $15</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: Colors.primary }}
                            onPress={() => handlePriceRangeSelect("$15 - $20")}
                        >
                            <Text style={styles.textStyle}>$15 - $20</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>

            <PlatosModal
                isVisible={platosModalVisible}
                platos={filteredPlatos}
                onBack={handleBack}
                onClose={handlePlatosModalClose}
            />
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
        zIndex: 999,
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 30,
        width: '90%', 
        maxHeight: '90%', 
        justifyContent: 'center', 
        alignItems: 'center', 
    },
    modalTitle: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold', 
        textAlign: 'center',
    },
    openButton: {
        backgroundColor: '#F194FF',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginBottom: 10,
        width: 120,
        justifyContent: 'center', 
        alignItems: 'center',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalContainer1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent1: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 50,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerCard: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardWrapper: {
        justifyContent: 'center', 
        alignItems: 'center',
        width: '100%',
        flexDirection: 'column',
    },
    noPlatosContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 30,
        width: '90%', 
        maxHeight: '90%', 
        justifyContent: 'center', 
        alignItems: 'center', 
    },
    noPlatosText: {
        marginTop: 10,
    },
    btnClose: {
        marginTop: 20,
        paddingVertical: 10,
        backgroundColor: Colors.red,
        borderRadius: 5,
        alignItems: 'center',
    },
    btnCloseText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 999,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    verMenuButton: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        width: 120,
        height: 40,
        marginRight: 10,
        backgroundColor: Colors.red,
    },
    verMenuButtonLabel: {
        fontSize: 14, 
        fontFamily: 'appfont-bold',
        color: 'white',
    },
});

export default gestureHandlerRootHOC(Page);