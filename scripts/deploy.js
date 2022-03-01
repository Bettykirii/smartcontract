const hre = require("hardhat");

async function main() {
 
  const FlashSwap = await hre.ethers.getContractFactory("Flashswap");
  const flashswap = await FlashSwap.deploy();

  await flashswap.deployed();

  console.log("FlashSwap deployed to:", flashswap.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
