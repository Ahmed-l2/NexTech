import React, { useState, useCallback } from 'react';
import { View, Text, RefreshControl, SafeAreaView } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import EmptyState from '../../components/EmptyState';
import { addToCart, getUserCart, removeFromCart } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import { useGlobalContext } from '../../context/GlobalProvider';
import ItemCardCart from '../../components/ItemCardCart';
import { TouchableOpacity } from 'react-native';
import CustomButton from '../../components/CustomButton';
import { router, useFocusEffect } from 'expo-router';

const Create = () => {
  const { user, setOrderData } = useGlobalContext();
  const { data: cartItems, refetch } = useAppwrite(() => getUserCart(user.$id));

  const [refreshing, setRefreshing] = useState(false);

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingCost = totalPrice * 0.1;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleAddToCart = async (id) => {
    try {
      console.log('Adding item to cart:', id);
      await addToCart(user.$id, id);
      await onRefresh();
      console.log('Item added to cart successfully');
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  const handleRemoveToCart = async (id) => {
    try {
      console.log('Adding item to cart:', id);
      await removeFromCart(user.$id, id);
      await onRefresh();
      console.log('Item removed from cart successfully');
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
    }
  };

  const handleCheckout = () => {
    // Store cart items and total in the order, and navigate to payment page
    const orderData = {
      userId: user.$id,
      items: cartItems.map(item => ({
        itemId: item.$id,
        quantity: item.quantity,
        price: item.price,
        totalItemPrice: item.price * item.quantity,
      })),
      totalAmount: totalPrice + (totalPrice >= 200 ? 0 : shippingCost),
      orderStatus: 'pending',
      paymentStatus: 'pending',
      paymentMethod: '', // This can be set after payment
      shippingAddress: '', // This can be set on the next page
    };

    setOrderData(orderData);
    router.navigate('extra/checkout');
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
    <SafeAreaView className="bg-white h-full px-4">
      <FlashList
        data={cartItems}
        keyExtractor={(item) => item.$id}
        estimatedItemSize={140}
        renderItem={({ item }) => (
          <View>
            <ItemCardCart product={item} />
            <View className="flex-row items-center absolute bottom-4 right-4 rounded-lg overflow-hidden">
              <TouchableOpacity
              onPress={() => handleRemoveToCart(item.$id)}
              className="border border-gray-200 bg-gray-100 p-1">
                <Text className="font-pregular">-</Text>
              </TouchableOpacity>

              <Text className="p-1">{item.quantity}</Text>

              <TouchableOpacity
              onPress={() => handleAddToCart(item.$id)}
              className="border border-gray-200 bg-gray-100 p-1">
                <Text className="font-pregular">+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListHeaderComponent={() => (
          <View className="my-6 space-7-6">
            <Text className="text-black-100 text-2xl font-psemibold mt-5">Cart</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            subtitle="No products in cart!"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <View className="bg-gray-200 rounded-t-2xl">
        <View className="m-2">
          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-black-100 text-lg font-pregular">Item Total</Text>
            <Text className="text-black-100 text-lg font-pregular">
              ${totalPrice}
            </Text>
          </View>

          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-black-100 text-lg font-pregular">Delivery Cost</Text>
            <Text className="text-black-100 text-lg font-pregular">
              {totalPrice >= 200 ? 'Free' : `$${shippingCost}`}
            </Text>
          </View>

          <View className="border-t-2 border-gray-300 mb-2 mt-3"></View>

          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-black-100 text-xl font-pbold">Grand Total</Text>
            <Text className="text-black-100 text-xl font-pbold">
            ${totalPrice + (totalPrice >= 200 ? 0 : shippingCost)}
            </Text>
          </View>
        </View>
        <CustomButton
        title="Checkout"
        containerStyles="bg-[#33cccc] m-4 rounded-3xl"
        textStyles="text-white"
        handlePress={handleCheckout}
        isLoading={cartItems.length === 0}
        />
      </View>
    </SafeAreaView>
  );
};

export default Create;
