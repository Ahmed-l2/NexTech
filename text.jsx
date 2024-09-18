import { View, Text, FlatList, Image, RefreshControl, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import { GetAllPosts, GetLatestPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/GlobalProvider'

const Bookmark = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(() => getLikedPosts(user.$id));


  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data ={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({item}) => (
          <VideoCard video={item}
          />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-7-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="text-2xl font-psemibold text-white">Saved Videos</Text>
              </View>
            </View>
            <SearchInput
            placeholder={"Search your saved videos"}
            />
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="justify-center items-center px-4">
            <Image
              source={images.empty}
              className="w-[270px] h-[300px]"
              resizeMode='contain'
            />
            <Text className="text-2xl text-center font-psemibold text-white mt-2">No Saved Videos Found</Text>
            <Text className="font-pmedium text-sm text-gray-100">Go Like a Video!</Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  )
}

export default Bookmark
