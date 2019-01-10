pragma solidity ^0.4.24;

import "./ERC721.sol";
import "./Ownable.sol";

contract GradientToken is ERC721, Ownable {
    string public constant name = "GradientToken";
    string public constant symbol = "GRAD";
}