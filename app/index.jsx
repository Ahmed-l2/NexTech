import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../constants";
import CustomButton from '../components/CustomButton';
import { useGlobalContext } from "../context/GlobalProvider";

const Welcome = () => {
  const { loading, isLogged } = useGlobalContext();
  if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <SafeAreaView className="bg-white h-full">

      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex justify-center items-center h-full px-4 ">


          <Image
            source={images.logo1}
            className="max-w-[380px] w-full h-[298px] mt-4 ml-8"
            resizeMode="contain"
          />

          <View className="relative  ">
            <Text className="text-2xl text-gray-500 font-bold text-center">
            <Text className="text-[#33cccc] text-5xl ">{"\n"}NexTech{"\n"} </Text>
              Your Ultimate Tech Destination
            </Text>


          </View>

          <Text className="text-sm font-pregular text-gray-400 text-center">
            Explore top tech at NexTech – from GPUs to monitors, we have everything you need for high-performance computing.
          </Text>

          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Welcome;
