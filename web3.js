// import Web3 from "web3";
// import fs from "fs";
// import { connection } from "./connection";
const Web3 = require('web3');
const fs = require('fs');
// const connection = require('./connection');

let _web3;

// exports.web3 = {

//     connectToServer: async function (callback) {
//         const db = await connection.getDb();
//         const collection = db.collection('config');
//         _web3 = await collection.findOne({
//             _id: "web3"
//         });
//         return _web3.web3_link;
//     },

//     getWeb3: function () {
//         return new Web3(
//             new Web3.providers.HttpProvider(_web3.web3_link)
//         );
//     }
// };

// exports.web3 = async () => {
//     const web3 = await  new Web3(
//         new Web3.providers.HttpProvider('https://e159-103-250-36-82.ngrok.io'));
//     return web3;
// }

exports.web3config = async (con) => {
    const web3_ = await con.connection.db.collection('config').findOne({_id: 'web3'})
    _web3 = web3_
    console.log(_web3)
}

exports.web3 = () => {
    return new Web3(
    new Web3.providers.HttpProvider(`https://rpc-mumbai.maticvigil.com`));
    // new Web3.providers.HttpProvider(_web3.web3_link));
}

// exports.web3 = async () => {


exports.DivisibleNftsABI = JSON.parse(fs.readFileSync('blockchain/build/contracts/DivisibleNFTs.json', 'utf-8'));
