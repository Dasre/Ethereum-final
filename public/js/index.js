'use strict'

let contractAddress = $('#contractAddress');
let contractAddress2 = $('#contractAddress2')
let deployedContractAddressInput = $('#deployedContractAddressInput');
let loadDeployedContractButton = $('#loadDeployedContractButton');
let deployNewContractButton = $('#deployNewContractButton');
let deployNewContractButton2 = $('#deployNewContractButton2');

let killContractButton = $('#killContractButton')

let whoami = $('#whoami');
let whoamiButton = $('#whoamiButton');
let copyButton = $('#copyButton');

let update = $('#update');
let update2 = $('#update2');

let logger = $('#logger');

let deposit = $('#deposit');
let depositButton = $('#depositButton');

let withdraw = $('#withdraw');
let withdrawButton = $('#withdrawButton');

let transferEtherTo = $('#transferEtherTo');
let transferEtherValue = $('#transferEtherValue');
let transferEtherButton = $('#transferEtherButton');

let mintCoin = $('#mintCoin');
let mintCoinButton = $('#mintCoinButton');

let buyCoin = $('#buyCoin');
let buyCoinButton = $('#buyCoinButton');

let transferCoinTo = $('#transferCoinTo');
let transferCoinValue = $('#transferCoinValue');
let transferCoinButton = $('#transferCoinButton');

let getOwner = $('#getOwner');
let getOwnerButton = $('#getOwnerButton');

let transferOwner = $('#transferOwner');
let transferOwnerButton = $('#transferOwnerButton');

let transferTo = $('#transferTo');
let transferValue = $('#transferValue');
let transferButton = $('#transferButton');

let balance = $('#balance');
let balanceOf = $('#balanceOf');

let mintERC721 = $('#mintERC721');
let mintERC721Button = $('#mintERC721Button');
let input = $('#input');
let input_name = $('#input_name');

let transferERC721_ID = $('#transferERC721_ID');
let transferERC721_TO = $('#transferERC721_TO');
let transferERC721Button = $('#transferERC721Button');

let many = $('#many');
let many_TO = $('#many_TO');

let addminter_TO = $('addminter_TO');
let addminter = $('#addminter');
// TODO
// ...

let bankAddress = "";
let bankAddress2 = "";
let nowAccount = "";

var thisURL = document.URL;      
var url = new URL(thisURL);
var uid = url.searchParams.get("uid");
var username = url.searchParams.get("username");
var address = url.searchParams.get("address");

function log(...inputs) {
	for (let input of inputs) {
		if (typeof input === 'object') {
			input = JSON.stringify(input, null, 2)
		}
		logger.html(input + '\n' + logger.html())
	}
}

// 載入使用者至 select tag
$.get('/accounts', function (accounts) {
	for (let account of accounts) {
		whoami.append(`<option value="${account}">${account}</option>`)
	}
	nowAccount = whoami.val();

	update.trigger('click')
	update2.trigger('click')

	log(accounts, '以太帳戶')
})

// 當按下載入既有合約位址時
loadDeployedContractButton.on('click', function () {
	loadBank(deployedContractAddressInput.val())
})

// 當按下部署合約時
deployNewContractButton2.on('click', function () {
	newBank2()
})

deployNewContractButton.on('click', function () {
	newBank()
})

// 當按下登入按鍵時
whoamiButton.on('click', async function () {

	nowAccount = whoami.val();

	update.trigger('click')

})

// 當按下複製按鍵時
copyButton.on('click', function () {
	let textarea = $('<textarea />')
	textarea.val(whoami.val()).css({
		width: '0px',
		height: '0px',
		border: 'none',
		visibility: 'none'
	}).prependTo('body')

	textarea.focus().select()

	try {
		if (document.execCommand('copy')) {
			textarea.remove()
			return true
		}
	} catch (e) {
		console.log(e)
	}
	textarea.remove()
	return false
})

// 當按下更新按鍵時
// TODO: NCCU coin balance
update.on('click', function () {
	if (bankAddress != "") {
		$.get('/allBalance', {
			address: bankAddress,
			account: nowAccount,
			to: nowAccount
		}, function (result) {
			log({
				address: nowAccount,
				ethBalance: result.ethBalance,
				total: result.total,
				balance: result.balance
			})
			log('更新帳戶資料')

			$('#ethBalance').text('以太帳戶餘額 (wei): ' + result.ethBalance)
			$('#bankBalance').text('ERC20 token 總量: ' + result.total)
			$('#nccucoinBalance').text('你擁有的ERC20 token: ' + result.balance)
		})
	}
	else {
		$.get('/balance', {
			account: nowAccount
		}, function (result) {
			$('#ethBalance').text('以太帳戶餘額 (wei): ' + result.ethBalance)
			$('#bankBalance').text('ERC20 token 總量: ')
			$('#nccucoinBalance').text('你擁有的ERC20 token: ')
		})
	}
})

update2.on('click', function () {
	if (bankAddress2 != "") {
		$.get('/allBalance2', {
			address: bankAddress2,
			account: nowAccount,
			to: nowAccount
		}, function (result) {
			log({
				address: nowAccount,
				ethBalance: result.ethBalance,
				total: result.isMinter,
				count: result.count
			})
			log('更新帳戶資料')

			$('#ethBalance2').text('以太帳戶餘額 (wei): ' + result.ethBalance)
			$('#bankBalance2').text('是否為ERC721 Minter: ' + result.isMinter)
			$('#nccucoinBalance2').text('你擁有的ERC721量: ' + result.count)
		})
	}
	else {
		$.get('/balance', {
			account: nowAccount
		}, function (result) {
			$('#ethBalance2').text('以太帳戶餘額 (wei): ' + result.ethBalance)
			$('#bankBalance2').text('是否為ERC721 Minter : ')
			$('#nccucoinBalance2').text('你擁有的ERC721量: ')
		})
	}
})

// 當按下刪除合約按鈕時
killContractButton.on('click', async function () {

	if (bankAddress == "") {
		return;
	}

	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return;
	}

	// 更新介面 
	waitTransactionStatus();
	// 刪除合約
	$.post('/kill', {
		address: bankAddress,
		account: nowAccount
	}, function (result) {
		if (result.transactionHash !== undefined) {
			log(bankAddress, '成功刪除合約');

			bankAddress = "";
			contractAddress.text('合約位址:' + bankAddress)
			deployedContractAddressInput.val(bankAddress)

			// 觸發更新帳戶資料
			update.trigger('click');

			// 更新介面 
			doneTransactionStatus();
		}
		else {
			log(result)
			// 更新介面 
			doneTransactionStatus();

		}
	})
})
/** 
// 當按下存款按鍵時
depositButton.on('click', async function () {

	if (bankAddress == "") {
		return;
	}

	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return;
	}

	// 更新介面 
	waitTransactionStatus();
	// 存款
	$.post('/deposit', {
		address: bankAddress,
		account: nowAccount,
		value: deposit.val()
	}, function (result) {
		if (result.events !== undefined) {
			log(result.events.DepositEvent.returnValues, '存款成功')

			// 觸發更新帳戶資料
			update.trigger('click')

			// 更新介面 
			doneTransactionStatus()
		}
		else {
			log(result)
			// 更新介面 
			doneTransactionStatus()
		}
	})

})

// 當按下提款按鍵時
withdrawButton.on('click', async function () {

	if (bankAddress == "") {
		return;
	}

	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return;
	}

	// 更新介面
	waitTransactionStatus()
	// 提款
	$.post('/withdraw', {
		address: bankAddress,
		account: nowAccount,
		value: parseInt(withdraw.val(), 10)
	}, function (result) {
		if (result.events !== undefined) {
			log(result.events.WithdrawEvent.returnValues, '提款成功')

			// 觸發更新帳戶資料
			update.trigger('click')

			// 更新介面 
			doneTransactionStatus()
		}
		else {
			log(result)
			// 更新介面 
			doneTransactionStatus()
		}
	})
})
*/
// ERC20轉帳
transferEtherButton.on('click', async function () {

	if (bankAddress == "") {
		return;
	}

	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return;
	}

	// 更新介面
	waitTransactionStatus()
	// 轉帳
	$.post('/transfer', {
		address: bankAddress,
		account: nowAccount,
		to: transferEtherTo.val(),
		value: parseInt(transferEtherValue.val(), 10)
	}, function (result) {
		if (result.events !== undefined) {

			// 觸發更新帳戶資料
			update.trigger('click')

			// 更新介面 
			doneTransactionStatus()
		}
		else {
			log(result)
			// 更新介面 
			doneTransactionStatus()
		}
	})
})

// TODO
// ...

// 鑄ERC20
mintCoinButton.on('click', async function() {

	if (bankAddress == "") {
		return;
	}

	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return;
	}

	// 更新介面
	waitTransactionStatus()

	//鑄Coin
	$.post('/mintCoin', {
		address: bankAddress,
		account: nowAccount,
		to: nowAccount,
		value: parseInt(10000, 10),
	}, function (result) {
		if (result.events !== undefined) {

			// 觸發更新帳戶資料
			update.trigger('click')

			// 更新介面 
			doneTransactionStatus()
		}
		else {
			log(result)
			// 更新介面 
			doneTransactionStatus()
		}
	})

	$.post('/approve', {
		address:bankAddress,
		account:nowAccount,
		to: nowAccount,
		value: parseInt(10000, 10),
	}, function (result) {
		if (result.events !== undefined) {

			// 觸發更新帳戶資料
			update.trigger('click')

			// 更新介面 
			doneTransactionStatus()
		}
		else {
			log(result)
			// 更新介面 
			doneTransactionStatus()
		}
	})

})


// 鑄ERC721
input.on('click', async function() {



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
	
	//鑄Coin
	$.post('/mint', {
		address: bankAddress2,
		account: nowAccount,
		to: nowAccount,
		value: parseInt(input_name.val(),10)
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

	addElementDiv();
})

//交易 ERC721
transferERC721Button.on('click', async function() {

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

	//鑄Coin
	$.post('/transferFrom', {
		address: bankAddress2,
		account: nowAccount,
		to: transferERC721_TO.val(),
		value: parseInt(transferERC721_ID.val(), 10),
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
})


addminter.on('click', async function() {

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

	//鑄Coin
	$.post('/addMinter', {
		address: bankAddress2,
		account: nowAccount,
		to: addminter_TO.val(),
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
})

async function lots(){
	
}


$('#many').on('click', async function() {
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
	console.log('aaa');
	/*
	$.ajax({
		url:'http://localhost:3000/manymoney',
		method:'POST',
		data:{address:bankAddress,
			account:nowAccount,
			to: "0xa19B77E119FfCFF586d7865Fd0D3a385114fEE40",
			value: 20
		},
		success:function(res){
			console.log(res)
		}
	})
	*/

	$.post('/manymoney', {
		address:bankAddress,
		account:nowAccount,
		to: "0xa19B77E119FfCFF586d7865Fd0D3a385114fEE40",
		value: 20,
	}, function (result) {
		if (result.events !== undefined) {

			// 觸發更新帳戶資料
			update.trigger('click')

			// 更新介面 
			doneTransactionStatus()
		}
		else {
			log(result)
			// 更新介面 
			doneTransactionStatus()
		}
		
	})
	
	/*
	//轉移ERC721
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
	*/
})

/** 
// 購買Coin
buyCoinButton.on('click', async function(){
	
	if (bankAddress == "") {
		return;
	}

	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return;
	}

	// 更新介面
	waitTransactionStatus()

	//購買Coin
	$.post('/buyCoin', {
		address: bankAddress,
		account: nowAccount,
		value: parseInt(buyCoin.val(), 10),
	}, function (result) {
		if (result.events !== undefined) {
			log(result.events.BuyCoinEvent.returnValues, '購買Coin成功')

			// 觸發更新帳戶資料
			update.trigger('click')

			// 更新介面 
			doneTransactionStatus()
		}
		else {
			log(result)
			// 更新介面 
			doneTransactionStatus()
		}
	})
})

// 轉移Coin
transferCoinButton.on('click', async function(){
	
	if (bankAddress == "") {
		return;
	}

	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return;
	}

	// 更新介面
	waitTransactionStatus()
	// 轉帳
	$.post('/transferCoin', {
		address: bankAddress,
		account: nowAccount,
		to: transferCoinTo.val(),
		value: parseInt(transferCoinValue.val(), 10)
	}, function (result) {
		if (result.events !== undefined) {
			log(result.events.TransferCoinEvent.returnValues, '轉移Coin成功')

			// 觸發更新帳戶資料
			update.trigger('click')

			// 更新介面 
			doneTransactionStatus()
		}
		else {
			log(result)
			// 更新介面 
			doneTransactionStatus()
		}
	})
})

// 轉移 Owner
transferOwnerButton.on('click', async function(){
	
	if (bankAddress == "") {
		return;
	}

	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return;
	}

	// 更新介面
	waitTransactionStatus()
	// 轉帳
	$.post('/transferOwner', {
        address: bankAddress,
        account: nowAccount,
        newOwner: transferOwner.val(),
    }, function (result) {
        if (result.events !== undefined) {

            // 觸發更新帳戶資料
            update.trigger('click');

            // 更新介面
            doneTransactionStatus()
        }
        else {
            log(result);
            // 更新介面
            doneTransactionStatus()
        }
    })
})

// 檢查 owner
getOwnerButton.on('click',async function(){
	if (bankAddress == "") {
		return;
	}

	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return;
	}

	// 更新介面
	waitTransactionStatus()
	// 轉帳
	$.get('/owner', {
        address: bankAddress,
        account: nowAccount,
        to: nowAccount,
    }, function (result) {
        if (result.events !== undefined) {

            // 觸發更新帳戶資料
            update.trigger('click');

            // 更新介面
            doneTransactionStatus()
        }
        else {
            log(result);
            // 更新介面
            doneTransactionStatus()
        }
    })
	
})

// 轉帳 ETH（進階功能）
transferButton.on('click', async function() {
	if (bankAddress == "") {
		return;
	}

	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return;
	}

	// 更新介面
	waitTransactionStatus()
	// 轉帳
	$.post('/transferTo', {
		address: bankAddress,
		account: nowAccount,
		to: transferTo.val(),
		value: parseInt(transferValue.val(), 10)
	}, function (result) {
		if (result.events !== undefined) {
			log(result.events.TransferEvent.returnValues, '轉帳 ETH（進階功能）成功')

			// 觸發更新帳戶資料
			update.trigger('click')

			// 更新介面 
			doneTransactionStatus()
		}
		else {
			log(result)
			// 更新介面 
			doneTransactionStatus()
		}
	})
})
*/

// 載入bank合約
function loadBank(address) {
	if (!(address === undefined || address === null || address === '')) {
		$.get('/contract', {
			address: address
		}, function (result) {
			if (result.bank != undefined) {
				bankAddress = address;

				contractAddress.text('合約位址:' + address)
				log(result.bank, '載入合約')

				update.trigger('click')
			}
			else {
				log(address, '載入失敗')
			}
		})
	}
}

// 新增ERC20合約
async function newBank() {

	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return;
	}

	// 更新介面
	waitTransactionStatus()

	$.post('/deploy', {
		account: nowAccount
	}, function (result) {
		if (result.contractAddress) {
			log(result, '部署合約')

			// 更新合約介面
			bankAddress = result.contractAddress
			contractAddress.text('合約位址:' + result.contractAddress)
			deployedContractAddressInput.val(result.contractAddress)

			update.trigger('click');

			// 更新介面
			doneTransactionStatus();
		}
	})
}
//新增ERC721合約
async function newBank2() {

	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return;
	}

	// 更新介面
	waitTransactionStatus()

	$.post('/deploy2', {
		account: nowAccount
	}, function (result) {
		if (result.contractAddress) {
			log(result, '部署合約')

			// 更新合約介面
			bankAddress2 = result.contractAddress
			contractAddress2.text('ERC721:' + result.contractAddress)
			//deployedContractAddressInput.val(result.contractAddress)

			update2.trigger('click');

			// 更新介面
			doneTransactionStatus();
		}
	})
}

function waitTransactionStatus() {
	$('#accountStatus').html('帳戶狀態 <b style="color: blue">(等待交易驗證中...)</b>')
}

function doneTransactionStatus() {
	$('#accountStatus').text('帳戶狀態')
}


async function unlockAccount() {
	let password = prompt("請輸入你的密碼", "");
	if (password == null) {
		return false;
	}
	else {
		return $.post('/unlock', {
			account: nowAccount,
			password: password
		})
			.then(function (result) {
				if (result == 'true') {
					return true;
				}
				else {
					alert("密碼錯誤")
					return false;
				}
			})
	}
}


var database;

window.onload = function () {
    database = firebase.database();
    
    if (localStorage.getItem('counter') == null) {
        localStorage.setItem('counter', "0");
    }

	document.getElementById('parent').innerHTML = "";
	refresh();


}

var counter;



function page() {
    location.href = "http://localhost:3000/input.html";
}


function build(input_name, input_src, input_money,key) {

    if (location.href != "http://localhost:3000/sales.html") {
        return
    }

    // alert(input_name);
    // alert(input_src);
	// alert(input_money);
	// alert(key);
	var key1 = key;

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
	item_img.height = "100";

    var div4 = document.createElement("div");
    div4.className = "card-body";

    var div5 = document.createElement("div");
    div5.className = "align-items-center text-center";
    var span = document.createElement("span");
    span.className = "text-left";

    // span.id = "price_unset";
    span.innerText = input_money;
    span.id = "p" + localStorage.getItem("counter");

    var button = document.createElement("button");
    button.className = "btn btn-sm btn-outline-secondary";
    button.innerText = "購買";
    button.id = "b" + localStorage.getItem("counter");
    button.onclick =  async function(){

		database.ref(key1).remove();
		


        localStorage.setItem("buy",this.id);
        let x = localStorage.getItem('buy').slice(1,);
		var p_c = "p"+x;
		var i_c = "i"+x;        
		var price = document.getElementById(p_c).innerText;
		var id = document.getElementById(i_c).innerText;
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
		
		$.ajax({
			url:'http://localhost:3000/manymoney',
			method:'POST',
			data:{address:bankAddress,
				account:nowAccount,
				to: "0x9b4807A06F991F2Df6b578Bf931c09cF131Ae828",
				value: parseInt(price),
			},
			success:function(res){
				console.log(res)
			}
		})
		update.trigger('click')
	
				// 更新介面 
		doneTransactionStatus()
		/*
		$.post('/manymoney', {
			address:bankAddress,
			account:nowAccount,
			to: "0x9b4807a06f991f2df6b578bf931c09cf131ae828",
			value: parseInt(price,10),
		}, function (result) {
			if (result.events !== undefined) {
	
				// 觸發更新帳戶資料
				update.trigger('click')
	
				// 更新介面 
				doneTransactionStatus()
			}
			else {
				log(result)
				// 更新介面 
				doneTransactionStatus()
			}
			
		})
	*/
		//轉移ERC721
		$.ajax({
			url:'http://localhost:3000/transferFrom',
			method:'POST',
			data:{address:bankAddress2,
				account:"0x9b4807a06f991f2df6b578bf931c09cf131ae828",
				to: nowAccount,
				value: id,
			},
			success:function(res){
				console.log(res)
			}
		})

		update2.trigger('click')
	
				// 更新介面 s
		doneTransactionStatus()
		/*
		$.post('/transferFrom', {
			address: bankAddress2,
			account: "0x9b4807a06f991f2df6b578bf931c09cf131ae828",
			to: nowAccount,
			value: parseInt(20, 10),
		}, function (result) {
			if (result.events !== undefined) {
	
				// 觸發更新帳戶資料
				update2.trigger('click')
	
				// 更新介面 s
				doneTransactionStatus()
			}
			else {
				log(result)
				// 更新介面 
				doneTransactionStatus()
			}
		})
		
		*/
		document.getElementById('parent').innerHTML = "";
		refresh();
		

	}
    var counterInt = parseInt(localStorage.getItem("counter"), 10);
    counterInt = counterInt + 1;
    localStorage.setItem("counter", counterInt);

    div5.appendChild(span);
    div5.appendChild(button);

    div4.appendChild(div5);

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

/** 
let x = document.getElementById('input');
x.addEventListener('click', function () {
    addElementDiv();
})
*/


function addElementDiv() {


    var input_name = document.getElementById("input_name").value;
    var input_src = document.getElementById("input_src").value;
    var input_money = document.getElementById("input_money").value;

	writeUserData(input_name, input_src, input_money);
    document.getElementById('parent').innerHTML = "";
	

	refresh();
	
	


    document.getElementById("input_name").value = "";
    document.getElementById("input_src").value = "";
    document.getElementById("input_money").value = "";


}

// function refresh (){
// 	var leadsRef = database.ref();
	
//     leadsRef.on('value', function (snapshot) {
//         snapshot.forEach(function (childSnapshot) {

// 			var childData = childSnapshot.val();
// 			var x = String(childSnapshot.val());
// 			// alert("childsnapshot"+String(childSnapshot));
// 			// alert("x:"+x);
//             var output_name = childData.name;
//             var output_src = childData.src;
// 			var output_money = childData.money;

			


//             build(output_name, output_src, output_money);
//         });
//     });

// }

function refresh (){
	var leadsRef = database.ref();
	
    leadsRef.on('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {

			var childData = childSnapshot.val();
			var x = String(childSnapshot.val());
			// alert("childsnapshot"+String(childSnapshot));
			// alert("x:"+x);
			var key = childSnapshot.key;
            var output_name = childData.name;
            var output_src = childData.src;
			var output_money = childData.money;

			


            build(output_name, output_src, output_money,key);
        });
    });

}