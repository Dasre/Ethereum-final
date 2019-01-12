var database = firebase.database();

function readUserData() {
    var email = document.getElementById('signin_inputEmail').value;
    var passwords = document.getElementById('signin_inputPassword').value;
    
    firebase.auth().signInWithEmailAndPassword(email, passwords).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
}