// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract TimeLocked {
    struct Lock {
        uint256 id;
        uint256 amount;
        uint256 unlockTime;
    }

    mapping(address => uint256) public balances;
    mapping(address => Lock[]) public Specific_Lock;
    uint256 public nextId;

    // Deposit Ether into your balance
    function deposit() external payable {
        require(msg.value > 0, "Must deposit more than zero");
        balances[msg.sender] += msg.value;
    }

    // Lock a specific amount for a specific time
    function setTime(uint256 amount, uint256 timeInSeconds) external {
        require(amount > 0, "Amount must be greater than zero");
        require(timeInSeconds > 0, "Lock time must be greater than zero");
        require(balances[msg.sender] >= amount, "Insufficient balance");

        balances[msg.sender] -= amount;

        Specific_Lock[msg.sender].push(Lock({
            id: nextId,
            amount: amount,
            unlockTime: block.timestamp + timeInSeconds
        }));

        nextId++;
    }

    // Withdraw unlocked funds
    function withdraw(uint256 amount) external {
        updateLocks(msg.sender);
        require(amount > 0, "Amount must be greater than zero");
        require(balances[msg.sender] >= amount, "Not enough unlocked balance");

        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }

    // View all active locks for the caller
    function viewLockDetails() external view returns (uint256[] memory, uint256[] memory, uint256[] memory) {
        Lock[] memory userLocks = Specific_Lock[msg.sender];
        uint256[] memory ids = new uint256[](userLocks.length);
        uint256[] memory amounts = new uint256[](userLocks.length);
        uint256[] memory unlockTimes = new uint256[](userLocks.length);

        for (uint256 i = 0; i < userLocks.length; i++) {
            ids[i] = userLocks[i].id;
            amounts[i] = userLocks[i].amount;
            unlockTimes[i] = userLocks[i].unlockTime;
        }

        return (ids, amounts, unlockTimes);
    }

    // Internal: Move expired locks back to balance
    function updateLocks(address user) internal {
        Lock[] storage userLocks = Specific_Lock[user];
        uint256 i = 0;
        while (i < userLocks.length) {
            if (block.timestamp >= userLocks[i].unlockTime) {
                balances[user] += userLocks[i].amount;
                
                // Remove the lock by swapping with the last and popping
                userLocks[i] = userLocks[userLocks.length - 1];
                userLocks.pop();
            } else {
                i++;
            }
        }
    }
}