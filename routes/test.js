const path = require('path');
const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

const IERC20_path = path.resolve('../public/contract/token/ERC20','IERC20.sol');
const SafeMath_path = path.resolve('../public/contract/token/ERC20','SafeMath.sol');
const ERC20_path = path.resolve('../public/contract/token/ERC20','ERC20.sol');
const ERC20Detailed_path = path.resolve('../public/contract/token/ERC20','ERC20Detailed.sol');
const Mytoken_path = path.resolve('../public/contract/token/ERC20','Mytoken.sol');

var input = {
  'IERC20.sol': fs.readFileSync(IERC20_path, 'utf8'),
  'SafeMath.sol': fs.readFileSync(SafeMath_path, 'utf8'),
  'ERC20.sol': fs.readFileSync(ERC20_path, 'utf8'),
  'ERC20Detailed.sol': fs.readFileSync(ERC20Detailed_path, 'utf8'),
  'Mytoken.sol': fs.readFileSync(Mytoken_path, 'utf8')
};

let compiledContract = solc.compile({sources: input}, 1);

let abi = compiledContract.contracts['Mytoken.sol:Mytoken'].interface;
console.log(abi);
let bytecode = '0x'+compiledContract.contracts['Mytoken.sol:Mytoken'].bytecode;
console.log(bytecode);
//let gasEstimate = web3.eth.estimateGas({data: bytecode});