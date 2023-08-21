const { ethers } = require("hardhat")
// const {
//   abi: ABIPreservation,
// } = require("../../artifacts/contracts/15/Preservation.sol/Preservation.json")
const { logTxResult } = require("../../utils/logTxResult")

require("dotenv").config()
// const _provider = process.env.PROVIDER_MUMBAI
// const privateKey = process.env.PRIVATE_KEY

// const provider = new ethers.providers.JsonRpcProvider(_provider)
// const signer = new ethers.Wallet(privateKey, provider)

/* DEPLOY + ATTACK */
async function main() {
  /* CONTRACT NAME */
  const contractToDeploy = "BytecodeContract"
  const MyContract = await ethers.getContractFactory(contractToDeploy)
  /* @remind la private key va en hardhat.config.js */
  const BytecodeContractContract = await MyContract.deploy(
    "0x59a82B0967A0E373D372c6C734CE0e75264f5285"
  )
  console.log("BytecodeContractContract", BytecodeContractContract.address)
}

main()
  .then(async (myContract) => {})
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

/* 
  npx hardhat run contracts/18/DeployAndCall__Attack.js --network mumbai
*/
