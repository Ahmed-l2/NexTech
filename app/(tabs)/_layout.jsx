import { View, Text, Image } from 'react-native'
import { Tabs, useRouter, useSegments } from 'expo-router';
import { icons } from '../../constants';

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-2">
      <Image
        source={icon}
        resize="contain"
        tintColor={color}
        className="w-7 h-7"
      />
      <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`} style={{color: color}}>
        {name}
      </Text>
    </View>
  )
}

const TabsLayout = () => {
  const segments = useSegments();

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor:'#33cccc',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: segments.includes('create')
          ? { display: 'none' } // Hide TabBar on 'create' page
          : {
              backgroundColor: "white",
              borderTopWidth: 1,
              borderTopColor: "lightgray",
              height: 84,
            },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.home1}
              color={color}
              name="Home"
              focused={focused}
            />
          )
        }}
      />
      <Tabs.Screen
        name="bookmark"
        options={{
          title: 'Bookmark',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.unlike}
              color={color}
              name="Saved"
              focused={focused}
            />
          )
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Cart',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.cart}
              color={color}
              name="Cart"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.account}
              color={color}
              name="Account"
              focused={focused}
            />
          )
        }}
      />
    </Tabs>
  )
}

export default TabsLayout;
