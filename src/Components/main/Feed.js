import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { connect } from "react-redux";
import { COLORS } from "../../Colors";
import Post from "../Post";

const Feed = (props) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetching Feed Posts
    let posts = [];
    if (props.usersLoaded == props.following.length) {
      for (let i = 0; i < props.following.length; i++) {
        const user = props.users.find((el) => el.uid === props.following[i]);
        if (user != undefined) {
          posts = [...posts, user.posts];
        }
      }

      // Sorting by Date
      posts.sort(function (x, y) {
        return x.creation - y.creation;
      });

      setPosts(posts);
    }
  }, [props.usersLoaded]);

  return (
    <View style={styles.container}>
      {/* --------------- Feed List ------------------ */}
      <View style={styles.recipesContainer}></View>
      <FlatList
        numColumns={1}
        data={posts}
        horizontal={false}
        renderItem={({ item, index }) =>
          item[0] == undefined ? null : (
            <View>
              <Text
                style={{
                  marginStart: 16,
                  fontSize: 20,
                  fontWeight: "bold",
                  color: COLORS.primary,
                }}>
                {item[0].user.nickname}
              </Text>
              <Post post={item[0]} />
            </View>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  recipesContainer: {
    marginTop: 32,
    flex: 1,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  users: store.usersState.users,
  usersLoaded: store.usersState.usersLoaded,
});

export default connect(mapStateToProps, null)(Feed);
