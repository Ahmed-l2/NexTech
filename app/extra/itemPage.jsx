import { View, Text, Image, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { addToCart, GeItem, toggleSavedItem, getUserSavedItems } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import CustomButton from '../../components/CustomButton';
import { icons, images } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';

const ItemPage = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { id } = useLocalSearchParams();
  console.log(user)

  const { data: items, refetch } = useAppwrite(() => GeItem(id));

  const [isSaved, setIsSaved] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility

  useEffect(() => {
    if (items && items.length > 0) {
      checkIfSaved(items[0].$id);
    }
  }, [items]);

  const checkIfSaved = async (itemId) => {
    try {
      const savedItems = await getUserSavedItems(user.$id);
      const isItemSaved = savedItems.some(savedItem => savedItem.itemId === itemId);
      setIsSaved(isItemSaved);
    } catch (error) {
      console.error('Failed to check saved state:', error);
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(user.$id, id);
      console.log('Item added to cart');
      setShowPopup(true); // Show the popup

      // Hide the popup after 2 seconds
      setTimeout(() => {
        setShowPopup(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  const handleSaveToggle = async () => {
    const response = await toggleSavedItem(user.$id, items[0].$id);

    if (response.success) {
      if (response.action === 'saved') {
        setIsSaved(true);
      } else {
        setIsSaved(false);
      }
    }
  };

  if (!items || items.length === 0) {
    return (
      <View className="justify-center items-center px-4 bg-white flex-1">
        <Image
          source={images.loading}
          className="w-[270px] h-[215px]"
          resizeMode='contain'
        />
        <Text className="text-2xl text-center font-psemibold text-black-100 mt-2">Loading</Text>
      </View>
    );
  }

  const item = items[0];
  const { $id, desc, name, price, thumbnail } = item;
  const priceStr = price.toString();
  const [priceInt, priceDecimal] = priceStr.split('.');

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 bg-white">
        <View className="relative">
          <Image
            source={{ uri: thumbnail }}
            className='w-full h-72 mb-2'
            resizeMode="contain"
          />
        </View>
        <View className="px-4">
          <Text className="text-black-100 font-psemibold text-2xl mb-2 mt-3">{name}</Text>
          <View className="flex-row items-center mb-5">
            <Text className="text-black-200 font-pbold text-3xl">${priceInt}</Text>
            {priceDecimal && <Text className="text-black-200 font-pbold text-xl">.{priceDecimal}</Text>}
            <Text className="px-2 text-black-200 font-pbold text-xs pt-2">VAT Inc.</Text>
          </View>
          <Text className="text-black-200 font-psemibold text-xl mb-1">Product Details</Text>
          <Text className="text-gray-700 font-pregular mb-3">{desc}</Text>
          <View className="border-b-2 border-gray-400" />
        </View>
      </ScrollView>

      {/* Popup Modal */}
      <Modal
        visible={showPopup}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPopup(false)}
      >
        <View
        style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
        className="flex-1 justify-center items-center">
          <View className=" justify-center items-center bg-white p-5 rounded-lg shadow-lg">
            <Image
            source={images.added}
            className="w-[150px] h-[150px]"
            resizeMode='contain'
            />
            <Text className="text-base font-psemibold text-black">Item Successfully Added to Cart!</Text>
          </View>
        </View>
      </Modal>

      {/* Bottom Buttons (Sticky at bottom) */}
      <View className="p-4 bg-white border-t border-gray-300 flex-row justify-around items-center">
        <TouchableOpacity
          onPress={handleSaveToggle}
          className="bg-white p-3 border border-[#33cccc] rounded-full"
        >
          <Image
            source={!isSaved ? icons.unlike : icons.like}
            className="w-8 h-8"
            style={{ tintColor: '#33cccc' }}
            resizeMode='contain'
          />
        </TouchableOpacity>

        <TouchableOpacity
          className="w-60 bg-[#33cccc] rounded-full min-h-[62px] flex flex-row justify-center items-center"
          onPress={handleAddToCart}
        >
          <Image
            source={icons.cart}
            className="w-8 h-8 mr-3"
            style={{ tintColor: 'white' }}
            resizeMode='contain'
          />
          <Text className="text-white font-psemibold text-lg">Add to cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ItemPage;
