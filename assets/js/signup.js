findIdentifier('signup-signup').addEventListener('click', function() {
  findIdentifier('signup-fail').classList.add('hidden')
  var email = findIdentifier('signup-email').value;
  var password = findIdentifier('signup-password').value;
  if (email && password) {
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      // Errors
      findIdentifier('signup-fail').innerText = error.message;
      findIdentifier('signup-fail').classList.remove('hidden');
    });
  }else {
    findIdentifier('signup-fail').innerText = "Please fill out all fields";
    findIdentifier('signup-fail').classList.remove('hidden');
  }
})


// firebase.auth().onAuthStateChanged(function(user) {
//   if (user) {
//     // User is signed in.
//     window.location = "../app"
//   }
// })
