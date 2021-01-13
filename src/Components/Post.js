import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";

import { COLORS } from "../Colors";

const Post = (props) => {
  return (
    <View>
      <TouchableOpacity activeOpacity={0.9}>
        <View style={styles.postContainer}>
          <View
            style={{
              marginBottom: 4,
              flexDirection: "row",
              justifyContent: "space-between",
            }}>
            <Text style={styles.recipeTitle}>{props.post.title}</Text>
            <Text>{props.post.creation.toDate().toDateString()}</Text>
          </View>
          <Image
            source={{ uri: props.post.downloadURL }}
            style={styles.image}></Image>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    padding: 16,
  },
  recipeTitle: {
    color: COLORS.primary,
    fontSize: 20,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
    borderRadius: 15,
  },
  creation: {},
});

export default Post;
