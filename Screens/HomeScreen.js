import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, Button } from "@rneui/themed";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
const HomeScreen = () => {
  const handleSignOut = () => {
    signOut(auth).catch((error) => alert(error.message));
  };
  return (
    <View style={styles.container}>
      {/* <Text>Email: {auth.currentUser?.email}</Text> */}
      <Text h2>Home Screen</Text>
      <Button
        title="Sign out"
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
        onPress={handleSignOut}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
