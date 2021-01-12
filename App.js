import React, { useState, useEffect } from "react";
import { COLORS } from "../Foodies/src/Colors";
import { View, Text, Platform, TouchableOpacity, LogBox } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import * as firebase from "firebase";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./src/redux/reducers";
import thunk from "redux-thunk";

const store = createStore(rootReducer, applyMiddleware(thunk));

import LoginScreen from "./src/Components/Auth/Login";
import RegisterScreen from "./src/Components/Auth/Register";
import MainScreen from "./src/Components/Main";
import AddScreen from "./src/Components/main/Add";
import SaveScreen from "./src/Components/main/Save";

const firebaseConfig = {
  apiKey: "AIzaSyCvG-3TX95Wsr-a7EunCFHFMpZgIqhFcjM",
  authDomain: "foodies-767f2.firebaseapp.com",
  projectId: "foodies-767f2",
  storageBucket: "foodies-767f2.appspot.com",
  messagingSenderId: "445699884923",
  appId: "1:445699884923:web:0db563bad4bc4118dedfde",
  measurementId: "G-8GCV4GS9XC",
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const Stack = createStackNavigator();

export default function App({ navigation }) {
  LogBox.ignoreAllLogs();

  const [loaded, setLoaded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        setLoaded(true);
        setLoggedIn(false);
      } else {
        setLoaded(true);
        setLoggedIn(true);
      }
    });
  }, []);

  if (!loaded) {
    // Before Loaded
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text> Loading .... </Text>
      </View>
    );
  }

  if (!loggedIn) {
    // Not Logged In
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Landing'>
          <Stack.Screen
            name='Login'
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='Register'
            component={RegisterScreen}
            options={{
              headerTintColor: COLORS.primary,
              headerTitleStyle: { fontWeight: "bold" },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    // Logged In
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName='Main'
            screenOptions={{
              headerStyle: {
                backgroundColor:
                  Platform.OS === "android" ? COLORS.primary : "white",
              },
              headerTintColor:
                Platform.OS === "android" ? "white" : COLORS.primary,
              title: "",
            }}>
            <Stack.Screen
              name='Main'
              component={MainScreen}
              navigation={navigation}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name='Add' component={AddScreen} />
            <Stack.Screen
              name='Save'
              component={SaveScreen}
              options={{
                title: "Add Recipe",
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}
