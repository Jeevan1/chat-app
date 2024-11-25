import { View, Text, ScrollView } from "react-native";
import React from "react";
import MessageItem from "./MessageItem";

export default function MessageList({
  message,
  currentUser,
  scrollViewRef,
}: any) {
  console.log(message ?? "no message");
  console.log(currentUser);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: 10 }}
      ref={scrollViewRef}
    >
      {message?.map((message: any, index: number) => (
        <MessageItem message={message} key={index} currentUser={currentUser} />
      ))}
    </ScrollView>
  );
}
