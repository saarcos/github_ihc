import React from 'react';
import { View, Text, TouchableOpacity, TextStyle } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons'; // Importa FontAwesome en lugar de FontAwesomeIcon

const categoriaIconos: { [key: string]: string } = {
    "Comida rápida": "pizza-slice",
    "Mariscos": "shrimp",
    "Sushi": "fish",
    "Mexicana": "pepper-hot",
    "Precio": "money-bill"
};

interface Props {
    categoriaId: number; // Solo el id de la categoría
    nombre: string; // Nombre de la categoría
    setActiveCategory: (categoryId: number) => void; // Función para establecer la categoría activa
    isActive: boolean; // Indica si la categoría está activa o no
}

const Categorias = ({ categoriaId, nombre, setActiveCategory, isActive }: Props) => {
    let textClass: TextStyle = isActive ? { fontWeight: 'bold', color: 'gray' } : { color: 'gray' };

    return (
        <View style={{ marginHorizontal: 5, alignItems: 'center' }}>
            <TouchableOpacity onPress={() => setActiveCategory(categoriaId)} style={{ padding: 15, borderRadius: 50 }}>
                <FontAwesome6
                    name={categoriaIconos[nombre]}
                    size={50} 
                    color={isActive ? 'red' : 'black'} 
                />
            </TouchableOpacity>
            <Text style={[{ textAlign: 'center', fontSize: 12 }, textClass]}>{nombre}</Text>
        </View>
    );
}

export default Categorias;
