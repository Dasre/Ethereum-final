'use strict'
// Initialize Firebase
var config = {
    apiKey: "AIzaSyCJWMAcz0RZjgl5j-2kaOUM5XnGjzaK8Xs",
    authDomain: "ethereum-aebc6.firebaseapp.com",
    databaseURL: "https://ethereum-aebc6.firebaseio.com",
    projectId: "ethereum-aebc6",
    storageBucket: "ethereum-aebc6.appspot.com",
    messagingSenderId: "142284354324"
};
firebase.initializeApp(config);

let register = $('#quickstart-sign-up');

register.on('click', function(){
    let email = $('#signup_inputEmail');
    let pwd = $('#signup_inputPassword');

    $.post('/create', {
		email: email,
		pwd: pwd,
	}, function (result) {
		if (result.events !== undefined) {
            alert('good')
		}
		else {
			alert('no')

		}
    })
    
    firebase.auth().createUserWithEmailAndPassword(email,pwd).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMsg = error.message;
        console.log(errorMsg);
    });

})


/*
//登入
var accountL = document.getElementById("accountL");
var pwdL = document.getElementById("pwdL");
var loginSmtBtn = document.getElementById("loginSmtBtn");
loginSmtBtn.addEventListener("click",function(){
	console.log(accountL.value);
	firebase.auth().signInWithEmailAndPassword(accountL.value, pwdL.value).catch(function(error) {
  	// Handle Errors here.
  	var errorCode = error.code;
  	var errorMessage = error.message;
  	console.log(errorMessage);
  })
},false);

//登出
var signoutSmtBtn = document.getElementById("signoutSmtBtn");
signoutSmtBtn.addEventListener("click",function(){
	firebase.auth().signOut().then(function() {
		console.log("User sign out!");
	}, function(error) {
  	console.log("User sign out error!");
	})
},false);
*/