import { SplashScreen, Stack } from "expo-router";
import './globals.css';
import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://73370a328b61ef397281c71cbf5b7d5e@o4507488896352256.ingest.de.sentry.io/4510802215567440',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});
import { SafeAreaProvider } from "react-native-safe-area-context";
import useAuthStore from "@/auth.store";  // ← ADD THIS IMPORT

export default Sentry.wrap(function RootLayout() {

  const { isLoading, fetchAuthenticatedUser } = useAuthStore();

  const [fontsLoaded, error] = useFonts({
    "Quicksand-Bold": require('../assets/fonts/Quicksand-Bold.ttf'),
    "Quicksand-Medium": require('../assets/fonts/Quicksand-Medium.ttf'),
    "Quicksand-Regular": require('../assets/fonts/Quicksand-Regular.ttf'),
    "Quicksand-SemiBold": require('../assets/fonts/Quicksand-SemiBold.ttf'),
    "Quicksand-Light": require('../assets/fonts/Quicksand-Light.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  useEffect(() => {
  fetchAuthenticatedUser()
}, []);

  if(!fontsLoaded || isLoading) return null;

return (
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
  );
});