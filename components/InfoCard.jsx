import { View, Text, Touchable } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { router } from 'expo-router'

const InfoCard = ({title, push}) => {
  return (
    <TouchableOpacity
    className="w-full"
      onPress={() => router.push(push)}>
    <View className="bg-white rounded-lg p-6 border border-gray-200 mb-3">
        <Text className="font-psemibold text-gray-950 text-base">{title}</Text>
    </View>
    </TouchableOpacity>
  )
}

export default InfoCard
