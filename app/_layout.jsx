import { StyleSheet, Text, View } from 'react-native'
import { SplashScreen, Slot, Stack } from 'expo-router'
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import GlobalProvider from "../context/GlobalProvider";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false}} />
        <Stack.Screen name="(auth)" options={{ headerShown: false}} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false}} />
        <Stack.Screen name="search/[query]" options={{ headerShown: false}} />
        <Stack.Screen name="extra/postPage" options={{ headerShown: false}} />
        <Stack.Screen name="extra/itemPage" options={{ title: 'Product Details', headerTitleAlign: 'center', headerTitleStyle: { fontWeight: 'bold'}}} />
        <Stack.Screen name="extra/accountDetails" options={{ title: 'Account Details', headerTitleAlign: 'center', headerTitleStyle: { fontWeight: 'bold'}}} />
        <Stack.Screen name="extra/orders" options={{ title: 'My Orders', headerTitleAlign: 'center', headerTitleStyle: { fontWeight: 'bold'}}} />
        <Stack.Screen name="extra/payments" options={{ title: 'Payment Information', headerTitleAlign: 'center', headerTitleStyle: { fontWeight: 'bold'}}} />
        <Stack.Screen name="extra/address" options={{ title: 'Address Information', headerTitleAlign: 'center', headerTitleStyle: { fontWeight: 'bold'}}} />
        <Stack.Screen name="extra/checkout" options={{ title: 'Checkout', headerTitleAlign: 'center', headerTitleStyle: { fontWeight: 'bold'}}} />
        <Stack.Screen name="extra/orderPage" options={{ title: 'Order Details', headerTitleAlign: 'center', headerTitleStyle: { fontWeight: 'bold'}}} />
        <Stack.Screen name="extra/orderStatus" options={{ headerShown: false}} />
        <Stack.Screen
        name="extra/categoryPage"
        options={({ route }) => ({
          title: route.params?.name || 'Category',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontWeight: 'bold' },
        })}
      />
      </Stack>
    </GlobalProvider>
  )
}

export default RootLayout
