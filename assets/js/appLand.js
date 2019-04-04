firebase.auth().onAuthStateChanged(function(user) {
  console.log(user);
  if (user) {
    // User is signed in.
    loadDoc("overview")
  } else {
    // No user is signed in.
    window.location.href = "/app/login.html"
  }
})
