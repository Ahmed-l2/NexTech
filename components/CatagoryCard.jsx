import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons } from '../constants'
import { router } from 'expo-router'

const CatagoryCard = ({page}) => {

  const categories = [
    { name: 'Monitor', icon: icons.monitor, cId: '1' },
    { name: 'Cpu', icon: icons.cpu, cId: '3' },
    { name: 'Gpu', icon: icons.gpu, cId: '2' },
    { name: 'Ram', icon: icons.ram, cId: '4' },
    { name: 'Storage', icon: icons.storage, cId: '5' },
    { name: 'Cases', icon: icons.cases, cId: '6' },
    { name: 'Peripherals', icon: icons.peripherals, cId: '7' },
  ];

  const handlepress = (item) => {
    console.log('item name:', item.name, '\nitem id:', item.cId)
    console.log(page)
    if (page === 'cata') {
      router.replace({
        pathname: 'extra/categoryPage',
        params: {name: item.name, cId: item.cId}
      });
    } else {
      router.push({
        pathname: 'extra/categoryPage',
        params: {name: item.name, cId: item.cId}
      });
    }
  };

  return (
    <FlatList
    horizontal
      data = {categories}
      // keyExtractor={(item) => item.$id}
      renderItem={({item}) => (
        <TouchableOpacity
        onPress={() => handlepress(item)}>
          <View
          className="pr-1 justify-center items-center">
            <View className="bg-gray-50 border-2 border-gray-300 w-14 items-center p-3 rounded-lg">
              <Image
                    source={item.icon}
                    className="w-9 h-9"
                    resizeMode='contain'
                  />
            </View>
            <Text className="text-black-200 font-pregular">{item.name}</Text>
          </View>
        </TouchableOpacity>
      )} />
  )
}

export default CatagoryCard
