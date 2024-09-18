import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import { useState, React } from 'react'
import { icons } from '../constants'
import { router, usePathname } from 'expo-router'

const SearchInput = ({ initialQuerry, placeholder }) => {
  const pathname = usePathname()
  const [query, setQuery] = useState(initialQuerry || '')

  // Function to handle search action
  const handleSearch = () => {
    if (!query) {
      return Alert.alert('Missing query', 'Please input something to search across database')
    }

    if (pathname.startsWith('/search')) {
      router.setParams({ query })
    } else {
      router.push(`/search/${query}`)
    }
  }

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#5D5C5C',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
      }}
      className="flex flex-row items-center space-x-4 w-full bg-gray-200 h-16 px-4 rounded-2xl border-2 border-gray-200 focus:border-primary"
    >
      <TextInput
        className="text-base mt-0.5 text-black-200 flex-1 font-pregular"
        value={query}
        placeholder={placeholder}
        placeholderTextColor="gray"
        onChangeText={(e) => setQuery(e)}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />

      <TouchableOpacity onPress={handleSearch}>
        <Image
          source={icons.search}
          style={{ width: 20, height: 20, tintColor: 'gray' }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  )
}

export default SearchInput
