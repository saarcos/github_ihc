import { View, StyleSheet , Image} from 'react-native';
import React, { useLayoutEffect,useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import Colors from '@/constants/Colors';
import restaurantesData from '@/assets/data/restaurantes.json';
import Restaurantes from '@/components/Restaurantes';
import { defaultStyles } from '@/constants/Styles';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { useNavigation } from 'expo-router';
const Page = () =>{
  const [restaurantes, setRestaurantes] = useState(restaurantesData);
  const navigation=useNavigation();
    useLayoutEffect(()=>{
      navigation.setOptions({
        headerTitle: () => ( 
        <Image
          source={require('../(modals)/Imagen/logoBlanco.png')}
          style={{ width: 47, height: 45 }}
        />
      ),
        headerTitleStyle: styles.headerTitle,
        headerStyle: {
          backgroundColor: '#803530', 
        },
      })
    })
  return (
    <View style={[defaultStyles.container, { padding: 10 }]}>
      <FlatList
        data={restaurantes}
        renderItem={({ item }) => (
          <Restaurantes restaurante={item} />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerStyle:{
    fontFamily:'appfont-bold',
    color:Colors.dark,
    textTransform:'capitalize',
    backgroundColor:'#803530',
    fontSize:20
  },
  headerTitle:{
    fontFamily:'appfont-bold',
    fontSize:22
  },
});

export default gestureHandlerRootHOC(Page); 
