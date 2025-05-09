# TimeLocked DApp

TimeLocked is a decentralized savings account DApp that allows users to:
- Deposit Ether into a personal balance.
- Lock a portion of the balance for a specific period.
- Automatically unlock funds after the time period expires.
- View all current active locks.

## Project Structure

```
TIMELocked/
├── artifacts/               # Hardhat build artifacts (ABI, bytecode)
├── contracts/
│   └── timelocked.sol       # Solidity smart contract
├── frontend/
│   ├── src/                 # React frontend source code
│   ├── public/              # Static assets
│   ├── package.json         # React dependencies
│   └── ...                  # Other React configs
├── ignition/                # Hardhat Ignition scripts
├── scripts/
│   └── deploy.js            # Deployment script
├── test/
│   └── timelockedTest.js    # Contract test file using Hardhat
└── README.md                # This file
```

## Smart Contract Overview

- 'Deposit Ether (ETH)': into the contract. 
- Choose a specific portion of their deposited funds to lock. 
- Set an unlock time (e.g., 6 months) for the locked amount. 
- Ensure the locked funds cannot be withdrawn until the unlock time arrives. 
- Withdraw unlocked or remaining funds at any time, and locked funds once the 
- time period has passed. 

## Getting Started

### Prerequisites
- Node.js and npm
- Hardhat
- MetaMask (for frontend interaction)

### Setup Instructions

#### 1. Install dependencies
```bash
npm install
cd frontend
npm install
```

#### 2. Compile and deploy contract
```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost
```

#### 3. Start React frontend
```bash
cd frontend
npm start
```

## Testing

```bash
npx hardhat test
```

## Frontend

- Written in React (located in `/frontend/src`)
- Connects via Web3 to MetaMask
- Interacts with deployed contract on localhost

## License

[MIT License](./LICENSE)
