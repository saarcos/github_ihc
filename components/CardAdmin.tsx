import React, { useState } from 'react'
import { StyleSheet, Text, View, Image ,TouchableOpacity, Modal,ActivityIndicator } from 'react-native';
import { FontAwesome ,Entypo } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import Colors from '@/constants/Colors';
import { eliminarPlato } from '@/app/api/api';
import { useMutation, useQuery } from '@tanstack/react-query';

interface CardsAtributos {
    titles: string;
    content: string;
    imageUrl: string;
    id : number;
    idRestaurante:number;
}
const CardAdmin = (props : CardsAtributos) => {
    const {titles , content,imageUrl , id ,idRestaurante} = props;
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const router = useRouter();
    const deleteMutation=useMutation({mutationFn: ({ idReserva }: { idReserva: number }) => eliminarPlato(idReserva),
    onSuccess: () => {
      console.log('Plato eliminada corectamente');
      setShowDeleteModal(false);
    },
    onError: (error: Error) => { 
      console.error('Error al eliminarReserva:', error.message);
    },
    })
    const handleDelete=()=>{
      setShowDeleteModal(true);
    }
    const confirmarEliminacion = () => {
      deleteMutation.mutate({ idReserva: id });
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


                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={showDeleteModal}
                  onRequestClose={() => setShowDeleteModal(false)}
                >
                  <View style={[styles.centeredView,{backgroundColor: 'rgba(0, 0, 0, 0.5)'}] } >
                    <View style={styles.modalView}>
                      <Text style={styles.modalText}>¿Estás seguro de que deseas eliminar este plato?</Text>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, gap:10 }}>

                        <TouchableOpacity  onPress={() => setShowDeleteModal(false)} style={[styles.btnVolver,]}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="arrow-back" size={20} color="black" style={{ marginRight: 5 }} />
                            <Text style={styles.modalBtnsText}>Regresar</Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={confirmarEliminacion} style={styles.btnEliminar}>
                            {deleteMutation.isPending ? (
                              <ActivityIndicator color={Colors.white} /> // Muestra el spinner si la mutación está en curso
                            ) : (
                              <Text style={[styles.modalBtnsText, { color: Colors.white }]}>Eliminar</Text> // Muestra "Eliminar" cuando no hay operación en curso
                            )}
                        </TouchableOpacity>            
                      </View>
                    </View>
                  </View>
                </Modal>
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


  btnVolver:{
    padding:10,
    borderRadius:99,
    borderWidth: 1,
    borderColor: 'black',
  },
  btnEliminar:{
    backgroundColor:Colors.red,
    padding:10,
    borderRadius:99,
  },
  modalBtnsText:{
    fontFamily:'appfont-bold',
    fontSize:16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'appfont-semi',
  },
  reservaPasada: {
    opacity: 0.5, // Esto reducirá la opacidad de las reservas pasadas para mostrarlas como desactivadas
  },
  btnCancelarAppointment: {
    backgroundColor: Colors.wine, // Color de fondo del botón
    paddingVertical: 5, // Espaciado vertical dentro del botón
    paddingHorizontal: 10, // Espaciado horizontal dentro del botón
    borderRadius: 5, // Radio de borde para hacerlo redondeado
  },
  btnText: {
    color: 'white', // Color del texto dentro del botón
    fontFamily: 'appfont-semi', // Familia de fuente del texto
    fontSize: 16, // Tamaño del texto
  },
    imgCard:{
        height:100,
        width:90,
        borderRadius:10,
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: Colors.wine,
        marginVertical: 16,
      },
});

export default CardAdmin;
