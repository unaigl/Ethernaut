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
  const contractToDeploy = "DenialAttack"
  const MyContract = await ethers.getContractFactory(contractToDeploy)
  /* @remind la private key va en hardhat.config.js */
  const DenialAttackContract = await MyContract.deploy(
    "0x53d739bcc0e16BB0AC105FcB3EC767B82BB571C4",
    { gasLimit: 10000000 }
  )
  console.log("DenialAttackContract", DenialAttackContract.address)
}

main()
  .then(async (myContract) => {})
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

/* 
  npx hardhat run contracts/20/DeployAndCall__Attack.js --network mumbai
*/
