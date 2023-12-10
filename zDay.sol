// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {ERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@1inch/farming/contracts/ERC20Plugins.sol";
//account 1 - 0x182a251472D59e0E2942552382b395e99E87AA67
//account 2 - 0x9E9725400681C01e1C1e5678020b3d54D568d842

contract zDay {
    uint dec = 10**18;
    uint256 public temp;
    address public owner;
    address private pool ;
    AggregatorV3Interface internal priceFeed;
    uint public bal;
    IERC20 _token;
    enum Side { LONG, SHORT }

    struct Position {
        Side side;
        uint256 collateral;
        uint256 size;
        uint256 entryPrice;
        uint256 openTime;
        uint256 maxLoss;
    }
    int256 currentP;
    // uint256 dec;
    mapping(address => Position) public positions;
    address[] public allUsers;
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    event PositionOpened(
        address indexed user,
        Side side,
        uint256 collateral,
        uint256 size,
        uint256 entryPrice,
        uint256 openTime,
        uint256 maxLoss
    );

    event PositionClosed(
        address indexed user,
        uint256 exitPrice,
        int256 profitOrLoss
    );

    //0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e - ETH/USD on goerli
    constructor(IERC20 token, address _pool) {
        owner = msg.sender;
        pool = _pool;
        // priceFeed = AggregatorV3Interface(_priceFeedAddress);
        _token = token;
    }

    //leverage = (side*entry_price)/(collateral - loss)
    function openPosition(Side _side, uint256 _collateral, uint256 _size, uint256 _maxLoss) external {
        require(_side == Side.LONG || _side == Side.SHORT, "Invalid side");
        require(positions[msg.sender].collateral == 0, "Close existing position before opening a new one");

        // Fetch the latest price from the price feed
        // (,int256 currentPrice,,,) = priceFeed.latestRoundData();
        // uint256 entryPrice = uint256(currentPrice)/uint(priceFeed.decimals());
        uint entryPrice = 10;
        bal = _token.balanceOf(msg.sender);
        _token.transferFrom(msg.sender, pool, _collateral*dec); //deposit collateral in the pool from msg.sender

        positions[msg.sender] = Position(_side, _collateral*dec, _size, entryPrice, block.timestamp, _maxLoss*dec);
        allUsers.push(msg.sender);

        emit PositionOpened(msg.sender, _side, _collateral, _size, entryPrice, block.timestamp,_maxLoss);
    }

    function closePosition(address _add) public {
        require(positions[_add].collateral > 0, "No open position to close");

        // Fetch the latest price from the price feed
        // (,int256 currentPrice,,,) = priceFeed.latestRoundData();
        // uint256 exitPrice = uint256(currentPrice)/uint(priceFeed.decimals());
        uint exitPrice = 20;

        int256 profitOrLoss = calculateProfitOrLoss(positions[_add], exitPrice);
        //If loss - do nothing - just deleting the position is fine.
        
        //If profit, transfer to msg.sender from pool (if pool has that much liquidity, then only it will pass)
        // _token.approve(0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8, profitOrLoss);
        if(profitOrLoss > 0) {    
            _token.transferFrom(pool, _add, uint256(profitOrLoss)*dec + positions[_add].collateral);
        }
        delete positions[_add]; 
        emit PositionClosed(_add, exitPrice, profitOrLoss);
    }

    function calculateProfitOrLoss(Position memory _position, uint256 _exitPrice) internal pure returns (int256) {
        if (_position.side == Side.LONG) {
            // if((_exitPrice - _position.entryPrice) * _position.size > 0) return (_exitPrice - _position.entryPrice) * _position.size;
            // else return 0;
            return (int256(_exitPrice) - int256(_position.entryPrice)) * int256(_position.size);
        } else {
            // if((_position.entryPrice - _exitPrice) * _position.size > 0) return (_position.entryPrice - _exitPrice) * _position.size;
            // else return 0;
            return (int256(_position.entryPrice) - int256(_exitPrice)) * int256(_position.size);
        }
    }

    function contractOwnerApproval(address _add, uint _val) public {
        _token.approve(_add, _val);
    }

    // function getCurrentPrice() public {
    //     (,currentP,,,) = priceFeed.latestRoundData();
    // }
    // function getDec() public {
    //     dec = priceFeed.decimals();
    // }
    function getBalance(address _add) public{
        temp = _token.balanceOf(_add);
    }

    //Logically, it should be called every second
    function autoClose() public {
        //function to check if any open position has to be closed
        for(uint i = 0; i < allUsers.length; i++) {
            if(positions[allUsers[i]].collateral != 0) {
                uint256 currTime = block.timestamp;
                if(currTime - positions[allUsers[i]].openTime > 110) {
                    closePosition(allUsers[i]);
                    continue;
                }
                //second case of closing the position:
                // Fetch the latest price from the price feed
                // (,int256 currentPrice,,,) = priceFeed.latestRoundData();
                // uint256 exitPrice = uint256(currentPrice)/uint(priceFeed.decimals());
                uint exitPrice = 20;

                int256 profitOrLoss = calculateProfitOrLoss(positions[allUsers[i]], exitPrice);
                uint256 loss;
                if(profitOrLoss < 0) {
                    loss = uint256(profitOrLoss); //will give the absolute value of loss
                }
                else continue;
                if(loss > positions[allUsers[i]].maxLoss) closePosition(allUsers[i]);
            }
        }
    }


    function changeSize(uint256 _newSize) public {
        positions[msg.sender].size = _newSize;
    }

    function changeColl(uint256 _newColl) public {
        positions[msg.sender].collateral = _newColl;
    }

    function currPrice() public view returns(uint256){
        // Fetch the latest price from the price feed
        (,int256 currentPrice,,,) = priceFeed.latestRoundData();
        uint256 entryPrice = uint256(currentPrice)/uint(priceFeed.decimals());
        return entryPrice;
    }

    function getPos(address _add) public view returns(Position memory){
        return positions[_add];
    }
}

//100000000000000000000
//5000000000000000000000