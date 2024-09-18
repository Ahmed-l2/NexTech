import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { useGlobalContext } from '../../context/GlobalProvider';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { clearCart, createOrder } from '../../lib/appwrite'; // Import your Appwrite function
import { router } from 'expo-router';

const Checkout = () => {
  const { user, orderData, setOrderData } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    country: '',
    city: '',
    street: '',
    zip: '',
  });
  const [isSelected, setIsSelected] = useState(false);
  const [isAddressVisible, setIsAddressVisible] = useState(true);

  const handlePress = () => {
    setIsSelected(!isSelected);
  };

  const toggleAddressSection = () => {
    setIsAddressVisible(!isAddressVisible);
  };

  const handleCheckout = async () => {
    // Validate input
    if (!form.fullName || !form.country || !form.city || !form.street || !form.zip) {
      Alert.alert('Missing Address', 'Please enter your address.');
      return;
    }

    if (!isSelected) {
      Alert.alert('Payment Missing', 'Please select a payment method.');
      return;
    }

    // Prepare the data to be sent to Appwrite
    const orderDetails = {
      userId: user.$id,
      items: JSON.stringify(orderData.items.map(item => ({
        itemId: item.itemId,
        quantity: item.quantity,
        price: item.price,
        totalItemPrice: item.totalItemPrice
      }))),
      totalAmount: orderData.totalAmount,
      orderStatus: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'credit card',
      shippingAddress: JSON.stringify(form),
    };

    try {
      setUploading(true);
      await createOrder(orderDetails);
      // Alert.alert('Success', 'Order placed successfully!');
      await clearCart(user.$id);
      router.replace('extra/orderStatus');
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place the order.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4 my-6 bg-white" contentContainerStyle={{ flexGrow: 1 }}>
        {/* Toggle Address Section */}
        <TouchableOpacity onPress={toggleAddressSection}>
          <Text className="text-2xl text-black-100 font-psemibold">
            {isAddressVisible ? 'Hide Address Section' : 'Show Address Section'}
          </Text>
        </TouchableOpacity>

        {/* Conditionally render the address form based on isAddressVisible */}
        {isAddressVisible && (
          <View>
            <FormField
              value={form.fullName}
              placeholder="Full Name"
              handleChangeText={(e) => setForm({ ...form, fullName: e })}
              />
            <FormField
              value={form.country}
              placeholder="Country"
              handleChangeText={(e) => setForm({ ...form, country: e })}
              />
            <FormField
              value={form.city}
              placeholder="City"
              handleChangeText={(e) => setForm({ ...form, city: e })}
              />
              <FormField
              value={form.street}
              placeholder="Street Address"
              handleChangeText={(e) => setForm({ ...form, street: e })}
            />
            <FormField
              value={form.zip}
              placeholder="ZIP/Postal Code"
              handleChangeText={(e) => setForm({ ...form, zip: e })}
            />
          </View>
        )}

        {/* Payment Method Section */}
        <Text className="text-2xl text-black-100 font-psemibold mt-8">Payment Method</Text>
        <TouchableOpacity
          className={`p-4 rounded-lg w-36 h-20 mt-6 justify-center items-center ${isSelected ? 'bg-green-500' : 'bg-yellow-300'}`}
          onPress={handlePress}
        >
          <Text className={`text-lg font-psemibold ${isSelected ? 'text-white' : 'text-gray-700'}`}>
            Credit Card
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Order Summary Section */}
      <View className="bg-gray-200 rounded-t-2xl p-4 border-t-2 border-gray-300">
        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-black-100 text-lg font-pregular">Delivery Cost</Text>
          <Text className="text-black-100 text-lg font-pregular">
            {orderData.totalAmount >= 200 ? 'Free' : `$${orderData.totalAmount * 0.1}`}
          </Text>
        </View>

        <View className="border-t-2 border-gray-300 my-2" />

        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-black-100 text-xl font-pbold">Grand Total</Text>
          <Text className="text-black-100 text-xl font-pbold">
            ${orderData.totalAmount}
          </Text>
        </View>

        {/* Checkout Button */}
        <CustomButton
          title="Order"
          containerStyles="m-4 rounded-3xl"
          textStyles="text-gray-800"
          handlePress={handleCheckout}
          isLoading={uploading} // Disable the button while uploading
        />
      </View>
    </View>
  );
};

export default Checkout;
