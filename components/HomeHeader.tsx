import { View, Text, Platform, Pressable } from "react-native";
import React, { useState } from "react";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { blurhash } from "../utils/common";
import { useAuth } from "../context/authContext";
import { Ionicons } from "@expo/vector-icons";
import Divider from "./Divider";

let ios = Platform.OS === "ios";
export default function HomeHeader() {
  const [show, setShow] = useState(false);
  const { user, logout } = useAuth();
  //   console.log("user: ", user);

  const { top } = useSafeAreaInsets();

  const handleLogout = async () => {
    await logout();
    setShow(false);
  };
  return (
    <View
      style={{ paddingTop: ios ? top : top + 10 }}
      className="flex-row items-center justify-between  px-5 bg-indigo-400 pb-6 rounded-b-3xl shadow-sm"
    >
      <Text style={{ fontSize: hp(3) }} className="font-medium text-white">
        Chats
      </Text>
      <View className="relative">
        <Pressable onPress={() => setShow(!show)}>
          <Image
            style={{ height: hp(5.3), borderRadius: 100, aspectRatio: 1 }}
            source={{ uri: user?.profileUrl }}
            placeholder={{ blurhash }}
            transition={500}
          />
        </Pressable>
        {show && (
          <View className="absolute right-0 items-center top-[50px] shadow-xl bg-white px-2 rounded">
            <View className="w-[120px] flex-col">
              <Pressable onPress={() => setShow(false)}>
                <View className="flex-row justify-between items-center p-3">
                  <Text className="font-medium">Profile</Text>
                  <Ionicons name="person" size={20} color="gray" />
                </View>
              </Pressable>
              <Divider />
              <Pressable onPress={handleLogout}>
                <View className="flex-row justify-between items-center p-3">
                  <Text className="font-medium">Log Out</Text>
                  <Ionicons name="log-out" size={20} color="gray" />
                </View>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
