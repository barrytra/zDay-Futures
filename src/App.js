import React from 'react'
import { Route, Routes } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SupplyPage from './pages/SupplyPage';
import StakePage from "./pages/StakePage"
import Dashboard from './pages/Dashboard';
import {
  connectorsForWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { injectedWallet } from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { baseGoerli, base, sepolia } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import "@rainbow-me/rainbowkit/styles.css";
import { SCWallet } from './context/SCWallet';

const App = () => {

  const { chains, publicClient } = configureChains(
    [baseGoerli, base, sepolia],
    [
      alchemyProvider({ apiKey: "6LS_1W2VpXvWhpiVcsuCQlLxU64COp3R"}),
      publicProvider(),
    ]
  );

  const connectors = connectorsForWallets([
    {
      groupName: "Paymaster Nft Example",
      wallets: [injectedWallet({ chains })],
    },
  ]);

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  });
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <SCWallet>
          <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
            <div className='flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5'>
              <Navbar />

              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/stake" element={<StakePage />} />
                <Route path="/supply" element={<SupplyPage />} />
                <Route path="/dashboard" element={<Dashboard />} />

              </Routes>
            </div>
          </div>
        </SCWallet>
      </RainbowKitProvider>
    </WagmiConfig >
  )
}

export default App