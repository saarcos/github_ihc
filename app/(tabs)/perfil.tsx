import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser'
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { Svg, Path, Defs, LinearGradient, Stop, Image} from 'react-native-svg';
import { Link } from 'expo-router'; // Importa Link desde expo-router

const { width } = Dimensions.get('window');

const Page = () => {
  useWarmUpBrowser();
  
  function SvgTop() {
    return (
      <Svg
        width={500}
        height={300}
        fill="none"
      >
        <Path
          fill="url(#a)"
          d="M0 258.36V0h500v258.36c-209.843 75.414-420.768 31.423-500 0Z"
        />
        <Defs>
          <LinearGradient
            id="a"
            x1={250}
            x2={250}
            y1={0}
            y2={300}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset={0.133} stopColor="#E5332A" />
            <Stop offset={0.534} stopColor="#BC3A31" />
            <Stop offset={0.84} stopColor="#953730" />
            <Stop offset={1} stopColor="#803530" />
          </LinearGradient>
        </Defs>
        <Image
              x={100.5} 
              y={42.5}
              width="195"
              height="195"
              href={require('../(modals)/Imagen/logoBlanco.png')}
            />

      </Svg>

    );
  }

  return (
    <View style={[defaultStyles.div]}>
      <View style={{marginHorizontal: -20}}>
        <SvgTop/>
      </View>
      

      <View>
        <TextInput
          style={styles.input}
          placeholder="usuario@gmail.com"
        />
        <TextInput
          style={styles.input}
          placeholder="contraseña"
          secureTextEntry={true}
        />
      </View>
      <TouchableOpacity style={[defaultStyles.btn]}>
        <Text style={[defaultStyles.btnText]}>Ingresar</Text>
      </TouchableOpacity>
      <View style={styles.separatorView}>
        <View style={{
          flex:1,
          borderBottomColor:'#000',
          borderBottomWidth:StyleSheet.hairlineWidth
        }}/>
      </View>      
      <View style={{justifyContent:'center' , alignItems:'center'}}>
        <Link href="/(modals)/Registro" asChild>
              <Text style={styles.btnText}>Registrarse</Text>
          </Link>
      </View>
      
    </View>
  )
};


const styles=StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff',
    padding:26,
  },
  btnText: {
    fontSize: 16,
    color: '#E5332A', 
    textDecorationLine: 'underline'
  },
  separatorView:{
    flexDirection:'row',
    alignItems:'center',
    marginVertical:10,
  },
  separator:{
    color:Colors.grey,
  },
  titulo: {
    width: '75%',
    position: 'absolute',
    fontSize: 35,
    top: 180,
    color: '#fff',
    textAlign:'left',
    fontWeight: 'bold',
    marginHorizontal: 45,
  },
  texto: {
    color: '#827F78',
    fontSize: 15,
    textAlign: 'left',
    marginBottom: 20,
  },
  btnOutline: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.grey,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  btnOutlineText: {
    color: '#000',
    fontSize: 16,
  },
  input: {
    height: 55,
    marginTop: 20,
    borderRadius: 30,
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
})

export default Page
