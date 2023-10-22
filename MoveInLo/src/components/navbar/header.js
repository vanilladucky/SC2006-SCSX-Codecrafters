import { router, Stack } from "expo-router";
import BaseButton from "@src/components/utils/button";
import React from "react";

const Header = ({ children, signOut, hideHeader, ...props }) => {
  const SignOutButton = () => {
    const signOutHandler = () => {
      // Need to check if it throws error
      // router.replace("/");
      router.push("auth/login");
    };
    return signOut ? (
      <BaseButton
        title={"Sign Out"}
        height={30}
        onPress={() => signOutHandler()}
      />
    ) : null;
  };
  return (
    <Stack
      screenOptions={{
        // Header Title
        title: "MoveInLo!",
        headerStyle: {
          backgroundColor: "#181C62",
        },
        headerTintColor: "#FFF",
        headerTitleStyle: {
          fontFamily: "RobotoBold",
        },
        headerShown: !hideHeader ?? true,

        // Header Back Button
        headerBackTitle: "Back",
        headerBackStyle: {
          backgroundColor: "#181C62",
        },
        headerBackTitleStyle: {
          fontFamily: "RobotoMedium",
        },
        headerBackTitleVisible: true,
        headerBackVisible: true,
        headerRight: SignOutButton,
      }}
      {...props}
    >
      {children}
    </Stack>
  );
};

export default Header;
