import { View, Text, ScrollView, Image, Alert, ImageBackground } from 'react-native'
import { useState, React } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, router } from 'expo-router';
import { signIn } from '../../lib/appwrite';
import { GetCurrentUser } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';

const SignIn = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const submit = async () => {
    if(form.email === "") {
      Alert.alert('Email missing', 'Please enter your email')
      return
    }

    if(form.password === "") {
      Alert.alert('Password missing', 'Please enter your password')
      return
    }

    setIsSubmitting(true)

    try {
      await signIn(form.email, form.password);
      const result = await GetCurrentUser();
      setUser(result);
      setIsLogged(true);

      // Alert.alert("Success", "User signed in successfully");
      router.replace('/home')
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView className="h-full bg-white">
      <Image
        source={images.login}
        className="w-full h-1/3 mt-5"

        resizeMode='contain'/>
      <ScrollView>
        <View className="w-full justify-center px-4 my-6">
          {/* <View className="flex-row gap-2 items-center">
            <Image source={images.logosmall} resizeMode='contain' className='w-[60px] h-[60px]'/>
            <Text className="text-black-100 text-semibold font-psemibold pt-2 text-4xl">NEXTECH</Text>
          </View> */}
          <Text className="text-2xl text-black-100 text-semibold font-psemibold">Log in to NexTech</Text>

          <FormField
            title="Email"
            value={form.email}
            placeholder="Enter your email.."
            handleChangeText={(e) => setForm({ ...form,
              email: e })}
              otherStyles="mt-7"
              keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            placeholder="Enter your password.."
            handleChangeText={(e) => setForm({ ...form,
              password: e })}
              otherStyles="mt-7"
          />

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-400 font-pregular">
              Don't have an account?
            </Text>
            <Link href="/sign-up" className="text-lg text-primary font-psemibold ">Sign up!</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn
