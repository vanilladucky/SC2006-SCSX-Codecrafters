import Header from "@src/components/navbar/header";
import { Stack } from "expo-router";

const StackLayout = () => {
  return (
    <Header signOut>
      <Stack.Screen name={"progress"} />
      <Stack.Screen name={"payment"} />
    </Header>
  );
};

export default StackLayout;
