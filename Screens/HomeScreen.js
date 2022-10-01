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
  Avatar,
  CheckBox,
  Icon,
} from "@rneui/themed";
import { onAuthStateChanged } from "firebase/auth";
import {
  setDoc,
  getDoc,
  getDocs,
  doc,
  collection,
  where,
  query,
} from "firebase/firestore";
import { auth, firestore } from "../firebase";
import groupsEmpty from "../assets/groups-empty.png";

const HomeScreen = () => {
  const [user, setUser] = useState(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleGroups, setIsVisibleGroups] = useState(false);

  //expense data
  const [expenceName, setExpenceName] = useState("");
  const [amount, setAmount] = useState(0);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedGroup, setSelectedGroup] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [expenseList, setExpenseList] = useState([]);
  const [groupList, setGroupList] = useState([]);

  const toggleDialog = () => {
    setIsVisible(!isVisible);
  };

  const toggleGroupDialog = () => {
    setIsVisibleGroups(!isVisibleGroups);
  };

  const handleNextBtn = () => {
    if (validateData()) {
      setIsVisible(!isVisible);
      setIsVisibleGroups(!isVisibleGroups);
    }
  };

  const handleCreateExpence = () => {
    console.log("selectedGroup", selectedGroup);
    const memberAmount = amount / selectedGroup.length;
    console.log("memberAmount", memberAmount);
    if (validateData()) {
      setIsLoading(true);
      const data = {
        exp_name: expenceName,
        amount: amount,
        user_id: user.uid,
        assign_group: selectedGroupId,
        split_values: selectedGroup.map((item) => ({
          uid: item.uid,
          amount: memberAmount,
        })),
      };
      saveExpence(data);
    }
  };

  const handleSelectGroup = (item) => {
    setSelectedGroupId(item.id);
    setSelectedGroup(item.group_members);
  };

  const saveExpence = async (data) => {
    const expRef = collection(firestore, "expenses");
    await setDoc(doc(expRef), data);
    setIsVisible(false);
    setIsVisibleGroups(false);
    setIsLoading(false);
    setExpenceName("");
    setSelectedGroup("");
    setAmount(0);
    fetchExpenses(user);
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
        fetchUserData(user);
        fetchExpenses(user);
        fetchGroupList(user);
      } else {
        // User is signed out
      }
    });
    return unsubscribe;
  }, []);

  const fetchUserData = async (user) => {
    const docRef = doc(firestore, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUser(docSnap.data());
    } else {
      console.log("No such document!");
    }
  };

  const fetchExpenses = async (user) => {
    setIsLoading(true);
    const list = [];
    const getExpensesQuery = query(
      collection(firestore, "expenses"),
      where("user_id", "==", user.uid)
    );
    const querySnapshot = await getDocs(getExpensesQuery);
    querySnapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() });
    });
    setExpenseList(list);
    setIsLoading(false);
  };

  const fetchGroupList = async (user) => {
    const list = [];
    const usersQuery = query(
      collection(firestore, "groups"),
      where("user_id", "==", user.uid)
    );
    const querySnapshot = await getDocs(usersQuery);
    querySnapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() });
    });
    setGroupList(list);
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
    let group = null;
    if (item.assign_group) {
      console.log("item.assign_group", item.assign_group);
      console.log("groupList", groupList);
      group = groupList.find((group) => group.id == item.assign_group);
      console.log("group", group);
    }
    return (
      <ListItem.Swipeable
        key={item.id}
        bottomDivider
        rightContent={(reset) => (
          <Button
            title="Split"
            onPress={() => reset()}
            icon={{
              name: "call-split",
              color: "white",
              type: "material-icons",
            }}
            buttonStyle={{ minHeight: "100%", backgroundColor: "#584CF4" }}
          />
        )}
      >
        <Avatar
          rounded
          icon={{ name: "attach-money", type: "material-icons" }}
          containerStyle={{ backgroundColor: "gray" }}
        />
        <ListItem.Content>
          <ListItem.Title>{item.exp_name}</ListItem.Title>
          {group && group.group_name ? (
            <ListItem.Title
              style={{
                color:
                  group.color_index == 0
                    ? "red"
                    : group.color_index == 1
                    ? "green"
                    : "blue",
              }}
            >
              {group.group_name}
            </ListItem.Title>
          ) : null}
        </ListItem.Content>
        <ListItem.Title>Rs. {item.amount}</ListItem.Title>
      </ListItem.Swipeable>
    );
  };

  const renderGroupItem = ({ item }) => {
    return (
      <ListItem key={item.id} bottomDivider>
        <CheckBox
          checkedIcon={
            <Icon
              name="radio-button-checked"
              type="material"
              color="green"
              size={20}
            />
          }
          uncheckedIcon={
            <Icon
              name="radio-button-unchecked"
              type="material"
              color="grey"
              size={20}
            />
          }
          containerStyle={{ padding: 0 }}
          checked={item.id == selectedGroupId}
          onPress={() => handleSelectGroup(item)}
        />
        <Avatar
          rounded
          icon={{ name: "users", type: "feather" }}
          containerStyle={{
            backgroundColor:
              item.color_index == 0
                ? "red"
                : item.color_index == 1
                ? "green"
                : "blue",
          }}
        />
        <ListItem.Title>{item.group_name}</ListItem.Title>
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
        <Dialog.Title title="Create expenses" />
        <Text style={styles.subTitleTextStyle}>Create a expenses</Text>
        <Input
          value={expenceName}
          placeholder="Name expenses"
          onChangeText={(value) => setExpenceName(value)}
          inputContainerStyle={styles.inputContainerStyle}
        />
        <Input
          value={amount}
          placeholder="Enter amount"
          keyboardType="numeric"
          onChangeText={(value) => setAmount(value)}
          inputContainerStyle={styles.inputContainerStyle}
        />
        <Text style={styles.subTitleTextStyle}>
          Paid by: {user ? " " + user.name : ""}
        </Text>

        <Text style={styles.subTitleTextStyle}>Split: {" Exact Amount"}</Text>
        <Button
          title="Next"
          type="outline"
          loading={isLoading}
          titleStyle={{ fontSize: 14 }}
          onPress={handleNextBtn}
        />
      </Dialog>
      <Dialog isVisible={isVisibleGroups} onBackdropPress={toggleGroupDialog}>
        <Dialog.Title title="Create transaction" />
        <Text style={styles.subTitleTextStyle}>Select group</Text>
        <FlatList
          data={groupList}
          extraData={selectedGroupId}
          renderItem={renderGroupItem}
          keyExtractor={(item) => item.id}
        />
        <Button
          title="Save expense"
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
    // marginHorizontal: 16,
    padding: 16,
  },
  subTitleTextStyle: {
    fontSize: 16,
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
