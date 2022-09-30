import React, { useEffect, useState } from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
import { Text, Button, Input, Avatar, Skeleton } from "@rneui/themed";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { auth, firestore } from "../firebase";

const ProfileScreen = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getUserData(user);
      } else {
        // User is signed out
      }
    });
    return unsubscribe;
  }, []);

  const getUserData = async (user) => {
    const docRef = doc(firestore, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setEmail(docSnap.data().email);
      setName(docSnap.data().name);
      setIsLoading(false);
    } else {
      console.log("No such document!");
    }
  };

  const handleSignOut = () => {
    signOut(auth).catch((error) => alert(error.message));
  };

  const profileSkeleton = () => {
    return (
      <View style={styles.profileSkeletonContainer}>
        <Skeleton
          circle
          width={100}
          height={100}
          animation="wave"
          style={{ marginBottom: 40 }}
        />
        <Skeleton
          height={60}
          animation="wave"
          style={{ margin: 10, borderRadius: 10 }}
        />
        <Skeleton
          height={60}
          animation="wave"
          style={{ margin: 10, borderRadius: 10 }}
        />
        <Skeleton
          height={58}
          width={300}
          animation="wave"
          style={{ marginHorizontal: 50, marginVertical: 10, borderRadius: 60 }}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading ? (
        profileSkeleton()
      ) : (
        <View style={styles.container}>
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
              value={name}
              placeholder="Name"
              onChangeText={(value) => setName(value)}
              inputContainerStyle={styles.inputContainerStyle}
            />
            <Input
              value={email}
              placeholder="Email"
              leftIcon={{ type: "material-community", name: "email" }}
              onChangeText={(value) => setEmail(value)}
              inputContainerStyle={styles.inputContainerStyle}
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
            <Button
              title="Sign out"
              buttonStyle={{
                backgroundColor: "#000000",
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
        </View>
      )}
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
  profileSkeletonContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginHorizontal: 16,
    paddingTop: 16,
  },
});
