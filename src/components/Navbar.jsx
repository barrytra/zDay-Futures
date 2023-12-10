import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import CustomButton from './CustomButton';
import Dashboard from '../pages/Dashboard';
import {ethers} from "ethers";
import tokenABI from "../abis/tokenABI.json";
import poolABI from "../abis/poolABI.json";
import zDayABI from "../abis/zDayABI.json";
import { useStateContext } from '../context/Index';
const Navbar = () => {
    const navigate = useNavigate();
    const [isActive, setIsActive] = useState('');
    const [currentAccount, setCurrentAccount] = useState("");
    const {account, connect } = useStateContext();
    


    return (
        <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] px-5 gap-10 bg-[#1c1c24] rounded-[20px]">
            <div className="lg:flex-1 flex flex-row max-w-[458px] pl-4 pr-2 h-[40px] gap-3 mt-2">
                {/* <input type="text" placeholder="Search for campaigns" className="flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none" />

              <div className="w-[72px] h-full rounded-[20px] bg-[#4acd8d] flex justify-center items-center cursor-pointer">
                  <img src={search} alt="search" className="w-[15px] h-[15px] object-contain" />
              </div> */}
                {/* <div className='font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px]'>
            Dashboard
              </div> */}
                <button
                    type="button"
                    className={`font-epilogue font-normal text-[16px] leading-[20px] text-white min-h-[40px] px-4 rounded-[10px] hover:text-[#b676d2] ${isActive && isActive === 'dashboard' && 'bg-[#2c2f32]'}`}
                    onClick={() => { navigate('dashboard'); setIsActive('dashboard'); }}
                >
                    Dashboard
                </button>
                <button
                    type="button"
                    className={`font-epilogue font-normal text-[16px] leading-[20px] text-white min-h-[40px] px-4 rounded-[10px] hover:text-[#b676d2] ${isActive && isActive === 'stake' && 'bg-[#2c2f32]'}`}
                    onClick={() => { navigate('stake'); setIsActive('stake'); }}

                >
                    Stake
                </button>
                <button
                    type="button"
                    className={`font-epilogue font-normal text-[16px] leading-[20px] text-white min-h-[40px] px-4 rounded-[10px] hover:text-[#b676d2] ${isActive && isActive === 'supply' && 'bg-[#2c2f32]'} `}
                    onClick={() => { navigate('supply'); setIsActive('supply'); }}

                >
                    Supply
                </button>

            </div>

            <div className="sm:flex hidden flex-row justify-end gap-4">
                {/* <button
                    type='button'
                    className={"font-epilogue font-bold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] hover:text-[#1dc071] "}
                  onClick={connect}
                >
                    Connect Wallet 
                    {account === "" ? "Connect Wallet" : <h3>{account}</h3>}
                </button> */}
                <div className="flex flex-row gap-6 p-4 text-white">
                    <ConnectButton />
                </div>




                {/* <Link to="/profile">
                  <div className="w-[52px] h-[52px] rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer">
                      <img src={thirdweb} alt="user" className="w-[60%] h-[60%] object-contain" />
                  </div>
              </Link> */}
            </div>
        </div>
    )
}

export default Navbar