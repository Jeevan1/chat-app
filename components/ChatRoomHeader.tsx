import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Image } from "expo-image";
import { blurhash } from "../utils/common";

export default function ChatRoomHeader({ user, router }) {
  return (
    <Stack.Screen
      options={{
        title: "",
        headerShadowVisible: false,
        headerLeft: () => (
          <View className="flex-row items-center gap-4">
            <TouchableOpacity onPress={() => router.back()}>
              <Entypo name="chevron-left" size={hp(4)} color="dark" />
            </TouchableOpacity>
            <View className="flex-row items-center gap-3">
              <Image
                source={{ uri: user?.profileUrl }}
                style={{ height: hp(4.5), borderRadius: 100, aspectRatio: 1 }}
                placeholder={{ blurhash }}
              />
              <Text
                style={{ fontSize: hp(2.5) }}
                className="text-neutral-700 font-medium"
              >
                {user?.username}
              </Text>
            </View>
          </View>
        ),
        headerRight: () => (
          <View className="flex-row items-center gap-4">
            <Ionicons name="call" size={hp(2.8)} color="gray" />
            <Ionicons name="videocam" size={hp(2.8)} color="gray" />
          </View>
        ),
      }}
    />
  );
}
