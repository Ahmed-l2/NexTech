import { View, Text, FlatList, Image, RefreshControl, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'
import { GetCategory } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import CatagoryCard from '../../components/CatagoryCard'
import ItemCard from '../../components/ItemCard'
import { useLocalSearchParams } from 'expo-router';

const Home = () => {
  const { name, cId } = useLocalSearchParams();
  const { data: category, refetch } = useAppwrite(() => GetCategory(cId));


  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <FlatList
      data = {category}
      keyExtractor={(item) => item.$id}
      renderItem={({item}) => (
        <ItemCard
        product={item}
        />
      )}
      numColumns={2}
      className="px-4 bg-white h-full"
      ListHeaderComponent={() => (
        <View className="my-6 space-7-6">
          <SearchInput
          placeholder={'Find your favorite items'}
          />

          <View className="w-full flex-1 pt-5 pb-8">
            <Text className="text-black-100 text-lg font-psemibold mb-3">
              Categories
            </Text>
            <CatagoryCard
            page='cata'/>
          </View>
          <Text className="text-black-100 text-lg font-psemibold mt-5">{name}s</Text>
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
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  )
}

export default Home
