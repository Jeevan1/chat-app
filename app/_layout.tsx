import { router, Slot, useSegments } from "expo-router";

// Import your global CSS file
import "../global.css";
import { AuthContextProvider, useAuth } from "../context/authContext";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (typeof isAuthenticated === "undefined") return;
    const inApp = segments[0] === "(app)";
    if (isAuthenticated && !inApp) {
      // Redirect to the app if the user is authenticated
      router.replace("home");
    } else if (!isAuthenticated && inApp) {
      // Redirect to the sign-in page if the user is not authenticated
      router.replace("signin");
    }
  }, [isAuthenticated]);

  return <Slot />;
};

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <StatusBar style="dark" />
      <MainLayout />
    </AuthContextProvider>
  );
}
