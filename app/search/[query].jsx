import { View, Text, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'
import { searchPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useLocalSearchParams } from 'expo-router'
import ItemCard from '../../components/ItemCard'

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(() => searchPosts(query));

  useEffect(() => {
    refetch()
  }, [query])

  return (
    <SafeAreaView className="bg-white h-full px-4">
      <View className="my-6">
        <Text className="font-pmedium text-sm text-gray-700">Search results</Text>
        <Text className="text-2xl font-psemibold text-black-200">{query}</Text>
        <View className="mt-6 mb-8">
          <SearchInput
          placeholder="Find your favorite item!"
          initialQuery={query} />
        </View>
      </View>
      <FlatList
        data ={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({item}) => (
          <ItemCard
            product={item}
          />
        )}
        numColumns={2}
        ListEmptyComponent={() => (
          <EmptyState
          title="No product Found"
          subtitle={`No product found for the search "${query}"`}
          />
        )}
      />
    </SafeAreaView>
  )
}

export default Search
