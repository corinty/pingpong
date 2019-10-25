import firebase from "firebase/app";
import "firebase/firestore";
import config from "../firestore.config.json";
firebase.initializeApp(config);

export const db = firebase.firestore();

export default config;

