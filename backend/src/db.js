var admin = require("firebase-admin");
const serviceAccount = require("../tydev-ping-pong-firebase-admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tydev-ping-pong.firebaseio.com"
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

module.exports = { db, FieldValue };
