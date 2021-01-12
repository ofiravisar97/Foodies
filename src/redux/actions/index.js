import firebase from "firebase";
import {
  USER_STATE_CHANGED,
  USER_POSTS_STATE_CHANGED,
  USER_FOLLOWING_STATE_CHANGED,
} from "../constants/index";

export function fetchUser() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          dispatch({ type: USER_STATE_CHANGED, currentUser: snapshot.data() });
        } else {
          console.log("something happend");
        }
      })
      .catch((err) => {
        console.log("error");
      });
  };
}

export function fetchUserPosts() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("recipes")
      .doc(firebase.auth().currentUser.uid)
      .collection("userRecipes")
      .orderBy("creation", "asc")
      .get()
      .then((snapshot) => {
        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;

          return { id, ...data };
        });
        dispatch({ type: USER_POSTS_STATE_CHANGED, posts });
      });
  };
}

export function fetchUserFollowing() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .onSnapshot((snapshot) => {
        let following = snapshot.docs.map((doc) => {
          const id = doc.id;

          return id;
        });
        dispatch({ type: USER_FOLLOWING_STATE_CHANGED, following });
      });
  };
}
