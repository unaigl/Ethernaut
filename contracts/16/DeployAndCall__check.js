const { ethers } = require("hardhat")
const {
  abi: PreservationAttack,
} = require("../../artifacts/contracts/16/Preservation.sol/PreservationAttack.json")
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
  const preservationAddress = "0xfA089687BA5bd22392F03D98be8cB21c912aEe6F"
  /* instance */
  const PreservationContract = new ethers.Contract(
    preservationAddress,
    PreservationAttack,
    provider
  )

  /*  */
  // const tx = await PreservationContract.connect(signer).attackPreservation({
  //   gasLimit: 10000000,
  // })
  // const res = await tx.wait()
  // logTxResult(res)

  const tx2 = await PreservationContract.afterr()
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
  npx hardhat run contracts/16/DeployAndCall__check.js --network mumbai
*/
