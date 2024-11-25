import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { Image } from "expo-image";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { blurhash, getRoomId } from "../utils/common";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function ChatItem({
  item,
  noBorder,
  index,
  router,
  currentUser,
}: any) {
  const [message, setMessage] = React.useState(undefined);
  const openChatRoom = () => {
    router.push({
      pathname: "/chatRoom",
      params: item,
    });
  };

  useEffect(() => {
    let roomId = getRoomId(currentUser?.userId, item?.userId);
    const docRef = doc(db, "rooms", roomId);
    const messageRef = collection(docRef, "messages");
    const q = query(messageRef, orderBy("createdAt", "desc"));

    let unsub = onSnapshot(q, (snapshot) => {
      let allMessages = snapshot.docs.map((doc) => {
        return doc.data();
      });

      setMessage(allMessages[0] ? allMessages[0] : null);
    });
    return unsub;
  }, []);

  const renderTime = () => {
    if (!message) return "Loading...";

    const createdAt = message?.createdAt?.seconds * 1000; // Convert to milliseconds
    if (!createdAt) return "Invalid Date";

    const date = new Date(createdAt);
    const now = new Date();

    const addLeadingZero = (num) => (num < 10 ? `0${num}` : num);

    // Check if it's the same day
    if (date.toDateString() === now.toDateString()) {
      // Format time with AM/PM
      const hours = date.getHours();
      const minutes = addLeadingZero(date.getMinutes());
      const isPM = hours >= 12;
      const formattedHours = hours % 12 || 12; // Convert to 12-hour format
      return `${formattedHours}:${minutes} ${isPM ? "PM" : "AM"}`;
    }

    // If not the same day, format as DD/MM/YYYY
    const day = addLeadingZero(date.getDate());
    const month = addLeadingZero(date.getMonth() + 1); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const renderLastMessage = () => {
    if (typeof message === "undefined") return "Loading...";
    if (message) {
      if (currentUser?.userId == message?.userId) {
        return "You: " + message?.text;
      } else {
        return message?.text;
      }
    }
    return "Say Hi to " + item?.username;
  };

  return (
    <TouchableOpacity
      className={`flex-row items-center mx-4 justify-between gap-3 mb-4 pb-4 ${
        noBorder ? "" : "border-b border-neutral-200"
      } `}
      onPress={openChatRoom}
    >
      <Image
        source={{ uri: item?.profileUrl }}
        placeholder={{ blurhash }}
        style={{
          height: hp(6),
          aspectRatio: 1,
          borderRadius: 100,
          borderWidth: 1,
          borderColor: "lightgray",
        }}
      />
      <View className="flex-1 gap-1">
        <View className="flex-row items-center justify-between">
          <Text
            style={{ fontSize: hp(1.8) }}
            className="font-semibold text-neutral-800"
          >
            {item?.username}
          </Text>
          <Text
            style={{ fontSize: hp(1.6) }}
            className="font-semibold text-neutral-500"
          >
            {renderTime()}
          </Text>
        </View>
        <Text
          style={{ fontSize: hp(1.6) }}
          className="font-semibold text-neutral-500"
        >
          {renderLastMessage()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
