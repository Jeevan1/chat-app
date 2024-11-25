import { View, Text, Button, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useAuth } from "../../context/authContext";
import { StatusBar } from "expo-status-bar";
import ChatList from "../../components/ChatList";
import { getDocs, query, where } from "firebase/firestore";
import { userRef } from "../../firebaseConfig";

export default function Home() {
  const { logout, user } = useAuth();
  const [users, setUsers] = React.useState([]);

  useEffect(() => {
    if (user?.uid) {
      getUsers();
    }
  });

  const getUsers = async () => {
    //fetch users
    const q = query(userRef, where("userId", "!=", user?.uid));
    const querySnapshot = await getDocs(q);
    let data = [];
    querySnapshot.forEach((doc) => {
      data.push({ ...doc.data() });
    });

    setUsers(data);
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />
      {users.length > 0 ? (
        <ChatList users={users} currentUser={user} />
      ) : (
        <View className="flex-1 items-center " style={{ top: hp(30) }}>
          <ActivityIndicator size="large" color="red" />
        </View>
      )}
    </View>
  );
}
