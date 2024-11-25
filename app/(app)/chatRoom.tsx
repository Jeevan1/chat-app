import {
  View,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  Alert,
  Keyboard,
  Button,
  Image,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import ChatRoomHeader from "../../components/ChatRoomHeader";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import Divider from "../../components/Divider";
import { Feather, Ionicons } from "@expo/vector-icons";
import { getRoomId } from "../../utils/common";
import { useAuth } from "../../context/authContext";
import * as ImagePicker from "expo-image-picker";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import MessageList from "../../components/MessageList";

export default function chatRoom() {
  const [message, setMessage] = React.useState([]);
  const item = useLocalSearchParams(); //second user
  const { user } = useAuth(); // logged in user
  const router = useRouter();
  const textRef = useRef("");
  const inputRef = useRef(null);
  const scrollViewRef = useRef(null);
  //   console.log(item);

  useEffect(() => {
    createRoomIfNotExist();

    let roomId = getRoomId(user?.userId, item?.userId);
    const docRef = doc(db, "rooms", roomId);
    const messageRef = collection(docRef, "messages");
    const q = query(messageRef, orderBy("createdAt", "asc"));

    let unsub = onSnapshot(q, (snapshot) => {
      let allMessages = snapshot.docs.map((doc) => {
        return doc.data();
      });

      setMessage([...allMessages]);
    });

    //when keyboard show scroll to bottom
    const KeyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        scrollViewRef?.current?.scrollToEnd({
          animated: true,
          behavior: "smooth",
        });
      }
    );
    return () => {
      unsub();
      KeyboardDidShowListener.remove();
    };
  }, []);

  const createRoomIfNotExist = async () => {
    //roomId
    let roomId = getRoomId(user?.userId, item?.userId);
    await setDoc(doc(db, "rooms", roomId), {
      roomId,
      createdAt: Timestamp.fromDate(new Date()),
    });
  };

  const handleSendMessage = async () => {
    let message = textRef.current.trim();
    if (!message) return;
    try {
      let roomId = getRoomId(user?.userId, item?.userId);
      const docRef = doc(db, "rooms", roomId);
      const messageRef = collection(docRef, "messages");
      textRef.current = "";
      if (inputRef) {
        inputRef?.current?.clear();
      }

      const newDoc = await addDoc(messageRef, {
        userId: user?.userId,
        text: message,
        profileUrl: user?.profileUrl,
        senderName: user?.username,
        createdAt: Timestamp.fromDate(new Date()),
      });
      //   console.log("Document written with ID: ", newDoc.id);
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };
  //   console.log(message);

  useEffect(() => {
    updateScrollView();
  }, [message]);

  const updateScrollView = () => {
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd({
        animated: true,
        behavior: "smooth",
      });
    }, 100);
  };

  //image pick
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  console.log("picked image", image);

  return (
    <View
      className="flex-1
   bg-white"
    >
      <StatusBar style="dark" />
      <ChatRoomHeader user={item} router={router} />
      <Divider />
      {/* <View>
        <Button title="Pick an image from camera roll" onPress={pickImage} />
        {image && <Image source={{ uri: image }} style={{ height: 200 }} />}
      </View> */}
      <View className="flex-1 bg-neutral-100 overflow-visible">
        <View className="flex-1 ">
          <MessageList
            scrollViewRef={scrollViewRef}
            message={message}
            currentUser={user}
          />
        </View>
        <View className=" flex-row items-center justify-center mx-3 gap-2 mb-3">
          <View className="flex-row items-center gap-2 justify-center ">
            <View className="relative">
              <TouchableOpacity
                className="p-3 bg-neutral-200 rounded-full "
                onPress={pickImage}
              >
                <Ionicons name="image-outline" size={hp(2.7)} color="gray" />
              </TouchableOpacity>
              {image && (
                <View className="absolute left-0 bottom-[50px]">
                  <Image
                    source={{ uri: image }}
                    style={{ height: 100, width: 150, borderRadius: 10 }}
                    className=""
                  />
                </View>
              )}
            </View>
            <TouchableOpacity className="p-3 bg-neutral-200 rounded-full">
              <Ionicons name="camera-outline" size={hp(2.7)} color="gray" />
            </TouchableOpacity>
          </View>
          <View className="flex-row flex-1 items-center justify-between bg-white border border-neutral-300 p-2 rounded-full ps-4">
            <TextInput
              style={{ fontSize: hp(2) }}
              className="flex-1 mr-2"
              placeholder="Type a message..."
              onChangeText={(value) => (textRef.current = value)}
              ref={inputRef}
            />
            <TouchableOpacity
              className="p-3 bg-neutral-200 rounded-full mr-[1px]"
              onPress={handleSendMessage}
            >
              <Feather name="send" size={hp(2.7)} color="gray" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
