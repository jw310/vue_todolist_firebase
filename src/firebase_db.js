import firebase from 'firebase/app'
import 'firebase/firestore'

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: process.env.FIREBASE_APIKEY,
    authDomain: "todo-ccc5f.firebaseapp.com",
    databaseURL: "https://todo-ccc5f.firebaseio.com",
    projectId: "todo-ccc5f",
    storageBucket: "todo-ccc5f.appspot.com",
    messagingSenderId: "165986659946",
    appId: process.env.FIREBASE_APPID,
    measurementId: "G-LQQ5PNH9XL"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//console.log(firebase.database);

const db = firebase.firestore();

export default db;
