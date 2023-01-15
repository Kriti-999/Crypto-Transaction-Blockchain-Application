const main = async () => {
  const Transactions = await hre.ethers.getContractFactory("Transaction");
  const transactions = await Transactions.deploy();

  await transactions.deployed();

  console.log("Transactions deployed to: ", transactions.address);
};

const runMain = async () => {
  try {
    await main();//it call the main method 
    process.exit(0);// when exit the process return 0
  } catch (error) {
    console.error(error);//prints out the error
    process.exit(1);// when exit the process return 1
  }
};

runMain()//cal the runMain method 