import { View, Text,StyleSheet, Image, Dimensions, Touchable, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect, useRef } from 'react'
import { Link, useLocalSearchParams, useNavigation } from 'expo-router'
import listingsData from '@/assets/data/airbnb-listings.json';
import Animated, { SlideInDown, interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
const IMG_HEIGHT=300;
const {width}=Dimensions.get('window');
const Page = () => {
    const {id}=useLocalSearchParams<{id:string}>();
    console.log("ID:",id);
    const listing=(listingsData as any[]).find((item)=>item.id===id);
    const scrollRef=useAnimatedRef<Animated.ScrollView>();
    const scrollOffset=useScrollViewOffset(scrollRef);
    const navigation=useNavigation();
    const shareListing=async()=>{
      
    }
    useLayoutEffect(() => {
      navigation.setOptions({
        headerTitle: '',
        headerTransparent: true,
        headerRight: () => (
          <View style={styles.bar}>
            <TouchableOpacity style={styles.roundButton} onPress={shareListing}>
              <Ionicons name="share-outline" size={22} color={'#000'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.roundButton}>
              <Ionicons name="heart-outline" size={22} color={'#000'} />
            </TouchableOpacity>
          </View>
        ),
        headerLeft: () => (
          <TouchableOpacity style={styles.roundButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={'#000'} />
          </TouchableOpacity>
        ),
      });
    }, []);
    const imageAnimatedStyle=useAnimatedStyle(()=>{
      return{
        transform:[
          {
            translateY:interpolate(
              scrollOffset.value,
              [-IMG_HEIGHT,0,IMG_HEIGHT],
              [-IMG_HEIGHT/2,0,IMG_HEIGHT*0.75]
            )
          }
        ]
      };
    })
    
  return (
    <View style={styles.container}>
      <Animated.ScrollView ref={scrollRef} 
      contentContainerStyle={{paddingBottom:100}}
      scrollEventThrottle={16}>
        <Animated.Image source={{uri:listing.xl_picture_url}} style={[styles.image,imageAnimatedStyle]}/>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{listing.name}</Text>
          <Text style={styles.location}>
            {listing.room_type} in {listing.smart_location}
          </Text>
          <Text style={styles.rooms}>
            {listing.guests_included} guests · {listing.bedrooms} bedrooms · {listing.beds} bed ·{' '}
            {listing.bathrooms} bathrooms
          </Text>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            <Ionicons name="star" size={16} />
            <Text style={styles.ratings}>
              {listing.review_scores_rating / 20} · {listing.number_of_reviews} reviews
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.hostView}>
            <Image source={{ uri: listing.host_picture_url }} style={styles.host} />

            <View>
              <Text style={{ fontWeight: '500', fontSize: 16 }}>Hosted by {listing.host_name}</Text>
              <Text>Host since {listing.host_since}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.description}>{listing.description}</Text>
        </View>
      </Animated.ScrollView> 
      <Animated.View style={defaultStyles.footer} entering={SlideInDown.delay(200)}>
        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
          <TouchableOpacity style={styles.footerText}>
            <Text style={styles.footerPrice}>${listing.price} </Text>
            <Text>night</Text>
          </TouchableOpacity>
          <Link href={`/booking/${listing.id}`} asChild>
            <TouchableOpacity style={{backgroundColor:Colors.primary, borderRadius:16, padding:12, width:100}}>
              <Text style={{textAlign:'center', color:'#fff'}}>Reservar</Text>
            </TouchableOpacity>
          </Link>
          
        </View>
      </Animated.View>
    </View>
  )
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff'
  },
  image:{
    height:IMG_HEIGHT,
    width
  },
  infoContainer: {
    padding: 24,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 18,
    marginTop: 10,
  
  },
  rooms: {
    fontSize: 16,
    color: Colors.grey,
    marginVertical: 4,
    
  },
  ratings: {
    fontSize: 16,
   
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.grey,
    marginVertical: 16,
  },
  host: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: Colors.grey,
  },
  hostView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footerText: {
    height: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerPrice: {
    fontSize: 18,
    
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    color: Colors.primary,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  header: {
    backgroundColor: '#fff',
    height: 100,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey,
  },

  description: {
    fontSize: 16,
    marginTop: 10,
    
  },
})
export default Page