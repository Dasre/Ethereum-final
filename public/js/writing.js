var database = firebase.database();

function writeUserData() {
    var addresses = document.getElementById('signup_inputaddresses').value;
    var passwords = document.getElementById('signup_inputPassword').value;

    firebase.database().ref(addresses).set({
        Address: addresses,
        Password: passwords,
    });
}