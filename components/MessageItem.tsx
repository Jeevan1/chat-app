import { View, Text } from "react-native";
import React from "react";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

export default function MessageItem({ message, currentUser }: any) {
  if (currentUser?.userId === message?.userId) {
    //my message
    return (
      <View className="flex-row items-center justify-end gap-2 px-3 mb-3 ">
        <View
          style={{
            maxWidth: wp(80),
          }}
          className="p-2 px-3 justify-end bg-white border rounded-lg border-neutral-200"
        >
          <Text className="text-neutral-700 font-semibold leading-5">
            {message?.text}
          </Text>
        </View>
      </View>
    );
  } else {
    //other message
    return (
      <View className="flex-row items-center justify-start gap-2 px-3 mb-3">
        <View
          style={{
            maxWidth: wp(80),
          }}
          className="p-2 px-3 justify-start bg-indigo-100 border rounded-lg border-neutral-200"
        >
          <Text className="text-neutral-700 font-semibold">
            {message?.text}
          </Text>
        </View>
      </View>
    );
  }
}
