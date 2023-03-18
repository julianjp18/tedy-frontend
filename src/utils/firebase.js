import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

try {
  const firebaseConfig = {
    apiKey: "AIzaSyA_qnH0U58p4u6G6qxD_dRqF2GD6v1i9RM",
    authDomain: "tedy-demo.firebaseapp.com",
    projectId: "tedy-demo",
    storageBucket: "tedy-demo.appspot.com",
    messagingSenderId: "96660932077",
    appId: "1:96660932077:web:6a43fe56f46ddfebd1d3e4",
    measurementId: "G-L4SBM9E3NE"
  };

  firebase.initializeApp(firebaseConfig);
} catch (err) {
  console.log('error on firebase config', err);
}

export const firebaseAuth = firebase.auth();
export const firestoreDB = firebase.firestore();
