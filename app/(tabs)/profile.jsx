import { View, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import EmptyState from '../../components/EmptyState'
import { signOut } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/GlobalProvider'
import { icons } from '../../constants'
import InfoBox from '../../components/InfoBox'
import { router } from 'expo-router'
import ItemCardCart from '../../components/ItemCardCart'
import InfoCard from '../../components/InfoCard'

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();

  const logOut = async () => {
    await signOut();
    setUser(null)
    setIsLogged(false)

    router.replace('/sign-in')
  }

  return (
    <SafeAreaView className="bg-white h-full">
      <View>
        <View className="w-full justify-center items-center mt-6 mb-12 px-4">
          <TouchableOpacity
          className="w-full items-end mb-10"
          onPress={logOut}>
            <Image
              source={icons.logout}
              resizeMode='contain'
              className="w-6 h-6"/>
          </TouchableOpacity>

          <View className="w-32 h-32 justify-center items-center">
            <Image
            source={{ uri: user?.avatar }}
            className="w-[90%] h-[90%] rounded-full"
            resizeMode='cover'
            />
          </View>
          <InfoBox
          title={ user?.username }
          containerStyles='mt-5'
          titleStyles="text-2xl font-pregular text-black-200"
          />
        </View>
        <View className="items-center px-4">
          <InfoCard
          title="Account Details"
          push='extra/accountDetails'
          />
          <InfoCard
          title="My Orders"
          push="extra/orders"
          />
          <InfoCard
          title="Payment Information"
          push="extra/payments"
          />
          <InfoCard
          title="Address Information"
          push="extra/address"
          />
        </View>
      </View>
      {/* <FlatList
        data ={cartItems}
        keyExtractor={(item) => item.$id}
        renderItem={({item}) => (
          <ItemCardCart
          product={item}
          />
        )}
        ListEmptyComponent={() => (
          <EmptyState
          title="No videos found for this profile"
          subtitle="No Videos Found"
          buttonTitle="Back to Explore"
          push='/home'
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      /> */}
    </SafeAreaView>
  )
}

export default Profile
