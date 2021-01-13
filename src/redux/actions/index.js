import firebase from "firebase";
import {
  USER_STATE_CHANGED,
  USER_POSTS_STATE_CHANGED,
  USER_FOLLOWING_STATE_CHANGED,
  USERS_DATA_STATE_CHANGED,
  USERS_POSTS_STATE_CHANGED,
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
        for (let i = 0; i < following.length; i++) {
          // Whenever following Fetch user to feed
          dispatch(fetchUsersData(following[i]));
        }
      });
  };
}

export function fetchUsersData(uid) {
  return (dispatch, getState) => {
    const found = getState().usersState.users.some((el) => el.uid === uid);

    if (!found) {
      firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            let user = snapshot.data();
            user.uid = snapshot.id;
            dispatch({
              type: USERS_DATA_STATE_CHANGED,
              user,
            });
            dispatch(fetchUsersFollowingPosts(user.uid));
          } else {
            console.log("something happend");
          }
        })
        .catch((err) => {
          console.log("error");
        });
    }
  };
}

export function fetchUsersFollowingPosts(uid) {
  return (dispatch, getState) => {
    firebase
      .firestore()
      .collection("recipes")
      .doc(uid)
      .collection("userRecipes")
      .orderBy("creation", "asc")
      .get()
      .then((snapshot) => {
        const uid = snapshot.query._.C_.path.segments[1];
        const user = getState().usersState.users.find((el) => el.uid === uid);
        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;

          return { id, ...data, user };
        });
        dispatch({ type: USERS_POSTS_STATE_CHANGED, posts, uid });
      });
  };
}
