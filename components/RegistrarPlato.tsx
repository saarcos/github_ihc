import React, { useState  } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text, Platform, Image  } from 'react-native';
import { Feather, MaterialIcons, FontAwesome,AntDesign  } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; // Para Expo
import { Plato ,editarPlato , insertarPlato } from '@/app/api/api';
import Id from '@/app/editarPlato/[id]';
import { storage } from '@/firebase-config';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import firebase from 'firebase/app';
import { Link, useRouter} from 'expo-router'; 


interface Props {
  idRestaurante: number,
}

const RegistrarPlato = ({ idRestaurante }: Props) => {



  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [foto, setFoto] = useState( '');



  const handleNombreChange = (text: string) => {
    setNombre(text);
  };

  const handlePrecioChange = (text: string) => {
    setPrecio(text);
  };



  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
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
  
  const router = useRouter();

  const handleEditarPlato = async () => {
    try {
      const nuevoPlatoInsert = {
        id_restaurante: idRestaurante,
        nombre: nombre,
        precio: parseFloat(precio),
        foto: foto
      };

      await insertarPlato(nuevoPlatoInsert);
    } catch (error) {
      console.error('Error al editar el plato:', error);
    }
    setNombre('');
    setPrecio('');
    setFoto('');
    router.back();
  };


  return (
    <View style={styles.container}>
      <View style={styles.styleTitulo}>
        <Text style={{ color: 'white', fontSize: 20 }}>
            Añadir Plato
        </Text>
      </View>
            <View style={{margin:20}}>
                {foto ? <Image source={{ uri: foto }} style={{ width: 230, height: 200 }} /> : <TouchableOpacity style={styles.btnCameraPlus} onPress={pickImage} >
                    <MaterialIcons name="add-a-photo" size={94} color="gray" />
                </TouchableOpacity>}
                
            </View> 
        
      <View style={{ margin: 20, borderBottomWidth: 1, borderColor: '#E4E4E5', marginTop:30 }}>
        <Text style={{ fontWeight: 'bold' }}>Nombre</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Feather name="edit" size={20} color="black" />
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={handleNombreChange}
            placeholder="Nombre del plato"
          />
        </View>
      </View>
      <View>
        <Text style={{ fontWeight: 'bold' }}>Precio</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesome name="dollar" size={24} color="black" />
          <TextInput
            style={styles.inputPrecio}
            value={precio}
            onChangeText={handlePrecioChange}
            placeholder="Precio"
            keyboardType="numeric"
          />
        </View>
      </View>

      
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity style={styles.button} onPress={handleEditarPlato}>
          <Text style={styles.buttonText}><FontAwesome name="save" size={24} color="white" /></Text>
          <Text style={{color:'white'}}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FDFFFF',
    margin: 20,
    borderRadius: 50,
    height: '90%'
  },
  input: {
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
  button: {
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
  buttonText: {
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
    width:250,
    height:250,
    backgroundColor:'#E4E4E5',
    borderRadius:50,
    alignItems:'center',
    justifyContent:'center'
  }
});

export default RegistrarPlato;
