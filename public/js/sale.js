var database;

window.onload = function () {
    database = firebase.database();
    
    if (localStorage.getItem('counter') == null) {
        localStorage.setItem('counter', "0");
    }

    document.getElementById('parent').innerHTML = "";
    var leadsRef = database.ref();
    leadsRef.on('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {

            var childData = childSnapshot.val();
            var output_name = childData.name;
            var output_src = childData.src;
            var output_money = childData.money;

            build(output_name, output_src, output_money);


        });
    });

}

var counter;



function page() {
    location.href = "http://localhost:3000/input.html";
}


function build(input_name, input_src, input_money) {

    if (location.href != "http://localhost:3000/sales.html") {
        return
    }

    console.log(input_name);
    console.log(input_src);
    console.log(input_money);

    var abc = document.getElementById("parent");
    var div1 = document.createElement("div");
    div1.className = "col-md-4 mt-2";

    var div2 = document.createElement("div");
    div2.className = "card mb-4 box-shadow";

    var div_username = document.createElement("div")
    div_username.id = "username"+localStorage.getItem("counter");
    div_username.innerText = "user";


    var div3 = document.createElement("div");
    div3.className = "align-items-center p-3 bg-white text-center";
    div3.innerText = input_name;
    div3.id = "i"+localStorage.getItem("counter");

    var item_img = document.createElement("img");

    item_img.src = input_src;
    item_img.alt = "Card image cap";
    item_img.width = "100";
    item_img.height = "100";

    var div4 = document.createElement("div");
    div4.className = "card-body";

    var div5 = document.createElement("div");
    div5.className = "align-items-center text-center";
    var span = document.createElement("span");
    span.className = "text-left";

    // span.id = "price_unset";
    span.innerText = "價格:" + input_money;
    span.id = "p" + localStorage.getItem("counter");

    var button = document.createElement("button");
    button.className = "btn btn-sm btn-outline-secondary";
    button.innerText = "購買";
    button.id = "b" + localStorage.getItem("counter");
    button.onclick =  async function(){
        localStorage.setItem("buy",this.id);
        let x = localStorage.getItem('buy').slice(1,);
        var xx = "p"+x;        
        var price = document.getElementById(xx).innerText;

        if (bankAddress == "") {
            return;
        }
    
        if (bankAddress2 == "") {
            return;
        }
    
        // 解鎖
        let unlock = await unlockAccount();
        if (!unlock) {
            return;
        }
    
        // 更新介面
        waitTransactionStatus()
    
        $.post('/many_money', {
            address:bankAddress,
            account:nowAccount,
            to: many_TO.val(),
            value: parseInt(price, 10),
        }, function (result) {
            if (result.events !== undefined) {
    
                // 觸發更新帳戶資料
                update1.trigger('click')
    
                // 更新介面 
                doneTransactionStatus()
            }
            else {
                log(result)
                // 更新介面 
                doneTransactionStatus()
            }
        })
    
        //鑄Coin
        $.post('/transferFrom', {
            address: bankAddress2,
            account: nowAccount,
            to: many_TO.val(),
            value: parseInt(123, 10),
        }, function (result) {
            if (result.events !== undefined) {
    
                // 觸發更新帳戶資料
                update2.trigger('click')
    
                // 更新介面 
                doneTransactionStatus()
            }
            else {
                log(result)
                // 更新介面 
                doneTransactionStatus()
            }
        })

    };

    var counterInt = parseInt(localStorage.getItem("counter"), 10);
    counterInt = counterInt + 1;
    localStorage.setItem("counter", counterInt);

    div5.appendChild(span);
    div5.appendChild(button);

    div4.appendChild(div5);
    div3.appendChild(div_username);

    div2.appendChild(div3);
    div2.appendChild(item_img);
    div2.appendChild(div4);

    div1.appendChild(div2);
    abc.appendChild(div1);

}

function writeUserData(input_name, input_src, input_money) {
    firebase.database().ref().push({
        name: input_name,
        src: input_src,
        money: input_money

    });

}


let x = document.getElementById('input');
x.addEventListener('click', function () {
    addElementDiv();
})



function addElementDiv() {


    var input_name = document.getElementById("input_name").value;
    var input_src = document.getElementById("input_src").value;
    var input_money = document.getElementById("input_money").value;



    writeUserData(input_name, input_src, input_money);
    document.getElementById('parent').innerHTML = "";
    document.getElementById('parent').innerHTML = "";
    var leadsRef = database.ref();
    leadsRef.on('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {

            var childData = childSnapshot.val();
            var output_name = childData.name;
            var output_src = childData.src;
            var output_money = childData.money;

            build(output_name, output_src, output_money);


        });
    });


    document.getElementById("input_name").value = "";
    document.getElementById("input_src").value = "";
    document.getElementById("input_money").value = "";


}