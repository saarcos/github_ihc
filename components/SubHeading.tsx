import { View, Text } from 'react-native'
import React from 'react'
interface Props{
    subheadingTitle:string
}
export default function SubHeading({subheadingTitle}:Props) {
  return (
    <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
      <Text style={{
        fontSize:20,
        fontFamily:'appfont-semi'
      }}>{subheadingTitle}</Text>
      
    </View>
  )
}