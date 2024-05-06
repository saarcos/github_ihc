import React, {  useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, TextInput, Modal } from 'react-native';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { useMutation, useQuery } from '@tanstack/react-query';
import {  ReservaInsert, Restaurante, crearReserva, getUsuarioByEmail } from '@/app/api/api';
import { Link } from 'expo-router';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';




interface Horario {
  id: number;
  hora: string;
}

interface DayObject {
  dateString: string;
}
interface Props{
  restaurant:Restaurante
}
const Process=({ restaurant }: Props) =>{
  const auth = getAuth(); // Obtener el objeto de autenticación

  // Estado para almacenar el usuario autenticado
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);
  const { data: usuario } = useQuery({
    queryKey: ['usuarioEncontrado', currentUser?.email || ''], // Utiliza una cadena vacía como valor predeterminado si currentUser?.email es null
    queryFn: () => {
      if (currentUser?.email) {
        return getUsuarioByEmail(currentUser.email);
      } else {
        // Si 'currentUser?.email' es null, devuelve un valor predeterminado o null
        return null; 
      }
    }
  });
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Establece la hora a las 00:00:00
  const initialSelectedDate = today.toISOString().split('T')[0];
  const [selectedTime, setSelectedTime] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState<number | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate);
  const [errorModalVisible, setErrorModalVisible] = useState(false); 
  const [disponibilidadModal, setDisponibilidadModal] = useState(false)
  function generarHorarios(): Horario[] {
    const ahora = new Date();
    const horaActual = ahora.getHours();
    const minutosActuales = ahora.getMinutes();
    const horaCierreString = restaurant.horaCierre.split(' ');
    const horaCierreNumero = parseInt(horaCierreString[0]);
    const horaAperturaString = restaurant.horaApertura.split(':');
    const horaAperturaNumero = parseInt(horaAperturaString[0]);
    const minutosApertura=parseInt(horaAperturaString[1])
    let horaCierre = horaCierreNumero; 
    const horarios: Horario[] = [];
    if (selectedDate === initialSelectedDate) {
      const horaInicio = Math.max(horaActual, horaAperturaNumero); // La hora de inicio es la máxima entre la hora actual y la hora de apertura
      for (let i = horaInicio; i < horaCierre; i++) {
          for (let j = 0; j < 60; j += 30) {
              if (i === horaActual && j < minutosActuales) {
                  continue; // Saltar los minutos pasados para la hora actual
              }
              const horas = i > 12 ? i - 12 : i;
              const am_pm = i >= 12 ? 'pm' : 'am';
              const minutos = j === 0 ? '00' : j.toString();
              const hora = `${horas}:${minutos} ${am_pm}`;
              const horario: Horario = { id: i + j / 100, hora };
              horarios.push(horario);
          }
      }
  }else{
      let hora = horaAperturaNumero;
      let minuto = minutosApertura;
      let id = 0;
      while (hora < horaCierre) {
          // const am_pm = hora >= 12? 'pm' : 'am';
          const horaDisplay = `${hora > 12? hora - 12 : hora}:${minuto.toString().padStart(2, '0')} ${hora >= 12? 'pm' : 'am'}`;
          const horario: Horario = { id: id++, hora: horaDisplay };
          horarios.push(horario);

          if (minuto + 30 >= 60) {
              // Si agregar 30 minutos excederá los 60 minutos, actualiza la hora y restablece el minuto
              minuto = (minuto + 30) % 60;
              hora++;
          } else {
              // De lo contrario, simplemente suma 30 minutos al minuto actual
              minuto += 30;
          }
      }
    }
    return horarios;
  }
  const horarios: Horario[] = generarHorarios();

  
  const reservaMutation=useMutation({mutationFn: ({ reservacion }: { reservacion: ReservaInsert }) => crearReserva(reservacion),
  onSuccess: () => {
    setModalVisible(true); 
    
  },
  onError: (error: Error) => {
    setErrorModalVisible(true);
  },
  })


  const renderHorario = React.memo(({ item }: { item: Horario }) => {
    return (
      <TouchableOpacity style={[styles.timeBtn, selectedTime == item.hora ? { backgroundColor: Colors.red } : null]} onPress={() => setSelectedTime(item.hora)}>
        <Text style={[styles.textButton, selectedTime == item.hora ? { color: "#fff" } : null]}>{item.hora}</Text>
      </TouchableOpacity>
    );
  });
  const MemoizedHorarioItem = React.memo(renderHorario);

  
  const handleShowCalendarPress=()=>{
    setShowCalendar(true);
  }
  const handleSelectDay=(day:DayObject)=>{
    setSelectedDate(day.dateString);
    setShowCalendar(false);
  }

 const bookingConfirmed=()=>{
    if(selectedTime===''||numberOfPeople===null){
      Alert.alert('Error', '¡Debe seleccionar una cantidad de personas y un horario!');
      return;
    }
    if (!usuario) {
      console.error('El usuario no está definido.');
      return;
    }
    if (horarios.findIndex(horario => horario.hora === selectedTime) < 4 && selectedDate===initialSelectedDate) {
      setDisponibilidadModal(true);
    } else {
      const nuevaReserva = {
        id_restaurante: restaurant.id,
        id_usuario: usuario.id,
        fecha: selectedDate,
        hora: selectedTime,
        num_personas: numberOfPeople,
        estado:'confirmada'
      };
      // Realizar la mutación
      reservaMutation.mutate({ reservacion: nuevaReserva });
    }   
  }
  const confirmarDisponibilidad = () => {
    setDisponibilidadModal(false);
    if(selectedTime===''||numberOfPeople===null){
      Alert.alert('Error', '¡Debe seleccionar una cantidad de personas y un horario!');
      return;
    }
    if (!usuario) {
      console.error('El usuario no está definido.');
      return;
    }
    const nuevaReserva = {
      id_restaurante: restaurant.id,
      id_usuario: usuario?.id,
      fecha: selectedDate,
      hora: selectedTime,
      num_personas: numberOfPeople,
      estado:'pendiente'
    };
    // Realizar la mutación
    reservaMutation.mutate({ reservacion: nuevaReserva });  };
 

  return (
    <View style={{ flex: 1,  alignItems: 'center'}}>
    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginHorizontal: 82, marginBottom: 10 }}>
      <Ionicons name='calendar-outline' color={Colors.red} size={24} />
      <Text style={[styles.smallText]}> Reserva para: {selectedDate}</Text></View>

    <TouchableOpacity style={styles.btnConsulta} onPress={handleShowCalendarPress}>
      <Text style={[styles.textButton, { textAlign: 'center', fontSize: 17 }]}>Selecciona otro día</Text>
    </TouchableOpacity>

    <Text style={[styles.styleSubHeadings, { marginTop: 5, marginBottom: 5 }]}>¿Cuál es el tamaño del grupo?</Text>
    <TextInput
      style={[styles.input, { textAlign: 'center' }]}
      onChangeText={text => {
        const parsedValue = parseInt(text);
        setNumberOfPeople(isNaN(parsedValue) || parsedValue === 0 ? null : parsedValue);
      }}
      value={numberOfPeople !== null ? numberOfPeople.toString() : ''}
      placeholder="0"
      keyboardType="numeric"
      placeholderTextColor="#000" // Cambia el color del texto del placeholder aquí
    />

    <Text style={[styles.styleSubHeadings, { marginTop: 10, marginBottom: 10 }]}>Hora de reserva</Text>

    {horarios.length === 0 ? (
      <View style={{ alignItems: 'center', display:'flex', flexDirection:'row' }}>
        <Text style={{fontFamily:'appfont-light', color:Colors.grey, fontSize:16}}>No disponible, prueba seleccionar otro día</Text>
      </View>
    ) : (
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={horarios}
        renderItem={({ item }) => <MemoizedHorarioItem item={item} />}
        />
    )}

    <View style={{ padding: 10 }}>
      <TouchableOpacity style={styles.buttonAppointment} onPress={bookingConfirmed}>
        {reservaMutation.isPending ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={[styles.textButton, { textAlign: 'center', fontSize: 17, color: '#fff' }]}>Reservar</Text>
        )}
      </TouchableOpacity>
    </View>

    <Modal
      animationType="fade"
      transparent={true}
      visible={showCalendar}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Calendar
            minDate={initialSelectedDate} 
            onDayPress={handleSelectDay}
            theme={{
              arrowColor: Colors.wine,
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#b6c1cd',
              selectedDayBackgroundColor: '#00adf5',
              selectedDayTextColor: '#ffffff',
              todayTextColor: Colors.wine,
              dayTextColor: '#2d4150',
            }}
            markedDates={{
              [selectedDate]: { selected: true, disableTouchEvent: true, selectedColor: Colors.red }
            }}
            current={selectedDate}
          />
          <TouchableOpacity style={styles.btnCloseCalendar} onPress={() => setShowCalendar(false)} ><Text style={{ fontFamily: 'appfont', color: Colors.white }}>Cancelar</Text></TouchableOpacity>
        </View>
      </View>
    </Modal>
    <Modal
        animationType="slide"
        transparent={true}
        visible={disponibilidadModal}
        onRequestClose={() => setDisponibilidadModal(false)}
      >
        <View style={[styles.centeredView,{backgroundColor: 'rgba(0, 0, 0, 0.5)'}] } >
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Consultar disponibilidad </Text>
            <Text style={{fontFamily:'appfont-light', color:Colors.grey, fontSize:14, textAlign:'center'}}>Esta acción no confirmará una reserva, el restaurante será notificado primero.</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, gap:10 }}>
            <TouchableOpacity  onPress={() => setDisponibilidadModal(false)} style={[styles.btnVolver]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="arrow-back" size={20} color="black" style={{ marginRight: 5 }} />
                  <Text style={styles.modalBtnsText}>Regresar</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmarDisponibilidad} style={styles.btnEliminar}>
                  {reservaMutation.isPending ? (
                    <ActivityIndicator color={Colors.white} /> // Muestra el spinner si la mutación está en curso
                  ) : (
                    <Text style={[styles.modalBtnsText, { color: Colors.white }]}>Consultar</Text> // Muestra "Eliminar" cuando no hay operación en curso
                  )}
              </TouchableOpacity> 
              
           
            </View>
          </View>
        </View>
      </Modal>     
    <Modal
        animationType="fade" // Fundido
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={[styles.centeredView,{backgroundColor: 'rgba(0, 0, 0, 0.5)'}]}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>¡Reserva registrada exitosamente!</Text>
            <Link href={'/(protected)/reservas'} asChild>
            <TouchableOpacity
              style={{ ...styles.btnEliminar, backgroundColor: Colors.red }}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textStyle}>Aceptar</Text>
            </TouchableOpacity>
            </Link>
            
          </View>
        </View>
      </Modal>
    <Modal
      visible={errorModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setErrorModalVisible(false)}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%', alignItems: 'center' }}>
          <View style={{  padding:10,width: '100%', alignItems: 'center' }}>
            <Text style={styles.modalText}>Error en la Reserva</Text>
          </View>
          <Text style={{ fontSize: 16, marginBottom: 20}}>Lo sentimos, no se pudo completar la reserva. Por favor, inténtalo con otro horario.</Text>
          <TouchableOpacity onPress={() => setErrorModalVisible(false)} style={styles.btnEliminar}>
            <Text style={{ color: 'white', fontSize: 16 }}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
</Modal>

  </View>
  );
}
const styles = StyleSheet.create({
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
  timeBtn:{
    borderWidth:1.5,
    borderRadius:99,
    padding:10,
    paddingHorizontal:20,
    alignItems:'center',
    marginRight:6,
    borderColor:Colors.red
  },
  peopleBtn:{
    borderWidth:1.5,
    flexDirection:'row',
    gap:5,
    textAlign:'center',
    padding:5,
    paddingHorizontal:20,
    alignItems:'center',
    marginRight:6,
    borderColor:Colors.red,
    borderRadius:20
  },
  textButton:{
    color:"#000", 
    fontSize:15,
    fontFamily:'appfont-semi'
  },
  styleSubHeadings: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.grey, 
    marginBottom: 10, 
    fontFamily:'appfont-semi',
    textAlign:'center',
    padding:8
  },
  buttonAppointment:{
    padding:14,
    backgroundColor:Colors.red,
    margin:10,
    borderRadius:99,
    marginBottom:5,
    zIndex:20,
    marginTop:20,
  },
  btnConsulta:{
    borderWidth:1,
    borderColor:Colors.red,
    padding:10,
    marginHorizontal:50,
  },
  btnCloseCalendar:{
    backgroundColor:Colors.red,
    padding:10,
    borderRadius:99,
  },
  smallText:{
    fontFamily:'appfont-light',
    fontSize:14,
  },
  input: {
    height: 40,
    borderRadius: 30,
    paddingHorizontal: 30,
    backgroundColor: '#fff',
    borderColor:Colors.red,
    borderWidth:2,
    maxWidth:200,
    marginHorizontal:80,
    borderBottomLeftRadius:100,
    borderBottomRightRadius:50
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
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
})
export default Process;