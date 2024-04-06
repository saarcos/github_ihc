import React from "react";
import { Text , TouchableOpacity , StyleSheet } from "react-native";
import { EvilIcons } from '@expo/vector-icons';
interface BtnReservaProps {
    text: string;
    color: string;
}
export function BtnReserva(props:  BtnReservaProps) {
    const {text , color} = props
  return (
      <TouchableOpacity
            style ={{
                ...styles.btnReserva,
                backgroundColor:color,
            }}
            activeOpacity={0.7}>
            <Text style={{color:'white'}}>{text} </Text>
      </TouchableOpacity>
  );
}
export function BtnUbicacion(props:  BtnReservaProps) {
    const {text , color} = props
  return (
      <TouchableOpacity
            style ={{
                ...styles.btnUbi,
                backgroundColor:color,
            }}
            activeOpacity={0.7}>
            <Text style={{color:'black'}}>{text} <EvilIcons name="location" size={24} color="black" /> </Text>
      </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    btnReserva:{
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        width:120,
        height:40,
        marginRight:10,
    },
    btnUbi:{
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        width:40,
        height:40,
    },
});
