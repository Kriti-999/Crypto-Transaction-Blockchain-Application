import React, { useState } from "react";
import { ethers } from "ethers"
import { contractABI, contractAddress } from "../Utils/constant.js";
import { useEffect } from "react";
import { parse } from "@ethersproject/transactions";
export const TransactionContext = React.createContext();
const { ethereum } = window;
const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);
    // console.log({
    //     provider,
    //     signer,
    //     transactionContract
    // });
    return transactionContract;
}
export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState('');
    const [formData, setFormData] = useState({ addressTo: '', amount: '', keyword: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    const [transactionArray,setTransactionArray]=useState([]);


    //this function takes care of form data change it will assign the cange value to set form data
    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    }


    //get all the transaction
    const getAllTransactionTillNow = async() => {
        try {
            if (!ethereum) {
                return (alert("Please install metamask"));
            }
            const transactionContract = getEthereumContract();
            const availableTransaction = await transactionContract.getAllTransaction();
            const structuredTransactions = availableTransaction.map((transaction) => ({
                addressTo: transaction.receiver,
                addressFrom: transaction.from,
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: parseInt(transaction.amount._hex) / (10 ** 18)
            }));
            setTransactionArray(structuredTransactions);
            console.log("inside getAllTransaction")
            console.log(availableTransaction);
            

        } catch (error) {
            console.log(error);
        }
    }


    //this function connect the account with metamask
    const CheckWalletConnected = async () => {
        if (!ethereum) {
            return (alert("Please install metamask"));
        }
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length) {
            setCurrentAccount(accounts[0]);

            getAllTransactionTillNow();
           
        }
        else {
            console.log("No accounts found");
        }
        console.log("inside checkwalletConnected")
        console.log(accounts);
    }


    const checkIfTransactionExists = () => {
        try {
            const transactionContract = getEthereumContract();
            const transactionCount = transactionContract.getTransactionCount();
        } catch (error) {
            console.log(error);
            throw new Error("No etherum object");
        }
    }


    //this function connect with wallet
    const connectWallet = async () => {
        try {
            if (!ethereum) return alert("Please install metamask");
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
            setCurrentAccount(accounts[0]);
        }
        catch (error) {
            console.log(error);
            throw new Error("No etherum object");
        }
    }


    //this function send all the transaction
    const sendTransaction = async () => {
        try {
            if (!ethereum) alert("Please install metamask");
            //get the data from form from welcome.js
            const { addressTo, amount, keyword, message } = formData;
            const parsedAmount = ethers.utils.parseEther(amount);//for converting amount ie a int value to ether
            const transactionContract = getEthereumContract();// take transactionContarct from function getEthereumContract
            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: "0x5208",//0x5208 is a hexadecimal value equal to 2100 giwi
                    value: parsedAmount._hex,//convert the ether value to hexadecimal
                }]
            })
            //transactionHash by transactionContract call the function addToBlockChain 
            //defined in Transaction.sol in order to add data to blockchain 

            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
            setIsLoading(true)//as transactionHash process takes time
            console.log(`Loading -${transactionHash.hash}`);
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`Success -${transactionHash.hash}`);

            const transactionCount = await transactionContract.getTransactionCount();//this transactionCount
            //is different from use state transaction count
            setTransactionCount(transactionCount.toNumber());//here above transaction count is used
            window.reload();
        } catch (error) {
            console.log(error);
            throw new Error("No etherum object");
        }
    }


    useEffect(() => {
        CheckWalletConnected();
        checkIfTransactionExists();
    }, [])
    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, sendTransaction, handleChange,transactionArray ,isLoading}}>
            {children}
        </TransactionContext.Provider>
    );
}
