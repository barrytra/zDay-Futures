
# ZeroDay Futures

## Video demo

[https://www.loom.com/share/9756111ea0a84ea785a8514b8eadfcf7?sid=928c23af-7cbb-4dc4-80f4-f7434e4ea849
](https://www.loom.com/share/70a023c0110b4b1e9383c235023741cd?sid=01d5507f-3a59-4237-bd75-87fe3918cce6)
### note: View the upkeep that was used in demo here!!

[https://automation.chain.link/](https://automation.chain.link/sepolia/104093928704513661847477192572665966499636443713836890387208199861082530380236)

## Inspiration
Zero day futures onboards next billion web2 traders into web3 trading. Open your position, stake the collateral on prices of crypto, and position gets automatically closed after 24 hours. It is as simple as that.

## What it does

1) Zero day futures trading platform helps to instantly and automatically close all the open positions of trades.

2) Unlike perpetuals, where users can hold their position for any amount of time(which leads to locking of assets in pools), our platform close all the positions after 24hrs.

3) User can also close his position manually anytime before 24hrs.

4) Liquidity providers earn zDay tokens on providing liquidity which can be used in yield farming through 1inch.

5) Real time price feeds are used to fetch the price of crypto like ETH using Chainlink.

6) Users can also specify when to liquidate their position once their position reaches certain loss.

7) Account Abstraction is used to solve the problem of UX in web3.

## Flow of the dapp

https://github.com/barrytra/zDay-Futures/blob/main/diagg.jpg

Token.sol - USDc(ERC20) tokens that are present in the pool.

Pool.sol - Contract where liquidity providers can deposit their USDc into pool.

zDay.sol - Main contract logic which opens the position, close the position, increase collateral, increase size.


## Sponsers

### ChainLink
With the help of chainlink we fetched price feeds of ETH.
We also used chainlink automation to automatically close the position after 24 hours or if the future gets liquidated.
### The Graph
We used The graph to index data of futures and display them on dashboard. we deployed a new subgraph that indexes data from the zDay smart contract to query the data using public query URL from subgraph studio dashboard.

Link to the subgraph repository - https://github.com/barrytra/zday-subgraph
### Polygon - zkEVM DeFi
We created our own tokens and pool and for that we used openzeppelin library to integrate ERC20 and ERC4626.
We deployed our contracts on polygon zkEVM though we couldn't show that in the demo video as it was no supported with The Graph. 

Here is the addresses of contracts deployed on zkEVM :

contract address of token.sol - 0xeD0116c634C982D1214456E0e3371888d8418702

contract address of pool.sol - 0xe0Cc91E84684A67Bf6fa395D836D1f6d64f0Cc1B

contract address of zDay.sol - 0x2d9c5920F84D61BF106DD9D6Ea841588b24c72d1
  

## How we built it

Fronted was built using Reactjs. Smart contracts were written in solidity. Chainlink helps us to use price feeds to fetch prices of ETH and use automation tool to automatically close the position after 24 hrs. Graph helps us to deploy a new subgraph and retrieve data from it.

## Contracts structure

https://github.com/barrytra/zDay-Futures/blob/main/diagg.jpg

  
## Challenges we ran into

Had to explore and learn how to automatically call the functions in solidity, without using user intervention. Chainlink automation tool helped in achieving that.

Learning about ERC- 4626 since we created a liquidity pool, which gives liquidity provider's zDay tokens in return of their stake.

Continous building proved to be tiring but somehow managed to pull the project to its completion.

Learnt how to use subgraphs in our dapp.

Learnt about 1inch, yield farming.

## Accomplishments that we're proud of

We were able to make our dapp running with all the main features. Users can now be saved from daily inflation rate and can protect their money.

## What we learned

Through this hackathon, we were able to learn about various functionalities that chainlink/graph provide and deploy on L2s using polygon zkEVM 

## What's next for zDay

1) To integrate other crypto coins so that user can bet on them as well.

2) Improving the UI/UX.

3) To be able to open the position for n-days.




