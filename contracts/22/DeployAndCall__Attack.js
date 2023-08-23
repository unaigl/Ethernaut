const { ethers } = require("hardhat")
const { logTxResult } = require("../../utils/logTxResult")

require("dotenv").config()
const _provider = process.env.PROVIDER_MUMBAI
const privateKey = process.env.PRIVATE_KEY

const provider = new ethers.providers.JsonRpcProvider(_provider)
const signer = new ethers.Wallet(privateKey, provider)
const signerAddr = signer.address

/* DEPLOY + ATTACK */
async function main() {
  /* CONTRACT NAME */
  const contractToDeploy = "SwappableToken"
  const MyContract = await ethers.getContractFactory(contractToDeploy)
  /* @remind la private key va en hardhat.config.js */
  const SwappableTokenContract = await MyContract.deploy(
    signerAddr,
    "mi",
    "MI",
    1000,
    {
      gasLimit: 1000000,
    }
  )
  console.log("SwappableTokenContract", SwappableTokenContract.address)

  // const tx = await SwappableTokenContract.connect(signer).approve(
  //   signerAddr,
  //   100
  // )
  // const res = await tx.wait()
  // logTxResult(res)

  // const tx2 = await SwappableTokenContract.connect(signer).allowance(
  //   signerAddr,
  //   signerAddr
  // )
  // console.log("tx2", tx2)
}

main()
  .then(async (myContract) => {})
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

/* 
  npx hardhat run contracts/22/DeployAndCall__Attack.js --network mumbai
*/
