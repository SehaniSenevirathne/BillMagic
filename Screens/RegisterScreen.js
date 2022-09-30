import React, { useState } from "react";
import { StyleSheet, View, SafeAreaView, ScrollView } from "react-native";
import { Text, Button, Input, Divider } from "@rneui/themed";
import Toast from "react-native-root-toast";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, collection } from "firebase/firestore";
import { auth, firestore } from "../firebase";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = () => {
    if (validateData()) {
      setIsLoading(true);
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
          const user = {
            name: name,
            email: userCredentials.user.email,
            uid: userCredentials.user.uid,
          };
          saveUser(user);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          alert(error.message);
        });
    }
  };

  const saveUser = async (user) => {
    const userRef = collection(firestore, "users");
    await setDoc(doc(userRef, user.uid), user);
  };

  const validateData = () => {
    if (!name) {
      Toast.show("Name is reqiured", {
        duration: Toast.durations.SHORT,
      });
      return false;
    } else if (!email) {
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
          <Text h2>Create new account</Text>
        </View>
        <View style={styles.inputContainer}>
          <Input
            placeholder="Name"
            onChangeText={(value) => setName(value)}
            autoCapitalize={"none"}
            inputContainerStyle={{
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 10,
              borderWidth: 1,
            }}
          />
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
            title="Sign up"
            buttonStyle={{
              backgroundColor: "#584CF4",
              borderWidth: 2,
              borderColor: "white",
              height: 58,
              borderRadius: 30,
            }}
            containerStyle={{
              marginHorizontal: 50,

              marginVertical: 10,
            }}
            loading={isLoading}
            onPress={handleSignUp}
            titleStyle={{ fontWeight: "bold" }}
          />
        </View>
        <Divider />
        <View style={styles.signUpButtonContainer}>
          <Text h6>Already have an account?</Text>
          <Button
            title="Sign in"
            type="clear"
            titleStyle={{ fontSize: 14 }}
            onPress={() => navigation.navigate("Login")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

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
