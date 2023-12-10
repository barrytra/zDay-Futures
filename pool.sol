// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {IERC20, IERC20Metadata, ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Pool is ERC4626 {

    ERC20 _asset;
    address perp;
    address owner;
    uint dec = 10**18;
    constructor(ERC20 asset) ERC4626(asset) ERC20("zDAY", "zDAY") {
        _asset = asset;
        perp = msg.sender;
        asset.approve(msg.sender, type(uint256).max);
        owner = msg.sender;
    }

    modifier onlyOwner {
      require(msg.sender == owner);
      _;
   }
    function deposit(uint256 assets, address receiver) public override(ERC4626) returns (uint256) {
        uint256 shares = super.deposit(assets*dec, receiver);
        return shares;
    }

    function withdraw(uint256 assets, address receiver,address _owner) public override(ERC4626) returns (uint256) {
        uint256 shares = super.withdraw(assets, receiver, _owner);
        return shares;
    }

    //_add - spender contract
    function contractOwnerApproval(address _add, uint _val) public onlyOwner{
        _asset.approve(_add, _val); //for approve function, msg.sender will be this contract. Thus owner = pool contract
    }
    
}