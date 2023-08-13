require("@nomicfoundation/hardhat-toolbox")

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require("./tasks/faucet")

require("dotenv").config()
const provider = process.env.PROVIDER_MUMBAI
const privateKey = process.env.PRIVATE_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    polygon: {
      url: provider,
      accounts: [privateKey],
    },
  },
}
