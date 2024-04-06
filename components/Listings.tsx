import { View, Text, FlatList, ListRenderItem, TouchableOpacity,StyleSheet, Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { defaultStyles } from '@/constants/Styles';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
Animated
interface Props{
  listings:any[],
  category:string;
}
const Listings = ({listings:items,category}:Props) => {
  const [loading, setLoading] = useState(false);
  const listRef=useRef<FlatList>(null);
  useEffect(() => {
    console.log('RELOAD LISTINGS',items.length);
    setLoading(true);
    setTimeout(()=>{
      setLoading(false);
    },200)
  }, [category])
  const renderRow:ListRenderItem<any>=({item})=>(
    <Link href={`/listing/${item.id}`} asChild>
      <TouchableOpacity>
        <Animated.View style={styles.listing} entering={FadeInRight} exiting={FadeOutLeft}>
          <Image source={{uri:item.medium_url}} style={styles.image}/>
          <TouchableOpacity style={{position:'absolute', right:30, top:30}}>
            <Ionicons name='heart-outline' size={24} color={'#000'}/>
          </TouchableOpacity>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={{fontSize:16}}>{item.name}</Text>

            <View style={{flexDirection:'row', gap:4}}>
              <Ionicons name='star' size={16}/>
              <Text style={{}}>{item.review_scores_rating/20}</Text>
            </View>
          </View>
          <Text >{item.room_type}</Text>
          <View style={{flexDirection:'row'}}>
            <Text >${item.price}</Text>
            <Text> night</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  )
  return (
    <View style={defaultStyles.container}>
      <FlatList 
      data={loading?[]: items}
      ref={listRef}
      renderItem={renderRow}/>
    </View>
  )
}
const styles = StyleSheet.create({
  listing:{
    padding:16,
    gap:10,
    marginVertical:16
  },
  image:{
    width:'100%',
    height:300,
    borderRadius:10,
  }
})

export default Listings