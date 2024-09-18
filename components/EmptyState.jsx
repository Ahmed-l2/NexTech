import { View, Text, Image } from 'react-native'
import React from 'react'

import { images } from '../constants'
import CustomButton from './CustomButton'
import { router } from 'expo-router'

const EmptyState = ({ title, subtitle, buttonTitle, push }) => {
  return (
    <View className="justify-center items-center px-4">
      <Image
        source={images.noprod}
        className="w-[270px] h-[215px]"
        resizeMode='contain'
      />
      <Text className="font-pmedium text-sm text-gray-100">{subtitle}</Text>
      <Text className="text-2xl text-center font-psemibold text-white mt-2">{title}</Text>

      {buttonTitle && <CustomButton
        title={buttonTitle}
        handlePress={() => router.push(push)}
        containerStyles={"w-full my-5"}
      />}
    </View>
  )
}

export default EmptyState
