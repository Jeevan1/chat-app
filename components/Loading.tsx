import { View, Text } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";

export default function Loading({ size }: { size: number }) {
  return (
    <View style={{ height: size }}>
      <LottieView
        source={require("../assets/images/loading.json")}
        style={{ height: size, width: size }}
        autoPlay
        loop
      />
    </View>
  );
}
