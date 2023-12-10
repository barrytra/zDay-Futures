import React from 'react'
import { useNavigate } from 'react-router-dom';
import { loader } from '../assets/Index';
import FutureCard from './FutureCard';
const DisplayFutures = ({ isLoading, futures }) => {
    const navigate = useNavigate();


    const handleNavigate = (future) => {
        navigate(`/campaign-details/${future.id}`, { state: future })
    }
    return (
        <div>

            <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">Your Futures ({futures.length})</h1>

            <div className="flex flex-wrap mt-[20px] gap-[26px]">
                {isLoading && (
                    <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
                )}

                {!isLoading && futures.length === 0 && (
                    <>
                        <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
                            You do not have any future yet
                        </p>
                        <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
                            Create a future now:
                        </p>
                        <button
                            type="button"
                            className={`font-epilogue font-normal text-[16px] leading-[20px] text-white min-h-[40px] px-4 rounded-[10px] hover:text-[#b676d2]`}
                            onClick={() => { navigate('stake'); }}

                        >
                            Stake
                        </button>
                    </>
                )}

                {!isLoading && futures.length > 0 && futures.map((future) => <FutureCard
                    {...future}
                    handleClick={() => handleNavigate(future)}
                />)}
            </div>

        </div>
    )
}

export default DisplayFutures