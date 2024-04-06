import React from 'react'
import { Tabs } from 'expo-router'
import Colors from '@/constants/Colors'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { FontAwesome5 } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons'

const Layout = () => {
  return (
    <Tabs screenOptions={{
        tabBarActiveTintColor:Colors.appprueba,
        tabBarStyle: { backgroundColor: Colors.wine},
        tabBarLabelStyle:{fontSize:12},
        tabBarInactiveTintColor: '#fff',
        
    }}>
        <Tabs.Screen 
            name="reservas" 
            options={{
                tabBarActiveTintColor:"#d09306",
                tabBarLabel:'Reservas',
                tabBarIcon:({color,size})=><Ionicons name='calendar-outline' color={color} size={size}/>
            }
        }/>
        <Tabs.Screen 
            name="index" 
            options={{
                tabBarActiveTintColor:"#d09306",
                tabBarLabel:'Restaurantes',
                tabBarIcon:({color,size})=><Ionicons name='restaurant' color={color} size={size}/>
            }
        }/>
         <Tabs.Screen 
            name="perfil" 
            options={{
                tabBarActiveTintColor:"#d09306",
                tabBarLabel:'Perfil',
                headerTitle: () => null,
                    headerStyle: {
                    backgroundColor: '#E5332A',
                    },
                    headerShadowVisible: false,
                tabBarIcon:({color,size})=><Ionicons 
                name='person-circle-outline' 
                color={color} 
                size={size}
                />
            }
        }/>
    </Tabs>
    
  )
}

export default Layout