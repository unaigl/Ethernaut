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
/* Hay que aprovar un address para despues llamar a transferFrom. Esta ultima funcion no tiene el lock
Se puede dar allowance de address0 a address0. Asi, no nos hace falta otra wallet
*/
async function main() {
  // const preservationAddress = "0x88279511049Db94172cce04E6253c48eacF565e6"
  /* instance */
  // const PreservationContract = new ethers.Contract(
  //   preservationAddress,
  //   ABIPreservation,
  //   provider
  // )

  /* CONTRACT NAME */
  const contractToDeploy = "RealRecovery"
  const MyContract = await ethers.getContractFactory(contractToDeploy)
  const RealRecoveryContract = await MyContract.deploy()

  const sender = "0x15f24C67DE0C10b521736139A279A9b946E310BF"

  const tx = await RealRecoveryContract.connect(provider).generateAddress(
    sender,
    {
      gasLimit: 10000000,
    }
  )
  console.log("tx", tx)
  // const res = await tx.wait()
  // logTxResult(res)
}

main()
  .then(async (myContract) => {})
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

/* 
  npx hardhat run contracts/17/DeployAndCall__Attack.js --network mumbai
*/
