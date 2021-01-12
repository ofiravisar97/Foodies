import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import firebase from "firebase";
import { connect } from "react-redux";
import { COLORS } from "../../Colors";

const height = Dimensions.get("screen").height;
const width = Dimensions.get("screen").width;

const Profile = (props) => {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const { currentUser, posts } = props;

  useEffect(() => {
    const { currentUser, posts } = props;
    console.log({ currentUser, posts });

    if (props.route.params.uid === firebase.auth().currentUser.uid) {
      // Current user is self
      setUser(currentUser);
      setUserPosts(posts);
    } else {
      // Current user is Someones else

      firebase
        .firestore()
        .collection("users") // Fetching User
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data());
          } else {
            console.log("something happend");
          }
        })
        .catch((err) => {
          console.log("error");
        });

      firebase
        .firestore()
        .collection("recipes") // Fetching Posts
        .doc(props.route.params.uid)
        .collection("userRecipes")
        .orderBy("creation", "asc")
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;

            return { id, ...data };
          });
          setUserPosts(posts);
        });
    }
  }, [props.route.params.uid]);

  if (user === null) {
    return <View />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.topView}>
        <View style={styles.nameContainer}>
          <Text
            style={{
              marginStart: 8,
              color: "white",
              marginTop: 16,
              fontSize: 18,
              fontWeight: "600",
            }}>
            {user.nickname}
          </Text>
          <Text
            style={{
              marginStart: 16,
              color: "white",
              marginTop: 4,
              fontSize: 14,
              fontWeight: "200",
            }}>
            {user.email}
          </Text>
          {/* Following Button Condition */}
          {props.route.params.uid !== firebase.auth().currentUser.uid ? ( // User is not self
            <View style={styles.followBtn}>
              {isFollowing ? ( // already following that user
                <TouchableOpacity
                  style={{
                    backgroundColor: "white",
                    padding: 8,
                    borderRadius: 5,
                  }}>
                  <Text style={{ color: COLORS.primary }}>Following</Text>
                </TouchableOpacity>
              ) : (
                // not following that user
                <TouchableOpacity
                  style={{
                    backgroundColor: "rgba(140, 187, 250, 0.48)",
                    padding: 8,
                    borderRadius: 5,
                  }}>
                  <Text style={{ color: "white" }}>Follow</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null}
        </View>
      </View>
      {/* --------------- Recipes List ------------------ */}
      <View style={styles.recipesContainer}>
        <FlatList
          numColumns={1}
          data={userPosts}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.9}>
              <View style={styles.postContainer}>
                <Text style={styles.recipeTitle}>{item.title}</Text>
                <Text style={{}}>{item.creation.toDate().toDateString()}</Text>
                <Image
                  source={{ uri: item.downloadURL }}
                  style={{
                    flex: 1,
                    aspectRatio: 1 / 1,
                    borderRadius: 15,
                  }}></Image>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topView: {
    padding: 8,
    justifyContent: "center",
    width: "100%",
    height: height / 4,
    backgroundColor: COLORS.primary,
    borderBottomStartRadius: 20,
    borderBottomEndRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.36,
    shadowRadius: 4,

    elevation: 11,
  },
  recipesContainer: {
    marginTop: 32,
    flex: 1,
  },
  postContainer: {
    flex: 1 / 3,
    padding: 16,
  },
  recipeTitle: {
    color: COLORS.primary,
    fontSize: 20,
    marginVertical: 16,
  },
  followBtn: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
    marginEnd: 16,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
});

export default connect(mapStateToProps, null)(Profile);
