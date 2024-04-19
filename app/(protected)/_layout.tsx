import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Role, useAuth } from '../../context/AuthContext';
import React from 'react';
import { Tabs } from 'expo-router';
import Colors from '@/constants/Colors'
const DrawerLayout = () => {
	const { authState } = useAuth();

	return (

		<GestureHandlerRootView style={{ flex: 1 }}>
			<Tabs screenOptions={{
				tabBarActiveTintColor: Colors.appprueba,
				tabBarStyle: { backgroundColor: Colors.wine },
				tabBarLabelStyle: { fontSize: 12 },
				tabBarInactiveTintColor: '#fff',

			}}>
				<Tabs.Screen
					name="index"
					options={{
						tabBarActiveTintColor:"#d09306",
						tabBarLabel:'Restaurantes',
						tabBarIcon:({color,size})=><Ionicons name='restaurant' color={color} size={size}/>
					}
				}
					redirect={authState?.role !== Role.USER}
				/>

				<Tabs.Screen
					name="perfil"
					options={{
						tabBarActiveTintColor:"#d09306",
						tabBarLabel:'Perfil',
						tabBarIcon:({color,size})=><Ionicons name='person-circle-outline' color={color} size={size}/>
					}
				}
					redirect={authState?.role !== Role.USER}
				/>

				<Tabs.Screen
					name="reservas"
					options={{
						tabBarActiveTintColor:"#d09306",
						tabBarLabel:'Reservas',
						tabBarIcon:({color,size})=><Ionicons name='calendar-outline' color={color} size={size}/>
					}
					
				}
					redirect={authState?.role !== Role.USER}
				/>
				<Tabs.Screen
					name="adminPerfil"
					options={{
						tabBarActiveTintColor:"#d09306",
						tabBarLabel:'Perfil',
						tabBarIcon:({color,size})=><Ionicons name='person-circle-outline' color={color} size={size}/>
					}
				}
					redirect={authState?.role !== Role.ADMIN}
				/>

				<Tabs.Screen
					name="adminIngreso"
					options={{
						tabBarActiveTintColor:"#d09306",
						tabBarLabel:'Ingreso',
						tabBarIcon:({color,size})=><Ionicons name='person-circle-outline' color={color} size={size}/>
					}
				}
					redirect={authState?.role !== Role.ADMIN}
				/>

				<Tabs.Screen
					name="adminVista"
					options={{
						tabBarActiveTintColor:"#d09306",
						tabBarLabel:'Vista',
						tabBarIcon:({color,size})=><Ionicons name='person-circle-outline' color={color} size={size}/>
					}
				}
					redirect={authState?.role !== Role.ADMIN}
				/>
	

			</Tabs>




		</GestureHandlerRootView>
	);
};

export default DrawerLayout;