import { View, Text, FlatList, Image, RefreshControl, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'
import { GetAllItems } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import { useGlobalContext } from '../../context/GlobalProvider'
import CatagoryCard from '../../components/CatagoryCard'
import ItemCard from '../../components/ItemCard'

const Home = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { data: products, refetch } = useAppwrite(GetAllItems);
  // console.log(products[0])


  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="px-4 bg-white">
      <FlatList
        data={products}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <ItemCard product={item} />
        )}
        numColumns={2}
        ListHeaderComponent={() => (
          <View className="my-6 space-y-6 mb-4">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-500">Welcome Back,</Text>
                <Text className="text-2xl font-psemibold text-black">{user?.username || 'Guest'}</Text>
              </View>
              <View className="">
                <Image source={images.logo1} className="w-14 h-14" resizeMode="contain" />
              </View>
            </View>
            <SearchInput placeholder={'Find your favorite items'} />
            <View className="w-full pt-2 pb-2">
              <Text className="text-black text-lg font-psemibold mb-1">Categories</Text>
              <CatagoryCard
              page='home'/>
            </View>
            <Image source={images.offer} className="w-full h-52 rounded-xl " resizeMode="cover" />
            <Text className="text-black text-lg font-psemibold">Hot Deals</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="Be the first one to upload a video!"
            buttonTitle="Create a Video"
            push="/create"
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  )
}

export default Home
