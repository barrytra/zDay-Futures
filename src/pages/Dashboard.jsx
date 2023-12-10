import React, { useState, useEffect } from 'react'
import DisplayFutures from '../components/DisplayFutures'
import CountBox from '../components/Countbox';
import { ethers } from "ethers";
import zDayABI from "../abis/zDayABI.json";
import { useStateContext } from '../context/Index';
import moment from "moment";
import { useNavigate } from 'react-router-dom';
// import { createClient } from "urql";
import { createClient, cacheExchange, fetchExchange } from '@urql/core'

const APIURL = "https://api.studio.thegraph.com/query/60488/zday_ethindia/0.1"

const query = `
  query {
    positionOpeneds(first: 5) {
    id
    user
    side
    collateral
    entryPrice
    openTime
    maxLoss
    size
  }
  }
`

const client = createClient({
  url: APIURL,
  exchanges: [cacheExchange, fetchExchange],
})

const Dashboard = () => {

  const navigate  = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [futures, setFutures] = useState([]);
  const zDayContract = "0xA9E2fa7dF8cd8f9Eb9437D7bb2840DB62FA31083";
  const { account } = useStateContext();
  //   const closePos = (e) => {
  //     e.preventDefault();
  //     const { ethereum } = window;
  //     if (ethereum) {
  //         const provider = new ethers.providers.Web3Provider(ethereum);
  //         const signer = provider.getSigner();
  //         const contract = new ethers.Contract(zDayContract, zDayABI, signer);
  //         contract.closePosition(account);
  //     }
  // }

  // graph query
  useEffect(() => {
    fetchData()
  }, [])
  async function fetchData() {
    const response = await client.query(query).toPromise();
    console.log('response:', response)
    // setTokens(response.data.tokens);
    const temp = response.data.positionOpeneds;
    console.log(temp)

    let obj;

    for (let i = 0; i < temp.length; i++) {
      if (temp[i].user === account) {
        // console.log(temp[i].user, account)
        obj = temp[i];
        break;
      }
    }


    console.log("obj", obj.side);
  }

  const getFuture = async (e) => {

    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(zDayContract, zDayABI, signer);

      const temp = await contract.getPos(account);
      // let openTime = moment(Number(temp[4]._hex) * 1000).format('DD-MM-YYYY HH:mm:ss')

      let side = Number(temp[0]._hex) ? "short" : "Long"


      console.log(temp[0], side);
      let obj = {
        "side": side,
        "collateral": Number(temp[1]._hex) / 1e18,
        "size": Number(temp[2]._hex),
        "entryPrice": Number(temp[3]._hex),
        "openTime": moment(Number(temp[4]._hex) * 1000).format('DD-MM-YYYY HH:mm:ss'),
        "maxLoss": Number(temp[5]._hex) / 1e18,
      }
      setFutures(obj);

      console.log(obj);
      // return obj
    }
  }

  // const fetchFutures = async () => {
  //   setIsLoading(true);
  //   const data = await getFuture();
  //   console.log(data)
  //   setFutures(data);
  //   console.log(account)
  //   setIsLoading(false);
  //   console.log(futures);

  // }

  useEffect(() => {
    getFuture();
    console.log(futures)

  }, [account]);

  const handleSubmit = () => {


    //inputs.amount
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(zDayContract, zDayABI, signer);
      contract.autoClose();
    }
  }


  return (

    <div>

      {!isLoading && futures.collateral === 0 && (
        <>Future opened on: {futures.openTime}
          <br />
          <p className="font-epilogue font-semibold text-[40px] leading-[30px] text-[#818183]">
            You do not have any future yet
          </p>
          <br />
          <br />
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            Create a future now:
          </p>
          <button
            type="button"
            className={`font-epilogue font-normal text-[16px] leading-[20px] text-white min-h-[40px] px-4 rounded-[10px] hover:text-[#b676d2] bg-[#1dc071]`}
            onClick={() => { navigate('../stake'); }}

          >
            Stake
          </button>
        </>
      )}

      {!isLoading && futures.collateral > 0 && (

      <div className=" w-full rounded-[15px] bg-[#1c1c24] " >
        <div className="flex flex-col px-4 py-20">
          <div classname="flex flex-row items-center mb-[18px] pt-8">
            <p className='font-epilogue font-semibold text-[40px] leading-[30px] text-[#818183]'>Future opened on: {futures.openTime}</p>
            <p className='font-epilogue font-semibold text-[20px] mt-2 leading-[30px] text-[#818183]'>and will close after 24 hrs</p>
          </div>
        </div>


        <div className="flex w-full flex-wrap justify-between gap-[30px] mb-16 px-2">
          <CountBox title="collateral" value={futures.collateral + " USDc"} />
          <CountBox title="stop loss" value={futures.maxLoss + " USDc"} />
          <CountBox title="Size of asset" value={futures.size + " Eth"} />
          <CountBox title="Prediction" value={futures.side} />
        </div>

        <div className="flex flex-col p-4">
          <div classname="flex flex-row items-center mb-[18px] mt-8">
            <p className='font-epilogue font-semibold text-[20px] leading-[30px] text-[#818183]'>Price of the asset at the time of stake: {futures.entryPrice} </p>
          </div>
        </div>

        <form className='w-full py-[65px] flex flex-col gap-[30px]'>
        <input
          type="submit"
          className={"font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] bg-[#1dc071] cursor-pointer"}
          value="Close Position manually"
          onClick={handleSubmit}
        />
        </form>
      </div>
      )}
    </div>
  )
}

export default Dashboard