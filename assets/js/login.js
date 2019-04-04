findIdentifier('login-submit').addEventListener('click', function() {
  findIdentifier('login-fail').classList.add('hidden')
  var username = findIdentifier('login-username').value;
  var password = findIdentifier('login-password').value;
  if (username && password) {
    firebase.auth().signInWithEmailAndPassword(username, password).catch(function(error) {
      // Errors
      findIdentifier('login-fail').innerText = error.message;
      findIdentifier('login-fail').classList.remove('hidden')
    });
  }else {
    findIdentifier('login-fail').innerText = "Please fill out both email and password"
    findIdentifier('login-fail').classList.remove('hidden')
  }
})


firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    window.location = "../app"
  }
})
