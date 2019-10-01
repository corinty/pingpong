import admin from "firebase-admin";
import serviceAccount from "../firebase-admin.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tydev-ping-pong.firebaseio.com",
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

module.exports = { db, FieldValue };
