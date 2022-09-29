import React, { useState } from "react";
import { StyleSheet, View, SafeAreaView, ScrollView } from "react-native";
import Toast from "react-native-root-toast";
import { Text, Button, Input, Divider } from "@rneui/themed";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (validateData()) {
      setIsLoading(true);
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
          // console.log("userCredentials", userCredentials);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          alert(error.message);
        });
    }
  };

  const validateData = () => {
    if (!email) {
      Toast.show("Email is reqiured", {
        duration: Toast.durations.SHORT,
      });
      return false;
    } else if (!password) {
      Toast.show("Password is reqiured", {
        duration: Toast.durations.SHORT,
      });
      return false;
    }
    return true;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.screenContainer}>
        <View style={styles.titleContainer}>
          <Text h2>Login to your Account</Text>
        </View>
        <View style={styles.inputContainer}>
          <Input
            placeholder="Email"
            leftIcon={{ type: "material-community", name: "email" }}
            onChangeText={(value) => setEmail(value)}
            autoCapitalize={"none"}
            inputContainerStyle={{
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 10,
              borderWidth: 1,
            }}
          />
          <Input
            placeholder="Password"
            onChangeText={(value) => setPassword(value)}
            autoCapitalize={"none"}
            secureTextEntry={true}
            inputContainerStyle={{
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 10,
              borderWidth: 1,
            }}
          />
          <Button
            title="Sign in"
            buttonStyle={{
              backgroundColor: "#584CF4",
              borderWidth: 2,
              borderColor: "white",
              height: 58,
              borderRadius: 30,
            }}
            loading={isLoading}
            containerStyle={{
              marginHorizontal: 50,

              marginVertical: 10,
            }}
            titleStyle={{ fontWeight: "bold" }}
            onPress={handleLogin}
          />
        </View>
        <Button
          title="Forgot Password?"
          type="clear"
          titleStyle={{ fontSize: 14 }}
          onPress={() => navigation.navigate("Register")}
        />
        <Divider />
        <View style={styles.signUpButtonContainer}>
          <Text h6>Don't have an account?</Text>
          <Button
            title="Sign up"
            type="clear"
            titleStyle={{ fontSize: 14 }}
            onPress={() => navigation.navigate("Register")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  screenContainer: {
    flexGrow: 1,
    marginHorizontal: 16,
  },
  inputContainer: {
    flexGrow: 1,
  },
  titleContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  signUpButtonContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
