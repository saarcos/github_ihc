import React, { useEffect, useState, useCallback, useLayoutEffect } from 'react';
import { View, StyleSheet, Image, Text, FlatList, ActivityIndicator } from 'react-native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { useNavigation } from 'expo-router';
import Colors from '@/constants/Colors';
import Restaurantes from '@/components/Restaurantes';
import { defaultStyles } from '@/constants/Styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Restaurante } from '@/app/api/api';

const Page = () => {
    const navigation = useNavigation();
    const [favoritos, setFavoritos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const cargarFavoritos = useCallback(async () => {
        try {
            const favoritosActuales = await AsyncStorage.getItem('favoritos') || '[]';
            const nuevosFavoritos = JSON.parse(favoritosActuales);
            setFavoritos(nuevosFavoritos);
            setLoading(false);
        } catch (error) {
            console.error('Error al cargar favoritos:', error);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        cargarFavoritos();
    }, [cargarFavoritos]);

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
                backgroundColor: '#803530',
            },
        });
    }, [navigation]);

    const handleRemoveFromFavorites = async (restauranteId: number) => {
        const updatedFavoritos = favoritos.filter(restaurante => restaurante.id !== restauranteId);
        setFavoritos(updatedFavoritos);
        await AsyncStorage.setItem('favoritos', JSON.stringify(updatedFavoritos));
    };

    const renderItem = ({ item }: { item: Restaurante }) => {
        return (
            <Restaurantes restaurante={item}/>
        );
    };

    return (
        <View style={[defaultStyles.container, { padding: 10 }]}>
            {loading ? (
                <ActivityIndicator size="large" color={Colors.dark} />
            ) : (
                <FlatList
                    data={favoritos}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    ListEmptyComponent={<Text style={styles.emptyMessage}>No hay restaurantes favoritos</Text>}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    emptyMessage: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: Colors.dark,
    },
    headerTitle: {
        fontFamily: 'appfont-bold',
        fontSize: 22,
    },
});

export default gestureHandlerRootHOC(Page);
