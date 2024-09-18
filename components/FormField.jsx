import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import { useState, React} from 'react'

import { icons } from '../constants'

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }) => {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-black-100 font-pmedium">{title}</Text>
      <View
        className="w-full h-16 px-4 bg-gray-200 rounded-2xl focus:border-secondary items-center flex-row">
        <TextInput
          className="flex-1 font-psemibold text-base text-black-100"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={title === 'Password' && !showPassword}
        />

        {title === 'Password' && (
          <TouchableOpacity onPress={() =>
            setShowPassword(!showPassword)}>
              <Image
              source={ !showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6" resizeMode='contain'
              />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField
