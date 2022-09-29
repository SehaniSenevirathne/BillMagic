import React, { useEffect, useState } from "react";
import Toast from "react-native-root-toast";
import { SafeAreaView, StyleSheet, View, FlatList } from "react-native";
import {
  Text,
  FAB,
  Image,
  Input,
  Dialog,
  Button,
  Skeleton,
  ListItem,
} from "@rneui/themed";
import { onAuthStateChanged } from "firebase/auth";
import { setDoc, getDoc, getDocs, doc, collection } from "firebase/firestore";
import { auth, firestore } from "../firebase";
import groupsEmpty from "../assets/groups-empty.png";

const HomeScreen = () => {
  const [user, setUser] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [expenceName, setExpenceName] = useState("");
  const [amount, setAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [expenseList, setExpenseList] = useState([]);

  const toggleDialog = () => {
    setIsVisible(!isVisible);
  };

  const handleCreateExpence = () => {
    if (validateData()) {
      setIsLoading(true);
      const data = { exp_name: expenceName, amount: amount, user_id: user.uid };
      saveExpence(data);
    }
  };

  const saveExpence = async (data) => {
    const expRef = collection(firestore, "expenses");
    await setDoc(doc(expRef), data);
    setIsVisible(false);
    setIsLoading(false);
    setExpenceName("");
    setAmount(0);
    fetchExpeses();
  };

  const validateData = () => {
    if (!expenceName) {
      Toast.show("Name is reqiured", {
        duration: Toast.durations.SHORT,
      });
      return false;
    } else if (!amount) {
      Toast.show("Amount is reqiured", {
        duration: Toast.durations.SHORT,
      });
      return false;
    }
    return true;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        getUserData(user);
        fetchExpeses();
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
      setUser(docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  const fetchExpeses = async () => {
    setIsLoading(true);
    const list = [];
    const querySnapshot = await getDocs(collection(firestore, "expenses"));
    querySnapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() });
    });
    setExpenseList(list);
    setIsLoading(false);
  };

  const expSkeleton = () => {
    return (
      <>
        <Skeleton height={60} animation="wave" style={{ marginTop: 10 }} />
        <Skeleton height={60} animation="wave" style={{ marginTop: 10 }} />
        <Skeleton height={60} animation="wave" style={{ marginTop: 10 }} />
        <Skeleton height={60} animation="wave" style={{ marginTop: 10 }} />
        <Skeleton height={60} animation="wave" style={{ marginTop: 10 }} />
        <Skeleton height={60} animation="wave" style={{ marginTop: 10 }} />
      </>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <ListItem key={item.id} bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{item.exp_name}</ListItem.Title>
          <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* <Text>Email: {auth.currentUser?.email}</Text> */}
        <Text h4>Expenses</Text>
        {!isLoading && expenseList.length > 0 ? (
          <FlatList
            data={expenseList}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        ) : !isLoading && expenseList.length == 0 ? (
          <View style={styles.container}>
            <Image
              resizeMode="contain"
              source={groupsEmpty}
              style={styles.emptyImageStyle}
            />
            <Text h4>Add your expenses first to start splitting</Text>
          </View>
        ) : (
          expSkeleton()
        )}
      </View>

      <FAB
        onPress={toggleDialog}
        placement="right"
        icon={{ name: "add", color: "white" }}
        color="#584CF4"
      />
      <Dialog isVisible={isVisible} onBackdropPress={toggleDialog}>
        <Dialog.Title title="Create transaction" />
        <Text style={styles.subTitleTextStyle}>Create a transaction</Text>
        <Input
          value={expenceName}
          placeholder="Name Expence"
          onChangeText={(value) => setExpenceName(value)}
          inputContainerStyle={styles.inputContainerStyle}
          // errorMessage={!name && "name required"}
        />
        <Input
          value={amount}
          placeholder="Enter Amount"
          keyboardType="numeric"
          onChangeText={(value) => setAmount(value)}
          inputContainerStyle={styles.inputContainerStyle}
          // errorMessage={!name && "name required"}
        />
        <Text style={styles.subTitleTextStyle}>
          Paid by : {user ? user.name : ""}{" "}
        </Text>
        <Button
          title="Next"
          type="outline"
          loading={isLoading}
          titleStyle={{ fontSize: 14 }}
          onPress={handleCreateExpence}
        />
      </Dialog>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    // alignItems: "flex-start",
    marginHorizontal: 16,
    padding: 16,
  },
  subTitleTextStyle: {
    marginVertical: 10,
    textAlign: "center",
  },
  inputContainerStyle: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  skeletonContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginHorizontal: 16,
    paddingTop: 16,
  },
  emptyImageStyle: {
    marginVertical: 20,
    height: 300,
    width: 300,
  },
});
