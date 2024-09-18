import { View, Text, ScrollView, Image } from 'react-native'
import React from 'react'
import { useGlobalContext } from '../../context/GlobalProvider'

const accountDetails = () => {
  const { user } = useGlobalContext();
  console.log(user);
  return (
    <ScrollView className="bg-white h-full px-10">
      <View className="justify-center items-center">
        <View className="w-32 mt-2 h-32 justify-center items-center">
            <Image
            source={{ uri: user?.avatar }}
            className="w-[90%] h-[90%] rounded-full"
            resizeMode='cover'
            />
        </View>
        <View className="justify-center items-center mt-6 mb-12">
          <Text>Account ID</Text>
          <Text className="p-2 bg-gray-200 rounded-3xl">{user.accountId}</Text>
        </View>
      </View>
      <View>
        <View className="justify-center mb-6">
          <Text className="mb-2 font-pregular text-base">Username</Text>
          <View className="bg-white rounded-lg p-4 border border-gray-200">
            <Text className="font-pregular text-gray-950 text-base">{user.username}</Text>
          </View>
        </View>

        <View className="justify-center mb-6">
          <Text className="mb-2 font-pregular text-base">Email</Text>
          <View className="bg-white rounded-lg p-4 border border-gray-200">
            <Text className="font-pregular text-gray-950 text-base">{user.email}</Text>
          </View>
        </View>

        <View className="justify-center mb-6">
          <Text className="mb-2 font-pregular text-base">Phone</Text>
          <View className="bg-white rounded-lg p-4 border border-gray-200">
            <Text className="font-pregular text-gray-950 text-base">+000 0000 000</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default accountDetails
