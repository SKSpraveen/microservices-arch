import { Slot, Stack } from "expo-router";
import "../global.css"

export default function RootLayout() {
  return <Slot screenOptions={{ headerShown: false }}/>;
}
