// Initialize Firebase
var config = {
  apiKey: "AIzaSyDuJxq5bJwsqgPnehAiA1dzkit8l2FnX6g",
  authDomain: "tew31-1449c.firebaseapp.com",
  databaseURL: "https://tew31-1449c.firebaseio.com",
  projectId: "tew31-1449c",
  storageBucket: "",
  messagingSenderId: "489031115838"
};
firebase.initializeApp(config);


let signedIn
let currentUser = {}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    signedIn = true;
    currentUser.uid = user.uid
  }else {
    signedIn = false;
  }
})











function signIn(email, password) {
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Errors
    return (error.message)
  });
}
