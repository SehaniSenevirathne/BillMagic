import React, { useEffect, useState } from "react";
import Toast from "react-native-root-toast";
import { StyleSheet, View, SafeAreaView, FlatList } from "react-native";
import {
  Image,
  Button,
  Input,
  Text,
  FAB,
  Dialog,
  ListItem,
  Skeleton,
  ButtonGroup,
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

const GroupScreen = () => {
  const [user, setUser] = useState(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleAddUser, setIsVisibleAddUser] = useState(false);

  //group data
  const [groupName, setGroupName] = useState("");
  const [colorIndex, setColorIndex] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [groupList, setGroupList] = useState([]);
  const [userList, setUserList] = useState([]);

  const toggleDialog = () => {
    setIsVisible(!isVisible);
  };

  const toggleUserDialog = () => {
    setIsVisibleAddUser(!isVisibleAddUser);
  };

  const handleCreateGroup = () => {
    let group_members = userList.filter((item) => item.selected);
    if (validateData()) {
      setIsLoading(true);
      const data = {
        group_name: groupName,
        user_id: user.uid,
        color_index: colorIndex,
        group_members: group_members.map((item) => ({ uid: item.uid })),
      };
      saveGroup(data);
    }
  };

  const handleNextBtn = () => {
    if (validateData()) {
      setIsVisible(!isVisible);
      setIsVisibleAddUser(!isVisibleAddUser);
    }
  };

  const saveGroup = async (data) => {
    const groupRef = collection(firestore, "groups");
    await setDoc(doc(groupRef), data);
    setIsVisibleAddUser(false);
    setColorIndex(0);
    setGroupName("");
    fetchGroups(user);
    fetchUserList(user);
  };

  const validateData = () => {
    if (!groupName) {
      Toast.show("Name is reqiured", {
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
        fetchGroups(user);
        fetchUserList(user);
      } else {
        // User is signed out
      }
    });
    return unsubscribe;
  }, []);

  const fetchGroups = async (user) => {
    const list = [];
    const groupQuery = query(
      collection(firestore, "groups"),
      where("user_id", "==", user.uid)
    );
    const querySnapshot = await getDocs(groupQuery);
    querySnapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() });
    });
    setGroupList(list);
    setIsLoading(false);
  };

  const fetchUserData = async (user) => {
    const docRef = doc(firestore, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUser(docSnap.data());
    } else {
      console.log("No such document!");
    }
  };

  const fetchUserList = async (user) => {
    const list = [];
    const usersQuery = query(
      collection(firestore, "users"),
      where("uid", "!=", user.uid)
    );
    const querySnapshot = await getDocs(usersQuery);
    querySnapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() });
    });
    setUserList(list);
  };

  const renderItem = ({ item }) => {
    return (
      <ListItem key={item.id} bottomDivider>
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
        <ListItem.Content>
          <ListItem.Title>{item.group_name}</ListItem.Title>
          <ListItem.Subtitle>
            memebers - {item.group_members && item.group_members.length}
          </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    );
  };

  const handleSelectGroupMemeber = (uid) => {
    const list = userList;
    const selectedItem = list.findIndex((user) => user.uid === uid);
    if (list[selectedItem].selected) {
      list[selectedItem].selected = false;
    } else {
      list[selectedItem].selected = true;
    }
    setUserList(list);
    setRefresh(!refresh);
  };

  const renderUserItem = ({ item }) => {
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
          checked={item.selected}
          onPress={() => handleSelectGroupMemeber(item.uid)}
        />
        <Avatar rounded containerStyle={{ backgroundColor: "orange" }} />
        <ListItem.Title>{item.name}</ListItem.Title>
      </ListItem>
    );
  };
  const groupSkeleton = () => {
    return (
      <View style={styles.groupSkeletonContainer}>
        <Skeleton height={60} animation="wave" style={{ margin: 2 }} />
        <Skeleton height={60} animation="wave" style={{ margin: 2 }} />
        <Skeleton height={60} animation="wave" style={{ margin: 2 }} />
        <Skeleton height={60} animation="wave" style={{ margin: 2 }} />
        <Skeleton height={60} animation="wave" style={{ margin: 2 }} />
        <Skeleton height={60} animation="wave" style={{ margin: 2 }} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {!isLoading && groupList.length > 0 ? (
        <View style={styles.listContainer}>
          <Text h4>User Groups</Text>
          <FlatList
            data={groupList}
            extraData={refresh}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      ) : !isLoading && groupList.length == 0 ? (
        <View style={styles.container}>
          <Image
            resizeMode="contain"
            source={groupsEmpty}
            style={styles.emptyImageStyle}
          />
          <Text h4>Create your first group to start splitting expenses </Text>
        </View>
      ) : (
        groupSkeleton()
      )}
      <FAB
        onPress={toggleDialog}
        placement="right"
        title="Create group"
        icon={{ name: "add", color: "white" }}
        color="#000000"
      />
      <Dialog isVisible={isVisible} onBackdropPress={toggleDialog}>
        <Dialog.Title title="Create new group" />
        <Text style={styles.subTitleTextStyle}>
          Create your first group to start splitting expenses
        </Text>
        <Input
          value={groupName}
          placeholder="Group Name"
          onChangeText={(value) => setGroupName(value)}
          inputContainerStyle={styles.inputContainerStyle}
          // errorMessage={!name && "name required"}
        />
        <Text style={styles.subTitleTextStyle}>Select Group Color</Text>
        <ButtonGroup
          buttons={["Red", "Green", "Blue"]}
          selectedIndex={colorIndex}
          onPress={(value) => {
            setColorIndex(value);
          }}
          containerStyle={{ marginBottom: 20 }}
        />
        <Button
          title="Next"
          type="outline"
          loading={isLoading}
          titleStyle={{ fontSize: 14 }}
          onPress={handleNextBtn}
        />
      </Dialog>
      <Dialog isVisible={isVisibleAddUser} onBackdropPress={toggleUserDialog}>
        <Dialog.Title title="Create new group" />
        <Text style={styles.subTitleTextStyle}>Select group members</Text>
        <FlatList
          data={userList}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
        />
        <Button
          title="Ok"
          type="outline"
          loading={isLoading}
          titleStyle={{ fontSize: 14 }}
          onPress={handleCreateGroup}
        />
      </Dialog>
    </SafeAreaView>
  );
};

export default GroupScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 16,
    padding: 16,
  },
  listContainer: {
    flex: 1,
    // marginHorizontal: 16,
    padding: 16,
  },
  subTitleTextStyle: {
    marginVertical: 20,
    textAlign: "center",
  },
  emptyImageStyle: {
    marginVertical: 20,
    height: 300,
    width: 300,
  },
  inputContainerStyle: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  groupSkeletonContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginHorizontal: 16,
    paddingTop: 16,
  },
});
