function login(){
    var uid = document.getElementById("signin_inputUID").value;
    var pwd = document.getElementById("signin_inputPassword").value;
    var adr = document.getElementById("signin_Address").value;

	var userRef = firebase.database().ref(uid+ '/account');
  	userRef.once('value',function(snapshot) {
      	var username=snapshot.child("username").val();
      	var password=snapshot.child("password").val();
      	if(username==null){
      		alert("no such user!");
      	}else{
      		if(password!=pwd){
      			alert("Wrong Password");
      		}else{/*
      			var updates={};
    			updates[userRef+'/address'] = adr;
    			alert(updates);
  				firebase.database().ref().update(updates);*/
  				userRef.update({address:adr});

      			window.location.href='http://localhost:3000/sales.html?uid='+uid+'&username='+username+'&address='+adr;
      		}
      	}

    });   
}