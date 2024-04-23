import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AuthProvider, Role, useAuth } from '../context/AuthContext';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// import { white } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const client=new QueryClient();


const CLERK_PUBLISHABLE_KEY=process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;





const StackLayout = () => {
	const [loaded, error] = useFonts({
		'appfont':require('../assets/fonts/Outfit-Regular.ttf'),
		'appfont-bold':require('../assets/fonts/Outfit-Bold.ttf'),
		'appfont-semi':require('../assets/fonts/Outfit-SemiBold.ttf'),
		'appfont-light':require('../assets/fonts/Outfit-Light.ttf'),
	  });
	  useEffect(() => {
		if (error) throw error;
	  }, [error]);
	
	  useEffect(() => {
		if (loaded) {
		  SplashScreen.hideAsync();
		}
	  }, [loaded]);
	const { authState } = useAuth();
	const segments = useSegments();
	const router = useRouter();

	useEffect(() => {
		const inAuthGroup = segments[0] === '(protected)';
		console.log('Auth changed:' , authState, inAuthGroup)

		if (!authState?.authenticated && inAuthGroup) {
			router.replace('/');	
		} else if (authState?.authenticated === true) {
			router.replace('/(protected)');
		}
	}, [authState]);

	return (
    <QueryClientProvider client={client}>
<Stack>
			<Stack.Screen name='index' options={{ headerShown: false }} />
		  	<Stack.Screen name="(protected)" options={{ headerShown: false }} />
			  <Stack.Screen name="listing/[id]" options={{
            headerTitle:'', headerTransparent:true,
          }}/>
          <Stack.Screen name='(modals)/booking' 
          options={{
            presentation:'transparentModal',
            headerLeft:()=>
              (<TouchableOpacity onPress={()=>router.back()}>
                <Ionicons name='close-outline' size={28}/>
              </TouchableOpacity>),
            animation:'fade',
            
          }}/>
		</Stack>
    </QueryClientProvider>
		
	);
};
const RootLayoutNav = () => {
	return (
		<AuthProvider>
			<StackLayout />
		</AuthProvider>
	);
};

export default RootLayoutNav;