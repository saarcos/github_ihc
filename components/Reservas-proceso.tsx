import React, {  useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, TextInput, Modal } from 'react-native';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import ModalAlert from './ModalAlert';
import { Calendar } from 'react-native-calendars';
import { useMutation } from '@tanstack/react-query';
import {  ReservaInsert, Restaurante, crearReserva } from '@/app/api/api';

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

function obtenerHoraActual(): number {
  const ahora = new Date();
  return ahora.getHours();
}
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Establece la hora a las 00:00:00
  const initialSelectedDate = today.toISOString().split('T')[0];
  const [selectedTime, setSelectedTime] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState<number | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate);
  const [errorModalVisible, setErrorModalVisible] = useState(false); 

  function generarHorarios(): Horario[] {
    const horaActual = obtenerHoraActual();
    const horaCierreString = restaurant.horaCierre.split(' ');
    const horaCierreNumero = parseInt(horaCierreString[0]);
    const horaAperturaString = restaurant.horaApertura.split(' ');
    const horaAperturaNumero = parseInt(horaAperturaString[0]);
  
    let horaCierre = horaCierreNumero; 
    const horarios: Horario[] = [];
    if(selectedDate===initialSelectedDate){
      for (let i = horaActual; i <= horaCierre; i += 0.5) {
        const horas = Math.floor(i);
        const minutos = i % 1 === 0.5 ? '30' : '00'; // Si el decimal es 0.5, los minutos son 30, de lo contrario, son 00
        const hora = horas > 12 ? `${horas - 12}:${minutos} pm` : `${horas}:${minutos} am`;
        const horario: Horario = { id: i, hora };
        horarios.push(horario);
      }
    }else{
      for (let i = horaAperturaNumero; i <= horaCierre; i += 0.5) {
        const horas = Math.floor(i);
        const minutos = i % 1 === 0.5 ? '30' : '00'; // Si el decimal es 0.5, los minutos son 30, de lo contrario, son 00
        const hora = horas > 12 ? `${horas - 12}:${minutos} pm` : `${horas}:${minutos} am`;
        const horario: Horario = { id: i, hora };
        horarios.push(horario);
      }
    }
    return horarios;
  }
  const horarios: Horario[] = generarHorarios();

  
  const reservaMutation=useMutation({mutationFn: ({ reservacion }: { reservacion: ReservaInsert }) => crearReserva(reservacion),
  onSuccess: () => {
    setBookingSuccess(true);
    setIsBooking(false);
    setModalVisible(true); 
    
  },
  onError: (error: Error) => {
    setIsBooking(false);
    setErrorModalVisible(true);
  },
  })


  const renderHorario = ({ item }: { item: Horario }) => {
    return (
      <TouchableOpacity style={[styles.timeBtn, selectedTime == item.hora ? { backgroundColor: Colors.red } : null]} onPress={() => setSelectedTime(item.hora)}>
        <Text style={[styles.textButton, selectedTime == item.hora ? { color: "#fff" } : null]}>{item.hora}</Text>
      </TouchableOpacity>
    );
  };
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
      setIsBooking(false);
      return;
    }
    setIsBooking(false);
        setBookingSuccess(true);
        const nuevaReserva = {
          id_restaurante: restaurant.id,
          id_usuario: 1,
          fecha: selectedDate,
          hora: selectedTime,
          num_personas: numberOfPeople,
          estado:'confirmada'
        };
      
        // Realizar la mutación
        reservaMutation.mutate({ reservacion: nuevaReserva });
  }
 

  return (
    <View style={{ flex: 1,  alignItems: 'center'}}>
    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginHorizontal: 82, marginBottom: 10 }}>
      <Ionicons name='calendar-outline' color={Colors.red} size={24} />
      <Text style={[styles.smallText]}>Reserva para: {selectedDate}</Text></View>

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
        renderItem={renderHorario}
      />
    )}

    <View style={{ padding: 10 }}>
      <TouchableOpacity style={styles.buttonAppointment} onPress={bookingConfirmed}>
        {isBooking ? (
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

    <ModalAlert visible={modalVisible} setModalVisible={setModalVisible} />
    <Modal
      visible={errorModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setErrorModalVisible(false)}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%', alignItems: 'center' }}>
          <View style={{ backgroundColor: Colors.red, padding: 10, borderRadius: 5, marginBottom: 15, width: '100%', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, color: 'white' }}>Error en la Reserva</Text>
          </View>
          <Text style={{ fontSize: 16, marginBottom: 20, textAlign: 'center' }}>Lo sentimos, no se pudo completar la reserva para la hora especificada. Por favor, inténtalo con otro horario.</Text>
          <TouchableOpacity onPress={() => setErrorModalVisible(false)} style={{ backgroundColor: Colors.red, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 }}>
            <Text style={{ color: 'white', fontSize: 16 }}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
</Modal>

  </View>
  );
}
const styles = StyleSheet.create({
  timeBtn:{
    borderWidth:1.5,
    borderRadius:99,
    padding:10,
    paddingHorizontal:20,
    alignItems:'center',
    marginRight:6,
    borderColor:Colors.wine
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
    borderColor:Colors.wine,
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
    borderColor:Colors.wine,
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
    borderColor:Colors.wine,
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
  }
})
export default Process;