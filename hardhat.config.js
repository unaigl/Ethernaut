require("@nomicfoundation/hardhat-toolbox")

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.

require("dotenv").config()
const provider = process.env.PROVIDER_MUMBAI
const privateKey = process.env.PRIVATE_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 5000,
            // details: { yul: false },
          },
        },
      },
      {
        version: "0.6.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 5000,
            // details: { yul: false },
          },
        },
      },
      {
        version: "0.5.2",
        settings: {
          optimizer: {
            enabled: true,
            runs: 5000,
            // details: { yul: false },
          },
        },
      },
    ],
  },
  networks: {
    mumbai: {
      url: provider,
      accounts: [privateKey],
    },
  },
}
