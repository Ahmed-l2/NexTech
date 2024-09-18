import { View, Text, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, router } from 'expo-router';
import { icons } from '../../constants'
import { Video, ResizeMode } from 'expo-av';
import { getVideoComments, toggleLikeVideo } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';
import FormField from '../../components/FormField';
import EmptyState from '../../components/EmptyState'
import useAppwrite from '../../lib/useAppwrite';
import CommentField from '../../components/CommentField';

const postPage = () => {
  const [play, setPlay] = useState(false);
  const [liked, setLiked] = useState(false);
  const { user } = useGlobalContext();
  const params = useLocalSearchParams();
  const { id, title, likedBy, username, avatar, video, thumbnail, prompt } = params;
  // const [form, setForm] = useState({
  //   text: '',
  // })
  const { data: comments, refetch } = useAppwrite(() => getVideoComments(id));
  console.log(comments)

  useEffect(() => {
    let parsed = [];
    try {
      parsed = likedBy ? JSON.parse(likedBy) : [];
    } catch (error) {
      console.error("Error parsing likedBy:", error);
    }
    const likedUserIds = parsed.map(user => user.$id);
    setLiked(likedUserIds.includes(user.$id));
  }, [likedBy, user.$id]);

  // Function to handle like/unlike logic
  const handleLikePress = async () => {
    const originalLiked = liked;  // Save the current liked state
    setLiked(!liked);  // Optimistic toggle for instant UI feedback

    try {
      let parsedLikedBy = [];
      try {
        parsedLikedBy = likedBy ? JSON.parse(likedBy) : [];
      } catch (error) {
        console.error("Error parsing likedBy:", error);
      }

      // Call the toggleLikeVideo function to update the like status in the backend
      const { isLiked } = await toggleLikeVideo(id, user.$id, parsedLikedBy.map(user => user.$id));
      setLiked(isLiked);  // Update the liked state based on the response
    } catch (error) {
      console.error('Error toggling like:', error);
      setLiked(originalLiked);  // Revert the liked state if there's an error
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="flex-col items-center px-4 mb-14 my-6 pt-5 pb-10 space-7-6 rounded-xl">
        <View className="flex-row gap-3 items-start">
          <View className=" bg-primary p-3 rounded-xl justify-center items-center flex-row flex-1">
            <View className=" w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
              <Image source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode='cover' />
            </View>
            <View
            className="justify-center flex-1 ml-3 gap-y-1">
              <Text className="text-2xl font-psemibold text-white">{username}</Text>
                {/* <Text className="text-white font-psemibold text-sm" numberOfLines={1}>{username}</Text> */}
                {/* <Text className="text-xs text-gray-100 font-pregular" numberOfLines={1}>{prompt}</Text> */}
            </View>
          </View>
        </View>
        <View className="bg-primary flex-col items-start justify-center w-full mt-5 rounded-xl p-2">
          <Text className="text-2xl font-psemibold text-white">{title}</Text>
          <Text className="text-lg text-gray-100 font-pregular mt-2">{prompt}</Text>
        </View>

        {play ? (
          <Video
          source={{ uri: video }}
          className="w-full h-60 rounded-xl mt-3"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
        ) : (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setPlay(true)}
            className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
            >
            <Image source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"/>
            <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode='contain'
            />
          </TouchableOpacity>
        )}
        <View className="bg-primary flex-col items-start justify-center w-full mt-5 rounded-xl p-3 pb-4 border border-gray-200">
          <TouchableOpacity className="pt-2" onPress={handleLikePress}>
            <Image source={liked ? icons.like : icons.unlike}
            className="w-7 h-7"
            resizeMode='contain'/>
          </TouchableOpacity>
        </View>
        <View>
        <FlatList className="w-full"
        data={comments}
        keyExtractor={(item) => item.$id}
        renderItem={({item}) => (
          <CommentField
          comments={item}
          />
        )}
        ListHeaderComponent={() => (<></>)}
        ListEmptyComponent={() => (
          <View className="bg-primary mt-3 pb-2 rounded-xl w-full">
            <EmptyState
              title="Be the first to comment!"
              subtitle="No comments found"
              push='/home'
            />
          </View>
          )}
        />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default postPage
