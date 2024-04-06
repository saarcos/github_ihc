import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Colors from '@/constants/Colors';
import SubHeading from './SubHeading';
import { Ionicons } from '@expo/vector-icons';
import ModalAlert from './ModalAlert';
interface Horario {
  id: number;
  hora: string;
}
type NumberOfPeopleItem = number;

export default function Process() {
  // Datos de prueba para los horarios
  const horarios: Horario[] = [
    { id: 5, hora: '1:00 pm' },
    { id: 6, hora: '2:00 pm' },
    { id: 7, hora: '3:00 pm' },
    { id: 8, hora: '4:00 pm' },
    { id: 9, hora: '5:00 pm' },
  ];
  //Datos de prueba para cantidad de personas
  const numberOfPeople = Array.from({length: 5}, (_, index) => index + 1);

  
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedNumberOfPeople, setSelectedNumberOfPeople] = useState(0);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const currentDate = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const [modalVisible, setModalVisible] = useState(false);


  const renderHorario = ({ item }: { item: Horario }) => {
    return (
      <TouchableOpacity style={[styles.timeBtn, selectedTime==item.hora?{backgroundColor:Colors.red}:null]} onPress={()=>setSelectedTime(item.hora)}>
        <Text style={[styles.textButton, selectedTime==item.hora?{color:"#fff"}:null]}>{item.hora}</Text>
      </TouchableOpacity>
    );
  };
  // Renderizar elementos de la lista de cantidad de personas
  const renderNumberOfPeople = ({ item }: { item: NumberOfPeopleItem }) => {
    return (
      <TouchableOpacity
        style={[styles.peopleBtn, selectedNumberOfPeople === item ? {backgroundColor: Colors.red} : null]}
        onPress={() => setSelectedNumberOfPeople(item)}
      >
        <Ionicons name="person-circle-outline" size={24} style={[ selectedNumberOfPeople === item ? {color: '#fff'} : null]} />
        <Text style={[styles.textButton, selectedNumberOfPeople === item ? {color: "#fff"} : null]}>{item}</Text>
      </TouchableOpacity>
    );
  };
  const bookingConfirmed=()=>{
    setIsBooking(true);
    if(selectedTime===''||selectedNumberOfPeople===0){
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
    <View style={{marginHorizontal:5}}>
          <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginHorizontal:28, gap:5}}>
          <Ionicons name='calendar-outline' color={Colors.red} size={24}/>
            <Text style={[styles.smallText, { marginTop: 10, marginBottom:10}]}> Reserva para: {currentDate}</Text>
          </View>

      <Text style={[styles.styleSubHeadings, { marginTop: 10, marginBottom:10, }]}>¿Cuál es el tamaño del grupo?</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={numberOfPeople}
        renderItem={renderNumberOfPeople}
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
    left:0,
    right:0,
    marginBottom:10,
    zIndex:20,
    marginTop:20,
  },
  smallText:{
    fontFamily:'appfont-light',
    fontSize:14
  }
})
