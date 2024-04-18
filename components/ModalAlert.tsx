import { View, Text, Modal,StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors';
import { Link } from 'expo-router';
interface ModalAlertProps {
    visible: boolean;
    setModalVisible: (visible: boolean) => void;

     
  }
const ModalAlert = ({ visible, setModalVisible }:ModalAlertProps) => {
  return (
    <View style={styles.centeredView}>
    <Modal
        animationType="fade" // Fundido

        transparent={true}
        visible={visible}
        onRequestClose={() => {
          setModalVisible(!visible);
        }}
        
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>¡Reserva registrada exitosamente!</Text>
            <Link href={'/(tabs)/reservas'} asChild>
            <TouchableOpacity
              style={{ ...styles.openButton, backgroundColor: Colors.red }}
              onPress={() => setModalVisible(!visible)}
            >
              <Text style={styles.textStyle}>Aceptar</Text>
            </TouchableOpacity>
            </Link>
            
          </View>
        </View>
      </Modal>
  </View>
  )
}
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.8)", // Fondo semi-transparente
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10
      },
      textStyle: {
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      }
})

export default ModalAlert