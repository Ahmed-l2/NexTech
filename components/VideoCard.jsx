import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons } from '../constants'
import { Video, ResizeMode } from 'expo-av';
import { toggleLikeVideo } from '../lib/appwrite';
import { useGlobalContext } from '../context/GlobalProvider';
import { router } from 'expo-router';

const VideoCard = ({ video: { $id, title, thumbnail, video, prompt, creator: { username, avatar}}, likedBy}) => {
  const [play, setPlay] = useState(false);
  const [liked, setLiked] = useState(false);
  const { user } = useGlobalContext();


  useEffect(() => {
    const likedUserIds = likedBy.map(user => user.$id);
    setLiked(likedUserIds.includes(user.$id));
  }, [likedBy]);

  const handleLikePress = async () => {
    try {
      const { isLiked, likedByUsers } = await toggleLikeVideo($id, user.$id, likedBy.map(user => user.$id));
      setLiked(isLiked);
      // console.log('title:', title, '\nVideo ID:', $id, '\nUser ID:', user.$id, '\nNew liked status:', isLiked);
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };


  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image source={{ uri: avatar }}
            className="w-full h-full rounded-lg"
            resizeMode='cover' />
          </View>
          <TouchableOpacity
          onPress={() => {
            // console.log('Passing params to postPage:', {
            //   id: $id, title, likedBy, username, avatar, video, thumbnail, prompt
            // });
            router.push({
            pathname: "extra/postPage",
            params: { id: $id, title, likedBy: JSON.stringify(likedBy), username, avatar, video, thumbnail, prompt }
          })}}
          className="justify-center flex-1 ml-3 gap-y-1">
              <Text className="text-white font-psemibold text-sm" numberOfLines={1}>{title}</Text>
              <Text className="text-xs text-gray-100 font-pregular" numberOfLines={1}>{username}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity className="pt-2" onPress={handleLikePress}>
          <Image source={liked ? icons.like : icons.unlike}
          className="w-5 h-5"
          resizeMode='contain'/>
        </TouchableOpacity>
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
    </View>
  )
}

export default VideoCard
