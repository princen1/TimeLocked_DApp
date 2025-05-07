const hre = require("hardhat");

async function main() {
  const TimeLocked = await hre.ethers.getContractFactory("TimeLocked");
  const contract = await TimeLocked.deploy();
  console.log(`TimeLocked deployed to: ${contract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
