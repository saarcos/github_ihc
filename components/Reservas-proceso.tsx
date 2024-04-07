import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, TextInput, Modal } from 'react-native';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import ModalAlert from './ModalAlert';
import { Calendar } from 'react-native-calendars';




interface Horario {
  id: number;
  hora: string;
}
interface DayObject {
  dateString: string;
}
export default function Process() {
  const horarios: Horario[] = [
    { id: 5, hora: '1:00 pm' },
    { id: 6, hora: '2:00 pm' },
    { id: 7, hora: '3:00 pm' },
    { id: 8, hora: '4:00 pm' },
    { id: 9, hora: '5:00 pm' },
  ];
  const [selectedTime, setSelectedTime] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState<number | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); 
 


  const renderHorario = ({ item }: { item: Horario }) => {
    return (
      <TouchableOpacity style={[styles.timeBtn, selectedTime==item.hora?{backgroundColor:Colors.red}:null]} onPress={()=>setSelectedTime(item.hora)}>
        <Text style={[styles.textButton, selectedTime==item.hora?{color:"#fff"}:null]}>{item.hora}</Text>
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
    setIsBooking(true);
    if(selectedTime===''||numberOfPeople===null){
      Alert.alert('Error', '¡Debe seleccionar una cantidad de personas y un horario!');
      setIsBooking(false);
    }
    else{
      setTimeout(() => {
        setIsBooking(false);
        setBookingSuccess(true);
        setModalVisible(true);
      }, 2000); 
      
    }
  }
  
  
  return (
    <View style={{marginHorizontal:5, justifyContent:'center'}}>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginHorizontal:82, gap: 5, marginBottom: 10 }}>
            <Ionicons name='calendar-outline' color={Colors.red} size={24} />
            <Text style={[styles.smallText]}> Reserva para: {selectedDate}</Text>
          </View>

          <TouchableOpacity style={styles.btnConsulta} onPress={handleShowCalendarPress}><Text style={[styles.textButton,{textAlign:'center', fontSize:17}]}>Selecciona otro día</Text></TouchableOpacity>
      <Text style={[styles.styleSubHeadings, { marginTop: 5, marginBottom:5, }]}>¿Cuál es el tamaño del grupo?</Text>
      <TextInput 
        style={[styles.input,{textAlign:'center'}]}
        onChangeText={text => {
          const parsedValue = parseInt(text);
          setNumberOfPeople(isNaN(parsedValue) || parsedValue===0 ? null : parsedValue);
          console.log(numberOfPeople)
        }}
        value={numberOfPeople !== null ? numberOfPeople.toString() : ''}
        placeholder="0"
        keyboardType="numeric"
        placeholderTextColor="#000" // Cambia el color del texto del placeholder aquí
      />
      <Text style={[styles.styleSubHeadings, { marginTop: 10, marginBottom:10, }]}>Hora de reserva</Text>
      <FlatList horizontal={true} showsHorizontalScrollIndicator={false}
        data={horarios} // Asigna los datos a la FlatList
        renderItem={renderHorario} // Utiliza la función renderHorario para renderizar cada elemento
      />
      <View style={{padding:10}}>
      <TouchableOpacity style={styles.buttonAppointment} onPress={bookingConfirmed}>
      {isBooking ? (
        <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={[styles.textButton,{textAlign:'center', fontSize:17, color:'#fff'}]}>Reservar</Text>
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
              minDate={new Date().toISOString().split('T')[0]} // Convertir la fecha actual a una cadena de texto en formato ISO8601
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
                [selectedDate]: {selected: true, disableTouchEvent: true, selectedColor: Colors.red}
              }}
              current={selectedDate} 

            />
              <TouchableOpacity style={styles.btnCloseCalendar} onPress={() => setShowCalendar(false)} ><Text style={{fontFamily:'appfont', color:Colors.white}}>Cancelar</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
      <ModalAlert visible={modalVisible}
       setModalVisible={setModalVisible} />
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
