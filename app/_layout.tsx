import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { white } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

const CLERK_PUBLISHABLE_KEY=process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const tokenCache={
  async getToken(key:string){
    try {
      return SecureStore.getItemAsync(key);
    } catch (error) {
      return null;
    }
  },
  async saveToken(key:string, value:string){
    try {
      return SecureStore.setItemAsync(key,value);
    } catch (error) {
      return;
    }
  }
}
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'appfont':require('../assets/fonts/Outfit-Regular.ttf'),
    'appfont-bold':require('../assets/fonts/Outfit-Bold.ttf'),
    'appfont-semi':require('../assets/fonts/Outfit-SemiBold.ttf'),
    'appfont-light':require('../assets/fonts/Outfit-Light.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (<ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY!}><RootLayoutNav /></ClerkProvider>)
  ;
}

function RootLayoutNav() {
  const router=useRouter();
  const {isLoaded,isSignedIn}=useAuth();
  useEffect(()=>{
    if(isLoaded && !isSignedIn){
      router.push('/(modals)/login')
    }
  },[isLoaded])
  
  return (
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name='(modals)/login' options={{
          title:'Inicia Sesión o Registrate',
          headerShadowVisible: false,
          presentation:'modal',
          headerTitle: () => null,
          headerLeft:()=>
            (<TouchableOpacity onPress={()=>router.back()}>
              <Ionicons name='close-outline' size={28} style={{ color: 'white' }}/>
            </TouchableOpacity>),
          headerStyle: {
            backgroundColor: '#E5332A',
          },
        }}/>
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

  );
}
