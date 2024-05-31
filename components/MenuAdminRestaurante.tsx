import React, { useState, useEffect,useContext } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity,Image, Dimensions, Modal,ActivityIndicator,TextInput } from 'react-native';
import {  Text, IconButton, Button ,  } from 'react-native-paper';
import { BtnReserva , BtnUbicacion } from "./Button";
import CardAdmin from "./CardAdmin";
import { Link } from 'expo-router';
import { Plato  } from '@/app/api/api';
import { getPlatoRestauranteByID,eliminarPlato,insertarPlato,editarPlato } from '@/app/api/api';
import { Ionicons, MaterialIcons,Feather ,AntDesign} from '@expo/vector-icons';
import { FontAwesome ,Entypo } from '@expo/vector-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import Colors from '@/constants/Colors';
import * as ImagePicker from 'expo-image-picker'; // Para Expo
import { storage } from '@/firebase-config';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Animated, {
    SlideInDown,
    interpolate,
    useAnimatedRef,
    useAnimatedStyle,
    useScrollViewOffset,
} from 'react-native-reanimated';


interface Props {
  id:number
}


const MenuAdminRestaurante = ({ id }: Props) => {


  
    const scrollRef = useAnimatedRef<Animated.ScrollView>();

      const { data: platos , refetch: refetchPlatos } = useQuery({queryKey:['plato',id],queryFn:()=> getPlatoRestauranteByID(id)});

      const platoArray = Array.isArray(platos) ? platos : [platos];



      //ELIMINAR PLATO

      const [showDeleteModal, setShowDeleteModal] = useState(false);
      const [idplato, setIdPlato]= useState(Number);
      const deleteMutation=useMutation({mutationFn: ({ idpla }: { idpla: number }) => eliminarPlato(idpla),
      onSuccess: () => {
        console.log('Plato eliminada corectamente');
        refetchPlatos();
        setShowDeleteModal(false);
      },
      onError: (error: Error) => { 
        console.error('Error al eliminarReserva:', error.message);
      },
      })
      const handleDelete = (idPlato: number) => {
        setIdPlato(idPlato);
        setShowDeleteModal(true);
      };
      const confirmarEliminacion = () => {
        deleteMutation.mutate({ idpla: idplato });
      };
      //INGRESAR PLATO

      const [showIngresoModal, setshowIngresoModal] = useState(false);
      const handleInsertar = () => {
        setNombre('');
        setPrecio('');
        setFoto('');
        setidpalto("");
        setRestaurante('');
        setshowIngresoModal(true);
      };
      interface Item {
        id : number,
        id_restaurante: number,
        nombre: string;
        precio: number;
        foto: string;
      }
      const handleEditar = (item:Item) => {
        setNombre(item.nombre);
        setPrecio(item.precio.toString());
        setFoto(item.foto);
        setidpalto(item.id.toString())
        setRestaurante(item.id_restaurante.toString())
        setshowIngresoModal(true);
      };

      const [nombre, setNombre] = useState('');
      const [precio, setPrecio] = useState('');
      const [foto, setFoto] = useState( '');
      const [idpalto, setidpalto] = useState("");
      const [messageError, setMessageErrot] = useState("Ingresa un nombre de Plato");
      const [messageErrorPrecio, setMessageErroPrecio] = useState("");
      const [messageErrorFoto, setMessageErroFoto] = useState("");
      const [idRestaurante, setRestaurante] = useState( '');
      const precioFormateado = precio.replace(/,/g, '.').trim();
      const precioValido = /^\d+(\.\d{1,2})?$/.test(precioFormateado);
      const handleNombreChange = (text: string) => {
        setNombre(text);
      };
      const handlePrecioChange = (text: string) => {
        if (!precioValido) {
          setMessageErroPrecio("El precio debe estar en el formato correcto, por ejemplo, 34.45");
        }
        if (precioFormateado == "") {
          setMessageErroPrecio("Ingresa un precio de plato");
        }
        setPrecio(text);
      };
      async function pickImage() {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [5, 3],
          quality: 1,
        });

        if (!result.canceled) {
          setFoto(result.assets[0].uri);
          // upload the image
          await uploadImage(result.assets[0].uri);
        }
      }
      async function uploadImage(uri : string) {
        const response = await fetch(uri);
        const blob = await response.blob();

        const storageRef = ref(storage, "Img/" + new Date().getTime());
        const uploadTask = uploadBytesResumable(storageRef, blob);

        // listen for events
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            // handle error
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              console.log("File available at", downloadURL);
              // save record
              setFoto(downloadURL);
            });
          }
        );
      }
      

      const handleEditarPlato = async () => {
        try {


          if (!precioValido) {
            setMessageErroPrecio("El precio debe estar en el formato correcto, por ejemplo, 34.45");
            return;
          }
          if (precioFormateado == "") {
            setMessageErroPrecio("Ingresa un precio de plato");
            return;
          }
          if(!foto){
            setMessageErroFoto("Ingresa una foto")
            return
          }
          if(idpalto!){
            const nuevoPlatoModificar = {
              id:parseInt(idpalto),
              id_restaurante: id,
              nombre: nombre.trim(),
              precio: parseFloat(precioFormateado),
              foto: foto.trim(),
            };
            const idComoNumero = parseInt(idpalto);
            if(nombre == "" || precioFormateado  == "" || foto == ""){
              setMessageErrot("Ingresa un nombre de Plato")
            }
            else{
              await editarPlato(idComoNumero ,nuevoPlatoModificar);
              setshowIngresoModal(false);
              refetchPlatos();
              setNombre('');
              setPrecio('');
              setFoto('');
              setMessageErroFoto('');

            }
          }else{
            const nuevoPlatoInsert = {
              id_restaurante: id,
              nombre: nombre.trim(),
              precio: parseFloat(precio),
              foto: foto.trim()
            };
            if(nombre == "" || precio  == "" || foto == ""){
              setMessageErrot("Ingresa un nombre de Plato")
            }
            else{
              await insertarPlato(nuevoPlatoInsert);
              setshowIngresoModal(false);
              refetchPlatos();
              setNombre('');
              setPrecio('');
              setFoto('');
              setMessageErroFoto('');

            }
          }

        } catch (error) {
          console.error('Error al editar el plato:', error);
        }
        

      };

  return (
    
    <View >
        <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
              {platos !== undefined ? (
                  platoArray.map((item, index) => (
                      <View key={index} >
                          <View style={{ flexDirection: 'row' }}>
                              <View style={styles.card}>
                                          <Image
                                              style={styles.image}
                                              source={{ uri: item.foto }}
                                          />
                                          <View style={styles.cardContent}>
                                              <Text style={styles.title}>{item.nombre}</Text>
                                              <Text>{`Precio: $${item.precio}`}</Text>
                                              
                                          </View>
                                          <View style={[styles.buttonsContainer]}>
                                                  <TouchableOpacity style={styles.button} onPress={() => handleEditar(item)}>
                                                        <Text style={styles.buttonText}><Entypo name="edit" size={15} color="black" /></Text>
                                                    </TouchableOpacity>
                                                  
                                                  <TouchableOpacity style={styles.button} onPress={() => handleDelete(item.id)}>
                                                      <Text style={styles.buttonText}><FontAwesome name="trash-o" size={15} color="black" /></Text>
                                                  </TouchableOpacity>
                                            </View>
                                      
                                  </View>
                          </View>
                      </View>
                  ))
              ) : (
                  <View style={{ alignItems: 'center' }}>
                      <View style={styles.noPlatosContainer}>
                        <MaterialIcons name="no-food" size={224} color="black" />
                        <Text style={styles.noPlatosText}>No hay platos aún</Text>
                    </View>
                  </View>
              )}
              <View style={{alignItems:'center', marginLeft:'10%'}}>
                      <Button
                          mode="contained"
                          style={styles.verMenuButton}
                          labelStyle={styles.verMenuButtonLabel} 
                          onPress={() => handleInsertar()}
                      >
                          Añadir Plato
                      </Button>
              </View>
          </Animated.ScrollView>
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
          <Modal
              animationType="slide"
              transparent={true}
              visible={showIngresoModal}
              onRequestClose={() => setshowIngresoModal(false)}
              >
               <View style={[styles.centeredView,{backgroundColor: 'rgba(0, 0, 0, 0.5)'}] } >
                  <View style={styles.modalView}>
                     <Text style={styles.modalText}>Agrega un nuevo Plato</Text>
                     <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap:10 }}>
                     <View style={styles.container}>
                     {foto?<View style={{ height: 200, margin: 20, position: 'relative' }}>
                            {foto ? <Image source={{ uri: foto }} style={{ width: 230, height: 200 }} /> : null}
                            <TouchableOpacity style={[styles.btnCamera, { position: 'absolute', bottom: 0, right: 0 ,margin:10}]} onPress={pickImage}>
                                <AntDesign name="camera" size={24} color="white" />
                            </TouchableOpacity>
                        </View> :
                        <View style={{margin:20}}>
                            {foto ? <Image source={{ uri: foto }} style={{ width: 230, height: 200 }} /> : <TouchableOpacity style={styles.btnCameraPlus} onPress={pickImage} >
                                <MaterialIcons name="add-a-photo" size={94} color="gray" />
                            </TouchableOpacity>}
                            
                        </View> }
                        <Text style={{color:'red'}}>{messageErrorFoto}</Text>
                        <View>
                          <View style={styles.inputCorrecto}>
                            <Text style={{ fontWeight: 'bold' }}>Nombre</Text>
                            <View style={styles.inputError}>
                              <Feather name="edit" size={20} color="black" />
                              <TextInput
                                style={nombre !== "" ? styles.input : styles.inputErrorNombre}
                                value={nombre}
                                onChangeText={handleNombreChange}
                                placeholder="Nombre del plato"
                              />
                            </View>
                            {nombre !== "" ? null:
                                <Text style={styles.errorText}>{messageError}</Text>
                              }
                          </View>
                        </View>
                      
                        <View>
                          <Text style={{ fontWeight: 'bold' }}>Precio</Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <FontAwesome name="dollar" size={24} color="black" />
                            <TextInput
                              style={(precio.trim() === "" || !precioValido) ? styles.inputPrecioError : styles.inputPrecio}
                              value={precio}
                              onChangeText={handlePrecioChange}
                              placeholder="Precio"
                              keyboardType="numeric"
                            />
                          </View>
                          {(precio.trim() === "" || !precioValido) ? 
                            <Text style={styles.errorText}>{messageErrorPrecio}</Text> 
                            : null
                          }

                        </View>
                        <View style={{ flexDirection: 'row', marginTop:20 }}>
                            <TouchableOpacity  onPress={handleEditarPlato} style={[styles.btnGuardar,]}>
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <FontAwesome name="save" size={24} color="white"  style={{ marginRight: 5 }} />
                                <Text style={styles.modalBtnsTextG}>Guardar</Text>
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity  onPress={() => setshowIngresoModal(false)} style={[styles.btnVolver,]}>
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="arrow-back" size={20} color="black" style={{ marginRight: 5 }} />
                                <Text style={styles.modalBtnsText}>Regresar</Text>
                              </View>
                            </TouchableOpacity>
                        </View>
                      </View>
                          
                    </View>
                  </View>
                </View>
            </Modal>          
    </View>
    
  );
};

const styles = StyleSheet.create({
  errorText:{
    color:'#E5332A'
  },
  inputCorrecto:{
    margin:20,
 
    marginTop:30
  },
  inputErrorV2:{
    borderBottomWidth:1,
    borderColor:'#E5332A',
  },
  inputError: {
    flexDirection: 'row', 
    alignItems: 'center',
  },
  inputErrorNombre: {
    borderBottomWidth:1,
    borderColor:'#E5332A',
    height: 40,
    paddingHorizontal: 10,
    width: 200,
  },
  inputPrecioError: {
    height: 40,
    borderColor: '#E5332A',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 50,
    width: 200,
  },
  
    image: {
      width: 100,
      height: 100,
      borderRadius: 10,
    },
    noPlatosContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '25%', 
      marginLeft:'10%'
    },
    noPlatosText: {
      marginTop: 8, 
    },

      verMenuButton: {
        borderRadius: 90,
        borderWidth:1,
        borderColor:'red',
        backgroundColor: "white",
        color:'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: 250, 
        height: 45,
        marginRight: 10,
      },
      
      verMenuButtonLabel: {
        color:'red',
        fontSize: 14, 
        fontFamily: 'appfont-bold',
      },
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
    
    
      btnVolver:{
        padding:10,
        borderRadius:99,
        borderWidth: 1,
        borderColor: 'black',
      },
      btnGuardar:{
        padding:10,
        borderRadius:99,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: '#4ea93b',
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
      modalBtnsTextG:{
        fontFamily:'appfont-bold',
        fontSize:16,
        color:'white'
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

          //REGISTRAR
          container: {
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
            backgroundColor: '#FDFFFF',
            margin: 0,
            borderRadius: 50,
            height: '90%'
          },
          input: {
            borderBottomWidth:1,
            borderColor:'#E4E4E5',
            height: 40,
            paddingHorizontal: 10,
            width: 200,
          },
          inputPrecio: {
            height: 40,
            borderColor: '#E4E4E5',
            borderWidth: 1,
            paddingHorizontal: 10,
            borderRadius: 50,
            width: 200,
          },
          button2: {
            backgroundColor: '#4ea93b',
            paddingHorizontal: 20,
            paddingVertical: 10,
            margin: 5,
            borderRadius: 5,
            alignItems:'center',
            alignContent:'center'
          },
          cancelButton: {
            backgroundColor: 'red',
          },
          buttonText2: {
            color: 'white',
            fontSize: 16,
          },
          styleTitulo: {
            backgroundColor: '#BC3A31',
            width: 300,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 50
          },
          btnCamera:{
            width:50,
            height:50,
            backgroundColor:'#E5332A',
            borderRadius:50,
            alignItems:'center',
            justifyContent:'center'
          },
          btnCameraPlus:{
            width:230,
            height:230,
            backgroundColor:'#E4E4E5',
            borderRadius:50,
            alignItems:'center',
            justifyContent:'center'
          }
});

export default MenuAdminRestaurante;