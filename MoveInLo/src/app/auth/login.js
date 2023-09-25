import { Text, View } from "react-native";
import BaseButton from "@src/components/utils/button";

const LoginUI = () => {
  return (
    <View>
      <Text className="">Login Page</Text>
      <BaseButton title={"Login"} link={"home"} />
    </View>
  );
};

export default LoginUI;
