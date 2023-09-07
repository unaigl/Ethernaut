const { ethers } = require("hardhat")
const { logTxResult } = require("../../utils/logTxResult")
const {
  abi: ABIIERC20,
} = require("../../artifacts/contracts/22/DEX.sol/IERC20.json")

require("dotenv").config()
const _provider = process.env.PROVIDER_MUMBAI
const privateKey = process.env.PRIVATE_KEY

const provider = new ethers.providers.JsonRpcProvider(_provider)
const signer = new ethers.Wallet(privateKey, provider)
const signerAddr = signer.address

/* DEPLOY + ATTACK */
async function main() {
  /* CONTRACT NAME */
  const contractToDeploy = "PuzzleProxyHack"
  const MyContract = await ethers.getContractFactory(contractToDeploy)
  /* @remind la private key va en hardhat.config.js */
  const PuzzleProxyHackContract = await MyContract.deploy(
    "0x5056a0a6EDE7AA4F4c98DdcEdD657FE9E99cf5F6",
    {
      gasLimit: 1000000,
      value: ethers.utils.parseEther("0.001"),
    }
  )
  console.log("PuzzleProxyHackContract", PuzzleProxyHackContract.address)
}

main()
  .then(async (myContract) => {})
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

/* 
  npx hardhat run contracts/24/DeployAndCall__Attack.js --network mumbai
*/
