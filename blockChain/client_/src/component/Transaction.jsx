import React, { useContext } from "react";
import {TransactionContext} from "../Context/TransactionContext";
const TransactionCard=({addressTo,addressFrom,timestamp,amount,url,message})=>{
    url="https://i.pinimg.com/originals/73/d3/a1/73d3a14d212314ab1f7268b71d639c15.gif";
    return(
        <div className="bg-[#181918] m-4 flex flex-1
    2xl:min-w-[450px]
      2xl:max-w-[500px]
      sm:min-w-[270px]
      sm:max-w-[300px]
      min-w-full
      flex-col p-3 rounded-md hover:shadow-2xl">
         <div className="flex flex-col items-center w-full mt-3">
         <div className=" w-full mb-6 p-2">
         <a href={`https://goerli.etherscan.io/address/${addressFrom}`} target="_blank" rel="noreferrer">
            <p className="text-white text-base">From: {addressFrom.slice(0,5)}....{addressFrom.slice(addressFrom.length-4)}</p>
          </a>
          <a href={`https://goerli.etherscan.io/address/${addressTo}`} target="_blank" rel="noreferrer">
            <p className="text-white text-base">To: {addressTo.slice(0,5)}....{addressTo.slice(addressTo.length-4)}</p>
          </a>
          <p className="text-white text-base">Amount: {amount} Eth</p>
          {message &&(
            <>
            <br/>
            <p className="text-white text-base">Message:{message}</p>
            </>
          )
          
          }
          <img src={url} className="w-60 h-40"/>
          <div className="bg-black p-3 px-5 w-max  rounded-3xl mt-5 shadow-2xl">
            <p className="text-white font-bold">Time:{timestamp}</p>
          </div>
            </div>
         </div>
      </div>
    )
}
function Transaction(){
    const {currentAccount,transactionArray}=useContext(TransactionContext);
    return <div className="flex w-full justify-center 2xl:px-20 gradient-bg-transactions">
        <div className="flex flex-col md:p-12 py-12 px-4">
            {currentAccount?
            (
                <h3 className="text-white text-3xl text-center my-2">Latest Transaction</h3>
            ):
            (
                <h3 className="text-white text-3xl text-center my-2">Connect the account to see the latest transactions..</h3>
            )}
            <div className="flex flex-wrap jsutify-center items-center mt-10">
                {transactionArray.reverse().map((transaction,i)=>(
                    <TransactionCard key={i} {...transaction}/>
                    // <h1>hi</h1>
                ))}
            </div>
        </div>
        
    </div>
}
export default Transaction;