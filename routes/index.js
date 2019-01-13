var express = require('express');
var router = express.Router();

const path = require('path');
const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

const IERC20_path = path.resolve('github', '../public/contract/token/ERC20', 'IERC20.sol');
const SafeMath_path = path.resolve('github', '../public/contract/token/ERC20', 'SafeMath.sol');
const ERC20_path = path.resolve('github', '../public/contract/token/ERC20', 'ERC20.sol');
const ERC20Detailed_path = path.resolve('github', '../public/contract/token/ERC20', 'ERC20Detailed.sol');
const Mytoken_path = path.resolve('github', '../public/contract/token/ERC20', 'Mytoken.sol');

var input = {
  'IERC20.sol': fs.readFileSync(IERC20_path, 'utf8'),
  'SafeMath.sol': fs.readFileSync(SafeMath_path, 'utf8'),
  'ERC20.sol': fs.readFileSync(ERC20_path, 'utf8'),
  'ERC20Detailed.sol': fs.readFileSync(ERC20Detailed_path, 'utf8'),
  'Mytoken.sol': fs.readFileSync(Mytoken_path, 'utf8')
};

let compiledContract = solc.compile({
  sources: input
}, 1);
let abi = compiledContract.contracts['Mytoken.sol:Mytoken'].interface;
console.log(abi);
let bytecode = '0x' + compiledContract.contracts['Mytoken.sol:Mytoken'].bytecode;
console.log(bytecode);
let gasEstimate = web3.eth.estimateGas({
  data: bytecode
});


const contract = require('../public/contract/token/ERC20/Mytokenfull.json');

/* GET home page. */
router.get('/', async function (req, res, next) {
  res.render('index')
});

//get accounts
router.get('/accounts', async function (req, res, next) {
  let accounts = await web3.eth.getAccounts()
  res.send(accounts)
});

//login
router.get('/balance', async function (req, res, next) {
  let ethBalance = await web3.eth.getBalance(req.query.account)
  res.send({
    ethBalance: ethBalance
  })
});

//balance
router.get('/allBalance', async function (req, res, next) {
  let bank = new web3.eth.Contract(contract.abi);
  bank.options.address = req.query.address;
  let ethBalance = await web3.eth.getBalance(req.query.account)
  let bankBalance = await bank.methods.balanceOf().call({
    from: req.query.account
  })
  let coinBalance = await bank.methods.getCoinBalance().call({
    from: req.query.account
  })
  res.send({
    ethBalance: ethBalance,
    bankBalance: bankBalance,
    coinBalance: coinBalance,
  })
});

//contract
router.get('/contract', function (req, res, next) {
  let bank = new web3.eth.Contract(contract.abi);
  bank.options.address = req.query.address;
  res.send({
    bank: bank
  })
});

//unlock account
router.post('/unlock', function (req, res, next) {
  web3.eth.personal.unlockAccount(req.body.account, req.body.password, 60)
    .then(function (result) {
      res.send('true')
    })
    .catch(function (err) {
      res.send('false')
    })
});

//deploy bank contract
router.post('/deploy', function (req, res, next) {
  let bank = new web3.eth.Contract(contract.abi);
  bank.deploy({
      data: contract.bytecode
    })
    .send({
      from: req.body.account,
      gas: 3400000
    })
    .on('receipt', function (receipt) {
      res.send(receipt);
    })
    .on('error', function (error) {
      res.send(error.toString());
    })
});

//deposit ether
router.post('/deposit', function (req, res, next) {
  let bank = new web3.eth.Contract(contract.abi);
  bank.options.address = req.body.address;
  bank.methods.deposit().send({
      from: req.body.account,
      gas: 3400000,
      value: web3.utils.toWei(req.body.value, 'ether')
    })
    .on('receipt', function (receipt) {
      res.send(receipt);
    })
    .on('error', function (error) {
      res.send(error.toString());
    })
});

//withdraw ether
router.post('/withdraw', function (req, res, next) {
  let bank = new web3.eth.Contract(contract.abi);
  bank.options.address = req.body.address;
  bank.methods.withdraw(req.body.value).send({
      from: req.body.account,
      gas: 3400000
    })
    .on('receipt', function (receipt) {
      res.send(receipt);
    })
    .on('error', function (error) {
      res.send(error.toString());
    })
});

//transfer ether
router.post('/transfer', function (req, res, next) {
  let bank = abi;
  bank.options.address = req.body.address;
  bank.methods.transfer(req.body.to, req.body.value).send({
      from: req.body.account,
      gas: 3400000
    })
    .on('receipt', function (receipt) {
      res.send(receipt);
    })
    .on('error', function (error) {
      res.send(error.toString());
    })
});

//kill contract
router.post('/kill', function (req, res, next) {
  let bank = new web3.eth.Contract(contract.abi);
  bank.options.address = req.body.address;
  bank.methods.kill().send({
      from: req.body.account,
      gas: 3400000
    })
    .on('receipt', function (receipt) {
      res.send(receipt);
    })
    .on('error', function (error) {
      res.send(error.toString());
    })
});

//owner
router.get('/owner', async function (req, res, next) {
  // TODO
  // ...
  let bank = new web3.eth.Contract(contract.abi);
  bank.options.address = req.query.address;
  bank.methods.getOwner().call({
      from: req.query.account
    })
    .then((result) => res.send(result))
    .catch((err) => res.send(err.toString()));
});

//mint Coin
router.post('/mintCoin', function (req, res, next) {
  // TODO
  // ...
  let bank = new web3.eth.Contract(contract.abi);
  bank.options.address = req.body.address;
  bank.methods.mint(req.body.value).send({
      from: req.body.account,
      gas: 3400000
    })
    .on('receipt', function (receipt) {
      res.send(receipt);
    })
    .on('error', function (error) {
      res.send(error.toString());
    })
});

//buy Coin
router.post('/buyCoin', function (req, res, next) {
  // TODO
  // ...
  let bank = new web3.eth.Contract(contract.abi);
  bank.options.address = req.body.address;
  bank.methods.buy(req.body.value).send({
      from: req.body.account,
      gas: 3400000
    })
    .on('receipt', function (receipt) {
      res.send(receipt);
    })
    .on('error', function (error) {
      res.send(error.toString());
    })
});

//transfer Coin
router.post('/transferCoin', function (req, res, next) {
  // TODO
  // ...
  let bank = new web3.eth.Contract(contract.abi);
  bank.options.address = req.body.address;
  bank.methods.transferCoin(req.body.to, req.body.value).send({
      from: req.body.account,
      gas: 3400000
    })
    .on('receipt', function (receipt) {
      res.send(receipt);
    })
    .on('error', function (error) {
      res.send(error.toString());
    })
});

//transfer Owner
router.post('/transferOwner', function (req, res, next) {
  // TODO
  // ...
  let bank = new web3.eth.Contract(contract.abi);
  bank.options.address = req.body.address;
  bank.methods.transferOwner(req.body.newOwner).send({
      from: req.body.account,
      gas: 3400000
    })
    .on("receipt", function (receipt) {
      res.send(receipt);
    })
    .on("error", function (error) {
      res.send(error.toString());
    })
});

//transfer ether to other address
router.post('/transferTo', async function (req, res, next) {
  // TODO
  // ...
  /*
  let result = web3.eth.estimateGas({
    from: req.body.account,
    to: req.body.to,
    value: req.body.value,
  });
  */
  var gas = await web3.eth.estimateGas({
    from: req.body.account,
    to: req.body.to,
    value: req.body.value,
  })
  console.log(gas.toString());


  var transferAmount = await web3.utils.toWei(req.body.value, 'ether');
  console.log(typeof (transferAmount));
  console.log(transferAmount);

  web3.eth.getGasPrice().then(gasPrice => {
    console.log('gasPrice = ' + gasPrice);

    var x = gas * gasPrice;
    console.log(x);
    var real = transferAmount - x;
    console.log(real)

    web3.eth.sendTransaction({
        from: req.body.account,
        to: req.body.to,
        value: real,
      })
      .on("receipt", function (receipt) {
        res.send(receipt);
      })
      .on("error", function (error) {
        res.send(error.toString());
      })

  });



  /*
  var total = web3.utils.toWei(gas * gasPrice,'ether');
  var real = web3.utils.toBN(transferAmount - total);
   //var real = req.body.value - result;
  web3.eth.sendTransaction({
    from: req.body.account,
    to: req.body.to,
    value: real,
  })
  .on("receipt", function(receipt) {
    res.send(receipt);
  })
  .on("error", function(error) {
    res.send(error.toString());
  })
  */
});

module.exports = router;