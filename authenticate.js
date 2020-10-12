
 // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyCQaaAZDBlSXOEdwt0eWw7IXQsVdMpkEbY",
    authDomain: "assessmentapp-1d809.firebaseapp.com",
    databaseURL: "https://assessmentapp-1d809.firebaseio.com",
    projectId: "assessmentapp-1d809",
    storageBucket: "assessmentapp-1d809.appspot.com",
    messagingSenderId: "611482106673",
    appId: "1:611482106673:web:671ee495368e10114d4e10",
    measurementId: "G-870JKWYNGS"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var studentsDB = firebase.database().ref("students");
  var testsDB = firebase.database().ref("tests");
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // ...
    console.log(user);
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
    console.log(errorCode);
    console.log(errorMessage);
  });