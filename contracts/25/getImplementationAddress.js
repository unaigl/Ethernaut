const { ethers } = require("hardhat")
require("dotenv").config()
const _provider = process.env.PROVIDER_MUMBAI

const provider = new ethers.providers.JsonRpcProvider(_provider)

/* @remind CHANGE addr */
const proxyAddr = "0xb7Ce256B188950C04A6fEF7581418E167799C482"

async function main() {
  const implementationAddress = await provider.getStorageAt(
    proxyAddr,
    "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"
  )

  console.log("implementationAddress", implementationAddress)

  /* --> 0xc6fbb2eee776ab4dcabcd06c70ad6459aa54d039 */
}

main()
  .then(async (myContract) => {})
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

/* 
  npx hardhat run contracts/25/getImplementationAddress.js --network mumbai
*/
