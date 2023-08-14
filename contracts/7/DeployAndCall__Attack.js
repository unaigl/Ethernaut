require("dotenv").config()
const _provider = process.env.PROVIDER_MUMBAI
const privateKey = process.env.PRIVATE_KEY

const provider = new ethers.providers.JsonRpcProvider(_provider)
const signer = new ethers.Wallet(privateKey, provider)

/* CONTRACT NAME */
const contractToDeploy = "AttackForce"

/* DEPLOY + ATTACK */
async function main() {
  console.log("Deploying contracts with the account:", signer.address)

  const MyContract = await ethers.getContractFactory(contractToDeploy)
  const myContract = await MyContract.deploy()

  console.log("MyContract deployed to:", myContract.address)
  return myContract
}

main()
  .then(async (myContract) => {
    const tx = await myContract.connect(signer).forceAttacker({ value: 1000 })
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
  })
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

/* 
  npx hardhat run contracts/7/DeployAndCall__Attack.js --network mumbai
*/
