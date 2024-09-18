import { View, Text, FlatList, Image, RefreshControl, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import EmptyState from '../../components/EmptyState'
import { GetUserOrders } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import { useGlobalContext } from '../../context/GlobalProvider'
import { useFocusEffect } from 'expo-router'
import ItemCard from '../../components/ItemCard'
import OrderCard from '../../components/OrderCard'

const orders = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { data: orders, refetch } = useAppwrite(() => GetUserOrders(user.$id));
  // console.log(orders)

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
        data={orders}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <OrderCard
          order={item}/>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            subtitle="No orders made!"
            buttonTitle='Home'
            push='/home'
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  )
}

export default orders
