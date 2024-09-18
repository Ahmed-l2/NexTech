import { View, Text, ScrollView, Image, Alert } from 'react-native'
import { useState, React } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, router } from 'expo-router';
import { createUser } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider';

const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  })

  const submit = async () => {
    if(form.username === "") {
      Alert.alert('Username missing', 'Please enter your username')
      return
    }

    if(form.email === "") {
      Alert.alert('Email missing', 'Please enter your email')
      return
    }

    if(form.password === "") {
      Alert.alert('Password missing', 'Please enter your password')
      return
    }

    setIsSubmitting(true);
    try {
      const result = await createUser(form.email, form.password, form.username);
      setUser(result);
      setIsLogged(true);

      router.replace('/home')
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[100vh] px-4  bg-white">
          <Image source={images.signup} resizeMode='contain' className='w-full h-48 '/>

          <Text className="text-2xl text-black text-semibold  font-psemibold mb-5">Sign up to NEXTECH</Text>

          <FormField
            title="Username"
            value={form.username}
            placeholder="Enter your username.."
            handleChangeText={(e) => setForm({ ...form,
              username: e })}

          />
          <FormField
            title="Email"
            value={form.email}
            placeholder="Enter your email.."
            handleChangeText={(e) => setForm({ ...form,
              email: e })}
              otherStyles="mt-2"
              keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            placeholder="Enter your password.."
            handleChangeText={(e) => setForm({ ...form,
              password: e })}
              otherStyles="mt-2"
          />

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-2"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-3 flex-row gap-2">
            <Text className="text-lg text-gray-400 font-pregular">
              Have an account already?
            </Text>
            <Link href="/sign-in" className="text-lg text-primary font-psemibold ">Sign in!</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp
