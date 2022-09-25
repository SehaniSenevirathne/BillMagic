import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "@rneui/themed";

const GroupScreen = () => {
  return (
    <View style={styles.container}>
      {/* <Text>Email: {auth.currentUser?.email}</Text> */}
      <Text h2>Group Screen</Text>
    </View>
  );
};

export default GroupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
