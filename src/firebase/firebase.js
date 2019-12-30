import firebase from "firebase";

// Initialize Firebase
const config = {
  apiKey: "AIzaSyAHrAGOglyd9a3z9f0peMnwdPIE47nStY0",
    authDomain: "reportessalud-3bee0.firebaseapp.com",
    databaseURL: "https://reportessalud-3bee0.firebaseio.com",
    projectId: "reportessalud-3bee0",
    storageBucket: "reportessalud-3bee0.appspot.com",
    messagingSenderId: "6901437138",
    appId: "1:6901437138:web:a14aa20738e7f0fa8ad30b",
    measurementId: "G-1S9711Z9PL"
};

firebase.initializeApp(config);
const auth = firebase.auth();

const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
const githubAuthProvider = new firebase.auth.GithubAuthProvider();
const twitterAuthProvider = new firebase.auth.TwitterAuthProvider();

const database = firebase.database();

export {
  database,
  auth,
  googleAuthProvider,
  githubAuthProvider,
  facebookAuthProvider,
  twitterAuthProvider
};
