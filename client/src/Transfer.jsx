import { useState } from "react";
import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  // async function transfer(evt) {
  //   evt.preventDefault();

  //   if (!privateKey) {
  //     alert("Private key is required to sign the transaction!");
  //     return;
  //   }

  //   const amount = parseInt(sendAmount);
  //   const message = `${address}-${recipient}-${amount}`;
  //   const msgHash = keccak256(utf8ToBytes(message)); // Hash the message

  //   console.log("Message Hash:", toHex(msgHash)); // Debugging

  //   try {
  //     const signature = await secp256k1.sign(msgHash, privateKey); // FIX: Await the signature
  //     console.log("Generated Signature:", signature.toDER()); // Debugging

  //     const {
  //       data: { balance },
  //     } = await server.post("send", {
  //       sender: address,
  //       recipient,
  //       amount,
  //       signature: Array.from(signature.toCompactRawBytes()), // Send compact signature
  //       msgHash: Array.from(msgHash),
  //     });

  //     setBalance(balance);
  //   } catch (ex) {
  //     alert(ex.response.data.message);
  //   }
  // }

  async function transfer(evt) {
    evt.preventDefault();
  
    if (!privateKey) {
      alert("Private key is required to sign the transaction!");
      return;
    }
  
    const amount = parseInt(sendAmount);
    const message = `${address}-${recipient}-${amount}`;
    const msgHash = toHex(keccak256(utf8ToBytes(message))); // Convert msgHash to hex
  
    // Sign the transaction using the private key
    const signature = secp256k1.sign(msgHash, privateKey).toCompactHex(); // Convert signature to hex
  
    try {
      const {
        data: { balance },
      } = await server.post("send", {
        sender: address,
        recipient,
        amount,
        signature, // Already in hex
        msgHash,   // Already in hex
      });
  
      setBalance(balance);
    } catch (ex) {
      alert(ex.response?.data?.message || "Transaction failed");
    }
  }
  

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input placeholder="1, 2, 3..." value={sendAmount} onChange={setValue(setSendAmount)} />
      </label>

      <label>
        Recipient
        <input placeholder="Recipient Address" value={recipient} onChange={setValue(setRecipient)} />
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
