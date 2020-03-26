// const Auth = firebase.auth();
// const db = firebase.database();
// const gamesRef = dbRef.ref('games')
// const usersRef = dbRef.ref('users')
// const auth = null;

import {Auth, db, gamesRef, usersRef, auth} from '../config/firebaseConfig'


// // Register a new user
// Auth.createUserWithEmailAndPassword(email, password)
//  .catch(function (err) {
//    // Handle errors
//  });

//OR

async function createUser(email, pswd) {
  try {
    await Auth.createUserWithEmailAndPassword(email, password)
    console.log('success')
    return 'Success'
  } catch (error) {
    console.log('Error creating new user: ',error)
  }
}

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


/*
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
*/

export {
  createUser
}
