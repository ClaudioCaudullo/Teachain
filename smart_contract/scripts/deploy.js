// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  const Corsi= await hre.ethers.getContractFactory("corsi");
  const corsi= await Corsi.deploy();
  await corsi.deployed();
  console.log("Contract Corsi deployed at address "+corsi.address)

  const UserDetails= await hre.ethers.getContractFactory("UserDetails");
  const userDetails= await UserDetails.deploy();
  await userDetails.deployed();
  console.log("Contract UserDetails deployed at address "+userDetails.address)

  // const Purchase= await hre.ethers.getContractFactory("Purchase");
  // const purchase= await Purchase.deploy();
  // await purchase.deployed();
  // console.log("Contract Purchase deployed at address "+purchase.address)

  const Recensioni= await hre.ethers.getContractFactory("recensioni");
  const recensioni= await Recensioni.deploy();
  await recensioni.deployed();
  console.log("Contract Recensioni deployed at address "+recensioni.address)
}

main().catch((error) => {
  console.error("l'errore ",error);
  process.exitCode = 1;
});
