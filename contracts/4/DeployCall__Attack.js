require("dotenv").config()
const _provider = process.env.PROVIDER_MUMBAI
const privateKey = process.env.PRIVATE_KEY

const provider = new ethers.providers.JsonRpcProvider(_provider)
const signer = new ethers.Wallet(privateKey, provider)

async function main() {
  console.log("Deploying contracts with the account:", signer.address)

  const MyContract = await ethers.getContractFactory("AttackCoinFlip")
  const myContract = await MyContract.deploy()

  console.log("MyContract deployed to:", myContract.address)
  return myContract
}

main()
  .then(async (myContract) => {
    /* Hay que atacar 1 vez por cada bloque (10 veces) */
    const blockTimeAprox = 20
    const pre = await myContract.connect(signer).getConsecutiveWins()
    console.log("pre", pre)

    /* PROBLEMA setTimeout no funciona, ya que se completa la ejecucion sin esperar a las tx */
    for (let i = 0; i < 10; i++) {
      // setTimeout(async () => {
      const tx = await myContract
        .connect(signer)
        .flipAttacker({ gasLimit: 10000000 })
      const res = tx.wait()
      console.log("Object.keys(res)", Object.keys(res))
      // }, blockTimeAprox * 1000)
    }

    setTimeout(async () => {
      const after = await myContract.connect(signer).getConsecutiveWins()
      console.log("after", after)
    }, blockTimeAprox * 1000 * 11)
  })
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
