import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  Image,
  TextInput,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  StatusBar,
  Modal,
  ActivityIndicator,
} from "react-native";
import Button from "../Button.js";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { COLORS } from "../../Colors";

import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

const width = Dimensions.get("screen").width;

export default function Save(props) {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [cookingOrder, setCookingOrder] = useState("");
  const [loadingScreen, setLoadingScreen] = useState(false);

  const [imageUri, setImageUri] = useState(
    props.route.params != undefined ? props.route.params.image : null
  );

  const { navigation } = props;

  useEffect(() => {
    // Listener for Image
    navigation.addListener("focus", async () => {
      setImageUri(
        props.route.params != undefined ? props.route.params.image : null
      );
    });

    // Validation Listener For Done Button
    {
      title != "" && cookingOrder != "" && ingredients != ""
        ? navigation.setOptions({
            headerRight: () => (
              <TouchableOpacity
                activeOpacity={0.5}
                style={{ padding: 4, marginRight: 8 }}
                onPress={() => uploadImage()}>
                <MaterialCommunityIcons
                  name='check'
                  size={24}
                  color={Platform.OS === "android" ? "white" : COLORS.primary}
                />
              </TouchableOpacity>
            ),
          })
        : navigation.setOptions({
            headerRight: () => null,
          });
    }
  }, [title, cookingOrder, ingredients, props.route.params]);

  // Uploading Image Function

  const uploadImage = async () => {
    setLoadingScreen(true);
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const task = firebase
      .storage()
      .ref()
      .child(
        `recipe/${firebase.auth().currentUser.uid}/${Math.random().toString(
          36
        )}`
      )
      .put(blob);

    const taskProgress = (snapshot) => {
      // Showing Progress
      console.log(snapshot.bytesTransferred);
    };

    const taskCompleted = () => {
      // Completed
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        SavePostData(snapshot); // Saving Post
        console.log(snapshot);
      });
    };

    const taskError = (snapshot) => {
      // Error :(
      console.log(snapshot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

  // Saving Recipe on DB

  const SavePostData = (downloadURL) => {
    firebase
      .firestore()
      .collection("recipes")
      .doc(firebase.auth().currentUser.uid)
      .collection("userRecipes")
      .add({
        downloadURL,
        title,
        ingredients,
        cookingOrder,
        creation: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(function () {
        setLoadingScreen(false);
        navigation.popToTop();
      });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView>
        {Platform.OS === "android" ? (
          <StatusBar
            backgroundColor={COLORS.primary}
            barStyle='light-content'
          />
        ) : (
          <StatusBar backgroundColor={"white"} barStyle='dark-content' />
        )}
        <View style={{ alignItems: "center" }}>
          <Modal visible={loadingScreen}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#00000020",
              }}>
              <View
                style={{
                  backgroundColor: "white",
                  padding: 16,
                  borderRadius: 5,
                  width: "80%",
                  alignItems: "center",
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: COLORS.primary,
                    marginVertical: 4,
                  }}>
                  Uploading...
                </Text>
                <ActivityIndicator size='large' color={COLORS.primary} />
              </View>
            </View>
          </Modal>
          <View style={styles.titleInput}>
            <TextInput
              placeholder='Title: '
              onChangeText={(title) => setTitle(title)}
              style={{
                flex: 1,
                color: "black",
                textAlignVertical: "top",
                minHeight: "100%",
                padding: 8,
              }}
              autoCorrect={false}
              autoCapitalize='none'
            />
          </View>
          <View style={styles.multilineInput}>
            <TextInput
              placeholder='Ingredients: '
              multiline={true}
              numberOfLines={10}
              style={{
                flex: 1,
                color: "black",
                textAlignVertical: "top",
                minHeight: "100%",
                padding: 8,
              }}
              autoCorrect={false}
              autoCapitalize='none'
              maxLength={1000}
              onChangeText={(ingredients) => setIngredients(ingredients)}
            />
          </View>
          <View style={styles.multilineInput}>
            <TextInput
              placeholder='Cooking Order: '
              multiline={true}
              style={{
                flex: 1,
                color: "black",
                textAlignVertical: "top",
                minHeight: "100%",
                padding: 8,
              }}
              autoCorrect={false}
              autoCapitalize='none'
              numberOfLines={10}
              maxLength={1000}
              onChangeText={(cookingOrder) => setCookingOrder(cookingOrder)}
            />
          </View>
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={{
                height: 350,
                width: width / 1.1,
                borderRadius: 15,
                marginVertical: 16,
              }}
            />
          )}
          <Button
            title='Add Picture'
            btnStyle={styles.button}
            width={width / 1.1}
            textStyle={styles.buttonText}
            onSignUp={() => props.navigation.navigate("Add")}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Styles

const styles = StyleSheet.create({
  titleInput: {
    width: width / 1.1,
    alignSelf: "center",
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
    minHeight: 50,
  },
  multilineInput: {
    height: 250,
    width: width / 1.1,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
    minHeight: 50,
    padding: 4,
  },
  button: {
    flex: 1,
    borderWidth: 0,
    width: width / 1.1,
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    marginVertical: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "300",
    fontSize: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});
