// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    uint dec = 10**18;
    constructor() ERC20("USDc", "USDc") {
        _mint(msg.sender, 1000000*dec);
    }
    //5000000000000000000000
}