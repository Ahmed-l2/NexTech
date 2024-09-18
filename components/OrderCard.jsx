import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { router } from 'expo-router';

const OrderCard = ({ order: { $id, $createdAt, totalAmount, items, orderStatus, paymentMethod, paymentStatus, shippingAddress } }) => {
  // console.log(JSON.parse(items))
  const date = new Date($createdAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return (
    <View
    className='flex-1 p-1 ml-1 mb-2 px-2'>
      <TouchableOpacity
      style={{
        backgroundColor: 'white',
        margin: 10,
        borderRadius: 10,
        shadowColor: '#9c9c9c',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        flex: 1
        }}
        onPress={() => {
          router.push({
            pathname: 'extra/orderPage',
            params: {
              id: $id,
              createdAt: $createdAt,
              totalAmount,
              items,
              orderStatus,
              paymentMethod,
              paymentStatus,
              shippingAddress
            },
          });
        }}
      >
        <View className="p-4">
          <Text className="text-base font-psemibold">Order #{$id}</Text>
          <Text className="text-gray-500 text-base font-pregular">{formattedDate}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default OrderCard;
