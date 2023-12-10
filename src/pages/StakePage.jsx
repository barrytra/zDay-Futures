import React, { useState } from 'react'
import FormField from '../components/FormField';
import { useStateContext } from '../context/Index'
import { ethers } from 'ethers';
import zDayABI from "../abis/zDayABI.json";
const SupplyPage = () => {

    const [inputs, setInputs] = useState({});
    const { account } = useStateContext();
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }
    const zDayContract = "0xA9E2fa7dF8cd8f9Eb9437D7bb2840DB62FA31083";
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(inputs);
        const { ethereum } = window;
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(zDayContract, zDayABI, signer);
            // openPosition(Side _side, uint256 _collateral, uint256 _size, uint256 _maxLoss)
            console.log(inputs);
            console.log(inputs.side, inputs.collateral, inputs.size, inputs.maxLoss);
            contract.openPosition(inputs.side, inputs.collateral, inputs.size, inputs.maxLoss);

        }
    }
    
    return (
        <div>
            <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
                <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">What's your Stake</h1>
            </div>

            <form className='w-full mt-[65px] flex flex-col gap-[30px]'>

                <FormField
                    labelName="Collateral Amount"
                    name="collateral"
                    placeHolder="in custom token amount"
                    inputType="number"
                    value={inputs.collateral}
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

                <FormField

                    labelName="ETH amount you want to stake"
                    name="size"
                    placeHolder="ETH 0.50"
                    inputType="number"
                    value={inputs.size}
                    handleChange={handleChange}
                />

                <FormField

                    labelName="Maximum leverage (Future will be auto liquidated if leverage crosses this mark)"
                    name="maxLoss"
                    placeHolder="20"
                    inputType="number"
                    value={inputs.maxLoss}
                    handleChange={handleChange}
                />

                <div>
                    <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[5px]">Prediction</span>

                    <div className='flex flex-wrap gap-[10px]'>
                        <label>

                            <input
                                name='side'
                                value="1"
                                //   checked={this.state.selectedOption === 'option1'}
                                onChange={handleChange}
                                type='radio'

                            />
                            <span className="font-epilogue font-medium px-[15px] text-[14px] leading-[10px] text-white mb-[10px]">short
                            </span>
                        </label>

                        <label>

                            <input
                                name="side"
                                value="0"
                                onChange={handleChange}
                                type='radio'
                            />
                            <span className="font-epilogue font-medium px-[15px] text-[14px] leading-[10px] text-white mb-[10px]">long
                            </span>
                        </label>
                    </div>
                </div>


                <input
                    type="submit"
                    className={"font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] bg-[#1dc071] cursor-pointer"}
                    value ="Stake It!"
                    onClick={handleSubmit}
                />

            </form>
        </div>
    )
}

export default SupplyPage