import { View, Text, FlatList } from "react-native";
import React from "react";
import ChatItem from "./ChatItem";
import { useRouter } from "expo-router";

export default function ChatList({ users, currentUser }: any) {
  const router = useRouter();
  return (
    <View className="flex-1">
      <FlatList
        data={users}
        contentContainerStyle={{ paddingVertical: 25, flex: 1 }}
        keyExtractor={(item) => Math.random().toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <ChatItem
            item={item}
            noBorder={index + 1 === users.length}
            index={index}
            router={router}
            currentUser={currentUser}
          />
        )}
      />
    </View>
  );
}
