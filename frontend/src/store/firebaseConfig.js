import firebase from "firebase/app";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyCcrzECR6WLk_YtsCk6rUMbNxfFh0cn__8",
  authDomain: "tydev-ping-pong.firebaseapp.com",
  databaseURL: "https://tydev-ping-pong.firebaseio.com",
  projectId: "tydev-ping-pong",
  storageBucket: "tydev-ping-pong.appspot.com",
  messagingSenderId: "29869586839",
  appId: "1:29869586839:web:080ae459d72aa8f6"
};

firebase.initializeApp(config);

export const db = firebase.firestore();

export default config;
