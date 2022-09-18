const hre = require("hardhat");

async function main() {

  const Courses= await hre.ethers.getContractFactory("Courses");
  const courses= await Courses.deploy();
  await courses.deployed();
  console.log("Contract Courses deployed at address "+courses.address)

  const UserDetails= await hre.ethers.getContractFactory("UserDetails");
  const userDetails= await UserDetails.deploy();
  await userDetails.deployed();
  console.log("Contract UserDetails deployed at address "+userDetails.address)

  const Reviews= await hre.ethers.getContractFactory("Reviews");
  const reviews= await Reviews.deploy();
  await reviews.deployed();
  console.log("Contract Reviews deployed at address "+reviews.address)
}

main().catch((error) => {
  console.error("l'errore ",error);
  process.exitCode = 1;
});
