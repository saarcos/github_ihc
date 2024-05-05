import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, ActivityIndicator} from 'react-native'
import React, { useState } from 'react'
import Colors from '@/constants/Colors';
import moment from 'moment'; 
import { Ionicons } from '@expo/vector-icons';
import { Reserva, eliminarReserva, getRestauranteByID } from '@/app/api/api';
import { useMutation, useQuery } from '@tanstack/react-query';

interface Props{
    appointment:Reserva,
    onReservaDeleted: () => void

}
const AppointmentCardItem = ({appointment, onReservaDeleted}:Props) => {
  const { data: restaurante} = useQuery({queryKey:['restauranteEncontrado',appointment.id_restaurante],queryFn:()=> getRestauranteByID(appointment.id_restaurante)});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteMutation=useMutation({mutationFn: ({ idReserva }: { idReserva: number }) => eliminarReserva(idReserva),
  onSuccess: () => {
    console.log('Reserva eliminada corectamente');
    setShowDeleteModal(false);
    onReservaDeleted(); 
  },
  onError: (error: Error) => { 
    console.error('Error al eliminarReserva:', error.message);
  },
  })
  const handleEliminarReserva=()=>{
    setShowDeleteModal(true);
  }
  const confirmarEliminacion = () => {
    deleteMutation.mutate({ idReserva: appointment.id });
  };
  const today = moment(); // Obtener la fecha y hora actual usando moment.js
  const appointmentTime = moment(appointment.hora, ['h:mm A']);
  
  // Combinar la fecha y la hora para obtener la fecha completa de la cita
  const fullAppointmentDateTime = moment(appointment.fecha + ' ' + appointment.hora, 'YYYY-MM-DD h:mm A');
  
  // Comprobar si la cita está en el futuro o si es hoy pero aún no ha ocurrido
  const isFutureAppointment = fullAppointmentDateTime.isAfter(today) || fullAppointmentDateTime.isSame(today, 'day') && appointmentTime.isAfter(today);
  
  // console.log("Fecha cita: ",appointmentDate, "Hora Cita: "+appointmentTime, "Fecha actual: ",today, "Resultado: ",isFutureAppointment)


  return (
  <View style={[styles.card, isFutureAppointment ? null : styles.reservaPasada]}>
      <View style={{justifyContent:'space-between', flexDirection:'row', alignItems:'center'}}>
        <Text style={{fontSize:18, fontFamily:'appfont-semi', marginTop:10}}>Fecha: {appointment.fecha}</Text>
        <Text style={{fontFamily:'appfont-light', color:Colors.wine, fontSize:15}}>{appointment.hora}</Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 2}}>
        <Text style={{fontFamily: 'appfont-semi', fontSize: 15, marginRight: 5}}>Estado: </Text>
        <View style={{
            borderRadius: 99, 
            overflow: 'hidden', 
          }}>
            <Text style={{
                fontFamily: 'appfont-light',
                fontSize: 15,
                borderRadius:99,
                padding:4,
                backgroundColor: appointment.estado === 'confirmada' ? Colors.confirmationGreen : 
                appointment.estado === 'cancelada' ? Colors.red : Colors.orange,
                color: appointment.estado === 'cancelada' ? 'white' : 'black',
              }}>{appointment.estado}</Text>
        </View>
        
  </View>
      <View style={styles.divider} />
      <View style={{display:'flex', flexDirection:'row', gap:15, alignItems:'center'}}>
        <Image source={{uri: restaurante?.foto}} style={styles.imgCard}/>
        <View>
            <Text style={{fontSize:16, fontFamily:'appfont-semi',maxWidth:'80%'}}>{restaurante?.nombre}</Text>
            <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:5}}>
                <Ionicons name='location' size={20} color={Colors.red}/>
                <Text style={{maxWidth: '75%', fontFamily:'appfont-light'}}>{restaurante?.direccion}</Text>
            </View>
            <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:5}}>
                <Ionicons name='people' size={20} color={Colors.red}/>
                <Text style={{width:'78%',fontFamily:'appfont-light'}}>{appointment.num_personas}</Text>
            </View>
            {isFutureAppointment && appointment.estado!=='cancelada'&&(<View style={{alignSelf: 'flex-start',marginTop: 10}}>
              <TouchableOpacity style={styles.btnCancelarAppointment} onPress={handleEliminarReserva}><Text style={styles.btnText}>Cancelar Reserva</Text></TouchableOpacity>
            </View>)}
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={[styles.centeredView,{backgroundColor: 'rgba(0, 0, 0, 0.5)'}] } >
          <View style={styles.modalView}>
            <Text style={styles.modalText}>¿Estás seguro de que deseas eliminar esta reserva?</Text>
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
  )
}
const styles = StyleSheet.create({
  btnVolver:{
    padding:10,
    borderRadius:99,
    borderWidth: 1,
    borderColor: 'black',
  },
  btnEliminar:{
    backgroundColor:Colors.wine,
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
      card:{
        backgroundColor: '#E9E9E9',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
        marginVertical: 10,
        marginHorizontal: 13,
        marginTop:10,
      }
})

export default AppointmentCardItem