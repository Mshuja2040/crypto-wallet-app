const express = require("express");
const cors = require("cors");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

const app = express();
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "02784a0b52801fcc5d51c2a816ffc7a2ce29af9c8fe0781be627bf23962cdc38ad": 100,
  "02ea503fe1018271f3749c1babcd54b0d6e0eb261127d68f5a001db918e417c588": 50,
  "02ffe8bc52290b15d53ca6d25d8571cd59e1c27c2b613c0dea3bae59b1fce0ebb5": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, msgHash } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  // Convert signature back to a Uint8Array
  const parsedSignature = new Uint8Array(signature);
  const parsedMsgHash = new Uint8Array(msgHash);

  const isValid = secp256k1.verify(signature, msgHash, sender);


  if (!isValid) {
    return res.status(400).send({ message: "Invalid signature!" });
  }

  if (balances[sender] < amount) {
    return res.status(400).send({ message: "Not enough funds!" });
  }

  balances[sender] -= amount;
  balances[recipient] += amount;

  res.send({ balance: balances[sender] });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
