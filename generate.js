const MerkleTree = require('./index.js');
const { sha3 } = require('ethereumjs-util');
const fs = require('fs');

const utxos = JSON.parse(fs.readFileSync('data/utxos.json'));

console.log('Total ' + utxos.length + ' UTXOs');

var total = 0;
utxos.map(utxo => {
  total += utxo.satoshis;
});

console.log('Total value: ' + total / 1e8);

var arr = [];

utxos.map(utxo => {
  var str = utxo.txid + utxo.address + utxo.outputIndex + utxo.satoshis;
  arr.push(str);
});

console.log('Hashing elements...');
const elements = arr.map(e => sha3(e, '256'));
console.log('Hashed elements!');

console.log('Generating Merkle tree...');
const start = Date.now() / 1000;
const merkleTree = new MerkleTree(elements);
const end = Date.now() / 1000;
console.log('Generated Merkle tree in ' + (end - start) + ' seconds!');

const root = merkleTree.getRoot();
console.log('Merkle root (hex): ' + root.toString('hex'));

const json = merkleTree.toJSON();
const path = 'data/merkleTree.json';
fs.writeFileSync(path, json);
console.log('Wrote Merkle tree to ' + path);


/*
console.log('Testing proofs for 20 random elements...');

var indices = [];
for (var i = 0; i < 20; i++) {
  indices.push(Math.floor(Math.random() * elements.length));
}

indices.map(index => {
  const proof = merkleTree.getProof(elements[index]);
  if (merkleTree.checkProof(proof, root, elements[index])) {
    console.log('Proof for index ' + index + ' OK.');
  } else {
    console.warn('Proof for index ' + index + ' failed!');
  }
});
*/
