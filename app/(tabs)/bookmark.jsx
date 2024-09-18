import { View, Text, FlatList, Image, RefreshControl, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import { FetchSavedItems, getLikedPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/GlobalProvider'
import { useFocusEffect } from 'expo-router'
import ItemCard from '../../components/ItemCard'

const Bookmark = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { data: products, refetch } = useAppwrite(() => FetchSavedItems(user.$id));

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      async function refreshItems() {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
      }
      refreshItems();
    }, [])
  );

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={products}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <ItemCard product={item} />
        )}
        numColumns={2}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-7-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="text-2xl font-psemibold text-black">Saved Products</Text>
              </View>
            </View>
            <SearchInput
            placeholder={"Search your saved Products"}
            />
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            subtitle="No saved products!"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  )
}

export default Bookmark
