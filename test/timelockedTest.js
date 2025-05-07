const { expect } = require("chai");
const { ethers } = require("hardhat");

console.log("Ethers is:", ethers);

describe("TimeLocked", function () {
  let contract, owner;

  beforeEach(async function () {
    // Deploy the contract and get the signer
    const ContractFactory = await ethers.getContractFactory("TimeLocked");
    contract = await ContractFactory.deploy(); // ✅ OK
    [owner] = await ethers.getSigners(); // ✅ Get the owner's address
  });

  it("should allow deposits", async function () {
    const depositAmount = ethers.parseEther("1"); // ✅ Make sure parseEther is accessible

    // Deposit the funds
    await contract.deposit({ value: depositAmount });

    // Check if the balance is correct
    const balance = await contract.balances(owner.address);
    expect(balance).to.equal(depositAmount);
  });

  it("should lock funds", async function () {
    const depositAmount = ethers.parseEther("1");
    await contract.deposit({ value: depositAmount });

    await contract.setTime(depositAmount, 60); // Lock for 60 seconds

    const locks = await contract.viewLockDetails();
    expect(locks[0][0]).to.equal(0); // First lock's ID is 0
    expect(locks[1][0]).to.equal(depositAmount); // Amount
  });
});
