import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextStyle } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons'; // Importa FontAwesome en lugar de FontAwesomeIcon

const categoriaIconos: { [key: string]: string } = {
    "Todos": "utensils", // Cambiado a "utensils" para representar utensilios de comida
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
    isActive: boolean; 
    // Indica si la categoría está activa o no
}

const Categorias = ({ categoriaId, nombre, setActiveCategory, isActive  }: Props) => {
    let textClass: TextStyle = isActive ? { fontWeight: 'bold', color: 'gray' } : { color: 'gray' };

    // Agregamos un condicional para verificar si el nombre es "Todos" y cambiar el color del texto si está activo
    if (nombre === "Todos" && isActive) {
        textClass.color = 'gray';
    }

    // Verifica si la categoría actual es "Todos" y si está activa, para activar el estilo
    if (nombre === "Todos" && isActive) {
        textClass = { fontWeight: 'bold', color: 'gray' };
    }

    

    return (
        <View style={{ marginHorizontal: 5, alignItems: 'center' }}>
            <TouchableOpacity onPress={() => setActiveCategory(categoriaId)} style={{ padding: 10, borderRadius: 45 }}>
                <FontAwesome6
                    name={categoriaIconos[nombre]}
                    size={35}  // Reducir el tamaño del icono a 40
                    color={isActive ? 'red' : 'black'} 
                />
            </TouchableOpacity>
            <Text style={[{ textAlign: 'center', fontSize: 10 }, textClass]}>{nombre}</Text>
        </View>
    );
}

export default Categorias;
