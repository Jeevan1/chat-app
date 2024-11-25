import {
  View,
  Text,
  Image,
  TextInput,
  Touchable,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import React, { useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Loading from "../components/Loading";
import CustomKeyboardView from "../components/CustomKeyboardView";
import { useAuth } from "../context/authContext";

export default function SignUp() {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const emailRef = useRef("");
  const passwordRef = useRef("");
  const usernameRef = useRef("");
  const profileRef = useRef("");

  const handleRegister = async () => {
    // Perform login logic here
    if (
      !emailRef.current ||
      !passwordRef.current ||
      !usernameRef.current ||
      !profileRef.current
    ) {
      Alert.alert("Sign In", "Please enter your email and password.");
      return;
    }
    setLoading(true);
    let response = await register(
      emailRef.current,
      passwordRef.current,
      usernameRef.current,
      profileRef.current
    );
    setLoading(false);

    console.log(response);

    if (!response.success) {
      Alert.alert("Sign Up", response.msg);
    }
  };

  return (
    <CustomKeyboardView>
      <StatusBar style="dark" />
      <View
        style={{
          paddingTop: hp(8),
          //   alignItems: "center",
          paddingHorizontal: wp(4),
        }}
      >
        <View>
          <Image
            style={{ height: hp(20), width: wp(100) }}
            resizeMode="contain"
            source={require("../assets/login.png")}
          />
        </View>

        <View className="gap-10">
          <Text className="text-3xl font-bold text-black text-center">
            Sign Up
          </Text>
          {/* inputs  */}
          <View className="gap-4">
            <View
              style={{ height: hp(7) }}
              className="flex-row gap-4 bg-neutral-100 px-4 items-center rounded-xl"
            >
              <Octicons name="mail" size={hp(2.7)} color="gray" />
              <TextInput
                onChangeText={(value) => (emailRef.current = value)}
                style={{ fontSize: hp(2) }}
                className="flex-1 font-semibold text-neutral-700"
                placeholder="Email Address"
              />
            </View>
            <View
              style={{ height: hp(7) }}
              className="flex-row gap-4 bg-neutral-100 px-4 items-center rounded-xl"
            >
              <Octicons name="person" size={hp(2.7)} color="gray" />
              <TextInput
                onChangeText={(value) => (usernameRef.current = value)}
                style={{ fontSize: hp(2) }}
                className="flex-1 font-semibold text-neutral-700"
                placeholder="Username"
              />
            </View>
            <View
              style={{ height: hp(7) }}
              className="flex-row gap-4 bg-neutral-100 px-4 items-center rounded-xl"
            >
              <Octicons name="link" size={hp(2.7)} color="gray" />
              <TextInput
                onChangeText={(value) => (profileRef.current = value)}
                style={{ fontSize: hp(2) }}
                className="flex-1 font-semibold text-neutral-700"
                placeholder="Profile url"
              />
            </View>
            <View
              style={{ height: hp(7) }}
              className="flex-row gap-4 bg-neutral-100 px-4 items-center rounded-xl"
            >
              <Octicons name="lock" size={hp(2.7)} color="gray" />
              <TextInput
                secureTextEntry
                onChangeText={(value) => (passwordRef.current = value)}
                style={{ fontSize: hp(2) }}
                className="flex-1 font-semibold text-neutral-700"
                placeholder="Password"
              />
            </View>

            {/* button  */}
            <View>
              {loading ? (
                <View className="flex-row justify-center">
                  <Loading size={hp(5.5)} />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleRegister}
                  style={{ height: hp(6.5) }}
                  className="bg-indigo-600 items-center justify-center rounded-xl"
                >
                  <Text
                    style={{ fontSize: hp(2) }}
                    className="text-center font-semibold text-white"
                  >
                    Sign Up
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {/* sign up  */}
            <View className="flex-row items-center justify-center gap-2">
              <Text
                style={{ fontSize: hp(2) }}
                className="font-semibold text-neutral-500"
              >
                Already have an account?
              </Text>
              <Pressable onPress={() => router.push("signin")}>
                <Text
                  style={{ fontSize: hp(2) }}
                  className="font-semibold text-indigo-600"
                >
                  Sign In
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </CustomKeyboardView>
  );
}
