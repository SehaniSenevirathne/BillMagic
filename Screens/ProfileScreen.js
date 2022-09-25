import React, { useEffect, useState } from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
import { Text, Button, Input, Avatar } from "@rneui/themed";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const ProfileScreen = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
      } else {
        // User is signed out
      }
    });
    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* <Text>Email: {auth.currentUser?.email}</Text> */}
        <Text h4>User Profile</Text>
        <View style={styles.profileImageContainer}>
          <Avatar
            size={100}
            rounded
            icon={{ name: "adb", type: "material" }}
            containerStyle={{ backgroundColor: "orange" }}
          >
            <Avatar.Accessory size={30} />
          </Avatar>
        </View>
        <View style={styles.inputContainer}>
          <Input
            placeholder="Name"
            onChangeText={(value) => setName(value)}
            inputContainerStyle={styles.inputContainerStyle}
            // errorMessage={!name && "name required"}
          />
          <Input
            placeholder="Email"
            leftIcon={{ type: "material-community", name: "email" }}
            onChangeText={(value) => setEmail(value)}
            inputContainerStyle={styles.inputContainerStyle}
            // errorMessage={!email && "email required"}
          />
          <Button
            title="Update profile"
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
            titleStyle={{ fontWeight: "bold" }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 16,
    paddingTop: 16,
  },
  inputContainer: {
    flexGrow: 1,
  },
  profileImageContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 40,
  },
  inputContainerStyle: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
});
