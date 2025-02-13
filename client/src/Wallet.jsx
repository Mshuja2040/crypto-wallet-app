import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);

    if (privateKey) {
      const publicKey = toHex(secp256k1.getPublicKey(privateKey, true)); // Get compressed key
      console.log("Derived Public Key:", publicKey); // Debugging
      setAddress(publicKey);

      const {
        data: { balance },
      } = await server.get(`balance/${publicKey}`);
      setBalance(balance);
    } else {
      setBalance(0);
      setAddress("");
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Enter your private key" value={privateKey} onChange={onChange} />
      </label>

      <label>
        Wallet Address
        <input placeholder="Your public key will be shown here" value={address} disabled />
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
