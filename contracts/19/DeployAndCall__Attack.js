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
  const contractToDeploy = "AlienCodexAttack"
  const MyContract = await ethers.getContractFactory(contractToDeploy)
  /* @remind la private key va en hardhat.config.js */
  const AlienCodexAttackContract = await MyContract.deploy(
    "0x22FEca8BCC282cfa6fe4B70A6Cf8513bf0E5d7C1",
    { gasLimit: 10000000 }
  )
  console.log("AlienCodexAttackContract", AlienCodexAttackContract.address)
}

main()
  .then(async (myContract) => {})
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

/* 
  npx hardhat run contracts/19/DeployAndCall__Attack.js --network mumbai
*/
