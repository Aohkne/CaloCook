import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";

import { ThemeProvider } from "@contexts/ThemeProvider";

import LoginScreen from "@auth/LoginScreen";

export default function App() {
  return (
    <ThemeProvider>
      <LoginScreen />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
