import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { router } from 'expo-router';

const ItemCardCart = ({ product: { $id, name, desc, thumbnail, price } }) => {
  return (
    <View
    style={{
      backgroundColor: 'white',
      margin: 10,
      borderRadius: 10,
      shadowColor: '#9c9c9c',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
    }}
    className='flex-1 p-1 ml-1 mb-2'>
      <TouchableOpacity
      style={{flex: 1}}
        onPress={() => {
          router.push({
            pathname: 'extra/itemPage',
            params: { id: $id },
          });
        }}
      >
        <View>
          <View className=" flex-row rounded-lg overflow-hidden">
            <Image
              source={{ uri: thumbnail }}
              className="w-32 h-32"
              resizeMode='cover'
            />
            <View className="p-2">
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className="font-pregular text-black text-sm mb-1"
                style={{ width: Dimensions.get('window').width - 180 }}
              >
                {name}
              </Text>
              <Text className="font-psemibold text-black text-base">
                ${price}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ItemCardCart;
