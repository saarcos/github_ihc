import React from 'react';
import { StyleSheet, Text, View, Image ,TouchableOpacity, Alert  } from 'react-native';
import { FontAwesome ,Entypo } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { eliminarPlato } from '@/app/api/api';
interface CardsAtributos {
    titles: string;
    content: string;
    imageUrl: string;
    id : number;
    idRestaurante:number;
}
const CardAdmin = (props : CardsAtributos) => {
    const {titles , content,imageUrl , id ,idRestaurante} = props


    const handleEliminarPlato = async () => {
      try {
         await eliminarPlato(id)
      } catch (error) {
        console.error('Error al eliminar el plato:', error);
      }
    };
    const handleDelete = () => {
        Alert.alert(
            'Confirmar eliminación',
            '¿Estás seguro de que deseas eliminar este plato?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', onPress: () => handleEliminarPlato() } 
            ]
        );
    };

    
    return (
        <View style={styles.card}>
            <Image
                style={styles.image}
                source={{ uri: imageUrl }}
            />
            <View style={styles.cardContent}>
                <Text style={styles.title}>{titles}</Text>
                <Text>{content}</Text>
                
            </View>
            <View style={[styles.buttonsContainer]}>
                  <Link href={`/editarPlato/${id}`} asChild>
                    <TouchableOpacity style={styles.button} >
                          <Text style={styles.buttonText}><Entypo name="edit" size={15} color="black" /></Text>
                      </TouchableOpacity>
                    </Link>
                    
                    <TouchableOpacity style={styles.button} onPress={handleDelete}>
                        <Text style={styles.buttonText}><FontAwesome name="trash-o" size={15} color="black" /></Text>
                    </TouchableOpacity>
                </View>
    </View>
    );
  }
  
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E4E4E5',
    width: '90%',
    borderRadius: 10,
    padding: 10,
    margin:20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  buttonsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 10,
    },
    button: {
        backgroundColor: 'transparent',
        borderColor: '2px solid black',
        borderWidth:1.5,
        padding: 10,
        borderRadius: 5,
        width: 50,
        height:40,
    },
    buttonText: {
        color: '#FFF',
        textAlign: 'center',
    },
  cardContent: {
    alignItems:'center',
    justifyContent:'center',
    marginTop: 10,
    marginLeft:10
  },
  title: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
});

export default CardAdmin;
