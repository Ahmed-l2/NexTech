import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { FlashList } from '@shopify/flash-list';
import { getItemsByIds } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import ItemCard from '../../components/ItemCard';
import ItemCardCart from '../../components/ItemCardCart';

const orderPage = () => {
  const {
    id,
    createdAt,
    totalAmount,
    items,
    orderStatus,
    paymentMethod,
    paymentStatus,
    shippingAddress
  } = useLocalSearchParams();

  const parsedItems = JSON.parse(items);
  const parsedAddress = JSON.parse(shippingAddress);
  const { data: products } = useAppwrite(() => getItemsByIds(JSON.parse(items)));

  const date = new Date(createdAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true
});

  const mergedProducts = products?.map(product => {
    const matchedItem = parsedItems.find(item => item.itemId === product.$id);
    return { ...product, ...matchedItem };  // Merge product with matching item details (price, quantity, etc.)
  });
  // console.log(mergedProducts);
  return (
    <View className="bg-white flex-1">
      <FlashList
      data={mergedProducts}
      keyExtractor={(item) => item.$id}
      estimatedItemSize={140}
      renderItem={({ item }) => (
        console.log(item),
        <View className="px-4">
          <View>
            <ItemCardCart
            product={item}
            />
            <View className="absolute right-4 bottom-4 items-end">
              <Text className="text-black-100 text-base font-pregular">
                x{item.quantity}
              </Text>
              <Text className="text-black-100 text-lg font-psemibold">
                ${item.totalItemPrice}
              </Text>
            </View>
          </View>
        </View>
      )}
      ListHeaderComponent={() => (
        <View className="bg-white px-4">
          <View className="my-6 space-7-6">
            <Text className="text-black-100 text-lg font-psemibold mt-5">Order #{id}</Text>
            <Text className="text-gray-500 text-xs font-pregular mt-1">Placed on: {formattedDate}</Text>
          </View>
        </View>
      )}/>
      <View className="flex-row justify-between items-center pr-4 pl-4 mb-2">
          <Text className="text-gray-700 text-sm font-pregular">Order Status</Text>
          <Text className="text-orange-500 text-sm font-pregular">{orderStatus}</Text>
      </View>

      <View className="flex-row justify-between items-center pr-4 pl-4 mb-2">
          <Text className="text-gray-700 text-sm font-pregular">Payment Method</Text>
          <Text className="text-gray-700 text-sm font-pregular">{paymentMethod}</Text>
      </View>

      <View className="flex-row justify-between items-center pr-4 pl-4 mb-2">
          <Text className="text-gray-700 text-sm font-pregular">Shipping Cost</Text>
          <Text className="text-gray-700 text-sm font-pregular">{totalAmount >= 200 ? 'Free' : `$${totalAmount * 0.1}`}</Text>
      </View>

      <View className="border-t-2 border-gray-300" />

      <View className="flex-row justify-between items-center p-4">
          <Text className="text-black-100 text-xl font-pbold">Grand Total</Text>
          <Text className="text-black-100 text-xl font-pbold">
            ${totalAmount}
          </Text>
      </View>
    </View>
  )
}

export default orderPage
