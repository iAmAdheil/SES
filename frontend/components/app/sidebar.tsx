import { useCallback, useEffect, useState } from "react";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  useDrawerStatus,
} from "@react-navigation/drawer";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import {
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import { useChats } from "@/hooks/useChats";
import auth from "@react-native-firebase/auth";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";

function CustomDrawerContent({
  props,
}: {
  props: DrawerContentComponentProps;
}) {
  const [fetch, setFetch] = useState<boolean>(false);
  const { chats, loading } = useChats(fetch);
  const drawerStatus = useDrawerStatus();

  useEffect(() => {
    if (drawerStatus === "open") {
      setFetch(true);
    } else if (drawerStatus === "closed") {
      setFetch(false);
    }
  }, [drawerStatus]);

  const closeDrawer = () => {
    props.navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView
      {...props}
      scrollEnabled={false}
      contentContainerStyle={sidebarStyles.scrollView}
    >
      <View style={sidebarStyles.container}>
        {/* <TouchableOpacity onPress={() => auth().signOut()}>
          <Text>Sign Out</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={sidebarStyles.newChatContainer}
          onPress={() => closeDrawer()}
        >
          <Entypo name="new-message" size={22} color="black" />
          <Text style={sidebarStyles.newChatText}>New Chat</Text>
        </TouchableOpacity>
        <Chats chats={chats} loading={loading} />
        <Footer />
      </View>
    </DrawerContentScrollView>
  );
}

const sidebarStyles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 8,
    height: "100%",
  },
  newChatContainer: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  newChatText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

function Chats({ chats, loading }: { chats: any; loading: boolean }) {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={chatsStyles.container}
    >
      {loading ? (
        <View style={chatsStyles.loaderContainer}>
          <ActivityIndicator size="small" color="black" />
        </View>
      ) : (
        chats.map((chat: any) => {
          return (
            <TouchableOpacity key={chat._id}>
              <Text style={chatsStyles.titleText} className="line-clamp-1">
                {chat.title}
              </Text>
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
}

const chatsStyles = StyleSheet.create({
  loaderContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 16,
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

function Footer() {
  return (
    <View style={footerStyles.container}>
      <TouchableOpacity style={footerStyles.avatorContainer}>
        <FontAwesome5 name="user-alt" size={15} color="white" />
      </TouchableOpacity>
      <Text style={footerStyles.userText}>Adheil Gupta</Text>
    </View>
  );
}

const footerStyles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingTop: 12,
    paddingHorizontal: 12,
  },
  avatorContainer: {
    backgroundColor: "black",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "black",
    width: 40,
    height: 40,
    padding: 4,
    borderRadius: 20,
  },
  userText: {
    fontSize: 20,
    fontWeight: "700",
    color: "black",
  },
});

export default CustomDrawerContent;
