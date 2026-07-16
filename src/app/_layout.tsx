import { useFonts, PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans'
import { useEffect } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { router, Stack } from 'expo-router'
import { useAuth } from '@/store/useAuth'
import { SplashScreen } from 'expo-router'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_700Bold,
  })

  const { token, loading, checkAuth } = useAuth()

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (loading) return

    if (!fontsLoaded) return

    SplashScreen.hideAsync()
    
    if (token) {
      router.replace('/(app)/listas')
    } else {
      router.replace('/(auth)/bemVindo')
    }
  }, [token, loading, fontsLoaded])

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    )
  }

  return <Stack screenOptions={{ headerShown: false }} />
}