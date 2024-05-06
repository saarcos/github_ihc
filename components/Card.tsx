import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
interface CardsAtributos {
    titles: string;
    content: string;
    imageUrl: string;
}
const Card = (props : CardsAtributos) => {
    const {titles , content,imageUrl} = props

    return (
      <View style={styles.container}>
          <View style={styles.card}>
            <Image
              style={styles.image}
              source={{ uri: imageUrl }}
            />
            <View style={styles.cardContent}>
              <Text style={styles.title}>{titles}</Text>
              <Text>{content}</Text>
            </View>
          </View>
        </View>
    );
  }
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#E4E4E5',
    width: 170,
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    marginVertical: 10,
  },
  cardContent: {
    marginTop: 10,
  },
  title: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
});

export default Card;
