import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Alert } from "react-native";

export const AuthContext = createContext({});

export const AuthContextProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const onsub = onAuthStateChanged(auth, (user) => {
      // console.log(user);

      if (user) {
        setIsAuthenticated(true);
        setUser(user);
        updateUserData(user.uid);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      return onsub;
    });
  }, []);

  const updateUserData = async (userId: string) => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let data = docSnap.data();

      setUser({
        ...user,
        username: data.username,
        profileUrl: data.profileUrl,
        userId: data.userId,
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      let msg = error.message;
      // console.log(msg);

      if (msg.includes("(auth/invalid-email)")) msg = "Email is invalid";
      if (msg.includes("(auth/wrong-password)")) msg = "Password is incorrect";
      if (msg.includes("(auth/user-not-found)")) msg = "User not found";
      if (msg.includes("(auth/invalid-credential)"))
        msg = "Invalid credentials";
      return { success: false, msg: msg };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, msg: error.message };
    }
  };

  const register = async (
    email: string,
    password: string,
    username: string,
    profileUrl: string
  ) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // console.log(response?.user);

      await setDoc(doc(db, "users", response?.user?.uid), {
        username,
        profileUrl,
        userId: response?.user?.uid,
      });
      return { success: true, data: response?.user };
    } catch (error) {
      let msg = error.message;
      if (msg.includes("(auth/invalid-email)")) msg = "Email is invalid";
      if (msg.includes("(auth/email-already-in-use)")) msg = "Email exists";
      return { success: false, msg: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value: any = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used within a AuthContextProvider");
  }

  return value;
};
