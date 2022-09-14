require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks:{
    hardhat:{
      forking:{
        url: "https://eth-goerli.g.alchemy.com/v2/XZ7vlHLDiiCNOwGjWqfDjXeTCYAzxwBe"
      }
    },
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/XZ7vlHLDiiCNOwGjWqfDjXeTCYAzxwBe",
      accounts: ["ed3586a25022d58f2d252369fc17048837406449dac4aa439bd98fbd960fa2dc"],
    }
  },
  etherscan: {
    apiKey: {
      goerli: "9QPPX9FUG9DHAYYUFQGIF96A41IHZQAV7P"
    }   
  }
};
