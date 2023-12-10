# ZeroDay Futures
## Try it out
https://ethIndia-2023-theta.vercel.app/
### note: View the upkeep that was used in demo here!!
https://automation.chain.link/
## Inspiration
Zero day futures onboards next billion web2 users into web3 trading. Open your position, stake the collateral on prices of crypto, and automatically close the position after inputted time.
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
Through this hackathon, we were able to learn about various functionalities that chainlink/1inch/graph and other sponsor provides and how to integrate them with our dapp. 
## What's next for dVest
1) To integrate other crypto coins so that user can bet on them as well.
2) Improving the UI/UX.
3) To be able to open the position for n-days.

