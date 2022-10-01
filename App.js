import React, { useEffect, useState } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { RootSiblingParent } from "react-native-root-siblings";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import LoginScreen from "./Screens/LoginScreen";
import HomeScreen from "./Screens/HomeScreen";
import RegisterScreen from "./Screens/RegisterScreen";
import GroupScreen from "./Screens/GroupScreen";
import GroupViewScreen from "./Screens/GroupViewScreen";
import ProfileScreen from "./Screens/ProfileScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        
        setUser(user);
      } else {
        // User is signed out
        setUser("");
        console.log("User is signed out");
      }
    });
    return unsubscribe;
  }, []);

  const GroupStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Groups"
          component={GroupScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="GroupViewScreen"
          component={GroupViewScreen}
        />
      </Stack.Navigator>
    );
  };

  return (
    <RootSiblingParent>
      <NavigationContainer>
        {!user ? (
          <Stack.Navigator>
            <Stack.Screen
              options={{ headerShown: false }}
              name="Login"
              component={LoginScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name="Register"
              component={RegisterScreen}
            />
          </Stack.Navigator>
        ) : (
          <Tab.Navigator>
            <Tab.Screen
              name="Home"
              component={HomeScreen}
              options={{
                tabBarIcon: () => (
                  <MaterialCommunityIcons name="home" size={30} />
                ),
              }}
            />
            <Tab.Screen
              name="Group"
              component={GroupStack}
              options={{
                tabBarIcon: () => (
                  <MaterialCommunityIcons name="card-multiple" size={30} />
                ),
              }}
            />
            <Tab.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                tabBarIcon: () => (
                  <MaterialCommunityIcons name="account-circle" size={30} />
                ),
              }}
            />
          </Tab.Navigator>
        )}
      </NavigationContainer>
    </RootSiblingParent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
