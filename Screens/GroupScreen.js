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
} from "@rneui/themed";
import { onAuthStateChanged } from "firebase/auth";
import { setDoc, getDocs, doc, collection } from "firebase/firestore";
import { auth, firestore } from "../firebase";
import groupsEmpty from "../assets/groups-empty.png";

const GroupScreen = () => {
  const [user, setUser] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [groupList, setGroupList] = useState([]);

  const toggleDialog = () => {
    setIsVisible(!isVisible);
  };

  const handleCreateGroup = () => {
    if (validateData()) {
      setIsLoading(true);
      const data = { group_name: groupName, user_id: user.uid };
      saveGroup(data);
    }
  };

  const saveGroup = async (data) => {
    const groupRef = collection(firestore, "groups");
    await setDoc(doc(groupRef), data);
    setIsVisible(false);
    setGroupName("");
    fetchGroups();
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
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUser(user);
        fetchGroups();
      } else {
        // User is signed out
      }
    });
    return unsubscribe;
  }, []);

  const fetchGroups = async () => {
    const list = [];
    const querySnapshot = await getDocs(collection(firestore, "groups"));
    querySnapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() });
    });
    setGroupList(list);
    setIsLoading(false);
  };

  const renderItem = ({ item }) => {
    return (
      <ListItem key={item.id} bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{item.group_name}</ListItem.Title>
          <ListItem.Subtitle>{""}</ListItem.Subtitle>
        </ListItem.Content>
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
        <FlatList
          data={groupList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
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
          selectedIndex={selectedIndex}
          onPress={(value) => {
            console.log("value", value);
            setSelectedIndex(value);
          }}
          containerStyle={{ marginBottom: 20 }}
        />
        <Button
          title="Next"
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
