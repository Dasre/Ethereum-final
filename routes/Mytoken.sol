pragma solidity ^0.4.24;

import "./ERC20.sol";
import "./ERC20Detailed.sol";

/**
 * @title SimpleToken
 * @dev Very simple ERC20 Token example, where all tokens are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `ERC20` functions.
 */
contract Mytoken is ERC20, ERC20Detailed {
    constructor(
    string _name,
    string _symbol,
    uint8 _decimals,
    uint256 _amount
  )ERC20Detailed(_name, _symbol, _decimals)public
  {
    require(_amount > 0, "amount has to be greater than 0");
    totalSupply_ = _amount.mul(10 ** uint256(_decimals));
    balances[msg.sender] = totalSupply_;
    emit Transfer(address(0), msg.sender, totalSupply_);
  }
}