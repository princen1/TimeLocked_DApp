import './App.css';
import React, { useState, useEffect } from "react";
import { web3, contract } from "./contract";

function App() {
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [lockTime, setLockTime] = useState("");
  const [lockDetails, setLockDetails] = useState([]);
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet.");
    }
  };

  const deposit = async () => {
    if (!amount) {
      alert("Please enter an amount to deposit.");
      return;
    }

    setLoading(true);
    try {
      await contract.methods.deposit().send({
        from: account,
        value: web3.utils.toWei(amount, "ether"),
      });
      alert("Deposit successful");
      setAmount("");
    } catch (error) {
      console.error("Error in deposit:", error);
      alert("Deposit failed.");
    } finally {
      setLoading(false);
    }
  };

  const lockFunds = async () => {
    if (!amount || !lockTime) {
      alert("Please enter both amount and lock time.");
      return;
    }

    setLoading(true);
    try {
      await contract.methods.setTime(
        web3.utils.toWei(amount, "ether"),
        parseInt(lockTime)
      ).send({ from: account });
      alert("Funds locked");
      setAmount("");
      setLockTime("");
    } catch (error) {
      console.error("Error in lockFunds:", error);
      alert("Locking funds failed.");
    } finally {
      setLoading(false);
    }
  };

  const withdraw = async () => {
    if (!amount) {
      alert("Please enter an amount to withdraw.");
      return;
    }

    setLoading(true);
    try {
      await contract.methods.withdraw(
        web3.utils.toWei(amount, "ether")
      ).send({ from: account });
      alert("Withdraw complete");
      setAmount("");
    } catch (error) {
      console.error("Error in withdraw:", error);
      alert("Withdrawal failed.");
    } finally {
      setLoading(false);
    }
  };

  const viewLocks = async () => {
    setLoading(true);
    try {
      if (!account) {
        alert("Wallet not connected.");
        return;
      }

      const result = await contract.methods.viewLockDetails().call({ from: account });

      // Debugging log
      console.log("Raw lock data from contract:", result);

      if (!result || result.length !== 3) {
        alert("Unexpected result from smart contract.");
        return;
      }

      const formatted = result[0].map((id, index) => ({
        id,
        amount: web3.utils.fromWei(result[1][index], "ether"),
        unlockTime: new Date(result[2][index] * 1000).toLocaleString(),
      }));

      setLockDetails(formatted);
    } catch (error) {
      console.error("Error in viewLocks:", error);
      alert("Failed to fetch lock details.");
    } finally {
      setLoading(false);
    }
  };

  const getBalance = async () => {
    try {
      const result = await contract.methods.balances(account).call();
      setBalance(web3.utils.fromWei(result, "ether"));
    } catch (error) {
      console.error("Error fetching balance:", error);
      alert("Could not fetch balance.");
    }
  };

  useEffect(() => {
    if (window.ethereum) connectWallet();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>TimeLocked DApp</h2>
      <p><strong>Account:</strong> {account}</p>

      <input
        type="text"
        placeholder="Amount in ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      /><br />

      <input
        type="text"
        placeholder="Lock time (seconds)"
        value={lockTime}
        onChange={(e) => setLockTime(e.target.value)}
      /><br />

      <button onClick={deposit} disabled={loading}>Deposit</button>
      <button onClick={getBalance}>Deposited Amount</button>
      <button onClick={lockFunds} disabled={loading}>Lock Funds</button>
      <button onClick={withdraw} disabled={loading}>Withdraw</button>
      <button onClick={viewLocks} disabled={loading}>View Locks</button>

      {loading && <p>Loading...</p>}

      {balance !== "" && (
        <p><strong>Smart Contract Balance:</strong> {balance} ETH</p>
      )}

      <h3>Lock Details</h3>
      <ul>
        {lockDetails.map(lock => (
          <li key={lock.id}>
            ID: {lock.id}, Amount: {lock.amount} ETH, Unlock: {lock.unlockTime}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
