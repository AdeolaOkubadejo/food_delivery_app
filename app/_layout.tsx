import { SplashScreen, Stack } from "expo-router"
import './globals.css'
import { useEffect, useState } from "react"
import { useFonts } from "expo-font"
import { SafeAreaProvider } from "react-native-safe-area-context"
import useAuthStore from "@/auth.store"
import * as SecureStore from 'expo-secure-store'
import { View, Text } from 'react-native'

export default function RootLayout() {
  const { setIsAuthenticated, setUser } = useAuthStore()

  const [fontsLoaded, error] = useFonts({
    "Quicksand-Bold": require('../assets/fonts/Quicksand-Bold.ttf'),
    "Quicksand-Medium": require('../assets/fonts/Quicksand-Medium.ttf'),
    "Quicksand-Regular": require('../assets/fonts/Quicksand-Regular.ttf'),
    "Quicksand-SemiBold": require('../assets/fonts/Quicksand-SemiBold.ttf'),
    "Quicksand-Light": require('../assets/fonts/Quicksand-Light.ttf'),
  })

  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (error) throw error
    if (fontsLoaded) SplashScreen.hideAsync()
  }, [fontsLoaded, error])

  useEffect(() => {
    const init = async () => {
      try {
        const token = await SecureStore.getItemAsync('access_token')
        if (!token) {
          setIsAuthenticated(false)
          setReady(true)
          return
        }

        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          const data = await response.json()
          setIsAuthenticated(true)
          setUser(data)
        } else {
          await SecureStore.deleteItemAsync('access_token')
          setIsAuthenticated(false)
        }
      } catch (err) {
        console.log('Init error:', err)
        await SecureStore.deleteItemAsync('access_token')
        setIsAuthenticated(false)
      } finally {
        setReady(true)
      }
    }

    init()
  }, [])

  if (!fontsLoaded || !ready) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
    )
  }

  return (
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
  )
}