const { ethers } = require("hardhat")
const { logTxResult } = require("../../utils/logTxResult")

require("dotenv").config()
const _provider = process.env.PROVIDER_MUMBAI
const privateKey = process.env.PRIVATE_KEY

const provider = new ethers.providers.JsonRpcProvider(_provider)
const signer = new ethers.Wallet(privateKey, provider)

/* DEPLOY + ATTACK */
async function main() {
  /* DEPLOY 1 */
  const contractToDeploy = "PReEntrancy"
  const MyContract = await ethers.getContractFactory(contractToDeploy)
  /* @remind la private key va en hardhat.config.js */
  const PReEntrancyContract = await MyContract.deploy({ value: 100 })
  console.log("PReEntrancyContract", PReEntrancyContract.address)

  /* DEPLOY 1 */
  const contractToDeploy2 = "PReEntrancyAttack"
  const MyContract2 = await ethers.getContractFactory(contractToDeploy2)
  /* @remind la private key va en hardhat.config.js */
  const PReEntrancyAttackContract = await MyContract2.deploy(
    PReEntrancyContract.address
  )
  console.log("PReEntrancyAttackContract", PReEntrancyAttackContract.address)

  const tx = await PReEntrancyAttackContract.connect(signer).callW({
    gasLimit: 10000000,
  })
  const res = await tx.wait()
  logTxResult(res)

  const tx2 = await PReEntrancyContract.connect(signer).contractBalance()
  console.log("tx2", tx2)
}

main()
  .then(async (myContract) => {})
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

/* 
  npx hardhat run contracts/0/DeployAndCall__Attack.js --network mumbai
*/
