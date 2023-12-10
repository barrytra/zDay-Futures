import React, { useState } from 'react'
import FormField from '../components/FormField';
import { ethers } from 'ethers';
import poolABI from "../abis/poolABI.json";
import { useStateContext } from '../context/Index'

const SupplyPage = () => {

    const [inputs, setInputs] = useState({});
    const {account} = useStateContext();
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }
    const poolContract = "0x733490a1DD3F77c78B1dB04De0339Dd1bF7659d4";
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(inputs);

        //inputs.amount
        const { ethereum } = window;
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(poolContract, poolABI, signer);
            console.log(inputs.liquidity, account)
            contract.deposit(inputs.liquidity, account);
        }
    }
    return (
        <div>
            <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
                <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Supply custom Token to Liquidity Pool</h1>
            </div>

            <form className='w-full mt-[65px] flex flex-col gap-[30px]'>

                <FormField
                    labelName="custom token Amount"
                    name="liquidity"
                    placeHolder="in custom token amount"
                    inputType="number"
                    value={inputs.liquidity}
                    handleChange={handleChange}
                />
                {/* <label className="flex-1 w-full flex flex-col">
                  
                      <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">Collateral Amount</span>
                  

                  <input
                      required
                      value={inputs.collateral}
                      onChange={handleChange}
                      type=" number"
                      name = "CollateralAmount"
                      step="0.1"
                      placeholder={PlaceHolder}
                      className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
                  />

              </label> */}

                {/* <FormField

                    labelName="ETH amount you want to stake"
                    name="ethAmount"
                    placeHolder="ETH 0.50"
                    inputType="number"
                    value={inputs.coins}
                    handleChange={handleChange}
                /> */}

                


                <input
                    type="submit"
                    className={"font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] bg-[#1dc071] cursor-pointer"}
                    value="Stake It!"
                    onClick={handleSubmit}
                />

            </form>
        </div>
    )
}

export default SupplyPage