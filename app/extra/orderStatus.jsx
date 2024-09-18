import { View, Text ,Image} from 'react-native'
import React from 'react'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'

const orderStatus = () => {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <Image
      source={images.ordered}
      resizeMode='contain'
      className="w-56 h-56" />
      <Text className="text-2xl  text-gray-600 text-bold font-psemibold text-center mb-10" > Your order has been placed</Text>
      <CustomButton
        title="Continue shopping "
       handlePress={() => router.replace('home')}
       containerStyles="mt-10 w-80  rounded-full sticky top-20" />

      <CustomButton
        title="View Orders"
       handlePress={() => router.replace('profile')}
       containerStyles="mt-2 w-80 bg-orange-400 rounded-full sticky top-20" />
    </SafeAreaView>
  )
}

export default orderStatus
