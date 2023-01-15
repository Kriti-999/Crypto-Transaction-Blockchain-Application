//require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.17",
  networks:{
    Goerli:{
      url:"https://eth-goerli.g.alchemy.com/v2/4xH0kd_bs5_id7bRT-Cr2z0c3jkvdX7L",
      accounts:['#####']// write here your account number of goerli account
    }
  }
};
