//THIS IS JASMIN'S TEST FILE

/*

// export const db = firebase.firestore();
import {db, Auth} from '../config/firebaseConfig'

// const Auth = firebase.auth();
//Note: Doc Ids are the user's email
const games = db.collection('games')
const users = db.collection('users')
// const auth = null;


//--------------------- Save User's Inventory Data -------------------
function saveInventory(inputObj) {
  db.collection("users").doc(inputObj.email).set({
    itemAdded: inputObj.itemAdded,
    text: inputObj.text
  }, { merge: true })
  .then(function() {
      console.log("Document successfully written!");
  })
  .catch(function(error) {
    console.error("Error writing document: ", error);
  })
}

//---------------- Retrieve Existing User's Game Data ----------------

//----------------------- Register a New User ------------------------
function createUser(email, password) {
  Auth.createUserWithEmailAndPassword(email, password)
   .catch(function (err) {
     console.log('Error: ', error)
   })
}

function levelUp(email, newLevel) {
  games.doc(email).update({
    level: newLevel
  })
  .then(function() {
    console.log('Successfully leveled up!')
  })
  .catch(function(error) {
    console.error("Error with leveling up: ", error);
  })
}

function retrieveUserLevel(email) {
  games.doc(email).get(level)
  .then(function() {
    console.log('Successfully retrieved users level!')
  })
  .catch(function(error) {
    console.error("Error with retrieving level: ", error);
  })
}

// function completeGame() {

// }

// // Sign in existing user
// Auth.signInWithEmailAndPassword(email, password)
//  .catch(function(err) {
//    // Handle errors
//  });

// // Sign out user
// Auth.signOut()
//  .catch(function (err) {
//    // Handle errors
//  });



//  var data = {
//   email: $('#registerEmail').val(), //get the email from Form
//   password : $('#registerPassword').val() //get the pass from Form
// };
// firebase
//   .auth()
//   .createUserWithEmailAndPassword(data.email, data.password)
//   .then( function(user){
//     console.log("Successfully created user account with uid:", user.uid);
//   })
//   .catch(function(error){
//     console.log("Error creating user:", error);
//   });

//  firebase.auth().onAuthStateChanged(function(user) {
  // window.user = user; // user is undefined if no user signed in
//  });



ngOnInit() {
  firebase.initializeApp({
    apiKey: 'AIzaSyDrDLZzjnDLYd7bLIBzdBqT9U219MBej8g',
    authDomain: 'fir-chat-75d32.firebaseapp.com',
    databaseURL: 'https://fir-chat-75d32.firebaseio.com',
    projectId: 'fir-chat-75d32',
    storageBucket: ''
  });

  this.fbAuthSubscription = this.fbService.authChanged.subscribe(
    (user: firebase.User) => {
      if (user) {
        this.authenticated = true;
      } else {
        this.authenticated = false;
      }
    }
  );
}

onLogout() {
  this.fbService.logUserOut();
}

ngOnDestroy() {
  this.fbAuthSubscription.unsubscribe();
}
}


export {
  createUser,
  levelUp,
  retrieveUserLevel
}

// Uncaught TypeError: _config_firebaseConfig__WEBPACK_IMPORTED_MODULE_0__.default.ref is not a function
//     at Module../src/server/routes.js (bundle.js:234901)
//     at __webpack_require__ (bundle.js:20)
//     at Module../src/scenes/WorldScene.js (bundle.js:234622)
//     at __webpack_require__ (bundle.js:20)
//     at Module../src/index.js (bundle.js:234353)
//     at __webpack_require__ (bundle.js:20)
//     at bundle.js:84
//     at bundle.js:87

*/
