const {
  updateNftData,
  getOneNftData,
  getAllApprovedNFTS,
  getUserNFtsByWalletAddress
} = require("../controller/nft.controller");
const { web3, DivisibleNftsABI } = require('../web3')
const upload = require('./../middleware/multer.middleware');
const generateDataUri = require("../utils/dataUriParser");
const nft = require("../model/nft.model");
const express = require("express");
const router = express.Router();
const { uploadImage } = require("../controller/cloudinary.controller");
const { _mint, _transferToken, _unitsOwnedOfAToken, _divisibilityOfAToken, _totalSupplyView } = require('../controller/DivisibleNFTController');


router.post("/add-nft",
  upload.single("image"),
  async (req, res) => {
    try {
      // Generate the data uri from the file buffer data 
      const dataUri = generateDataUri(req.file);

      // // Save the profile image file to the database
      const { secure_url, public_id } = await uploadImage(dataUri.content);
      console.log(secure_url);

      const { name, organization, price, shares, user } = req.body;
      console.log(req.body);
      const nftData = new nft({
        name,
        organization,
        tokenId: public_id,
        image: secure_url,
        price: parseInt(price),
        shares: parseInt(shares),
        user,
      });
      await nftData.save();
      const _owner = nftData.user.walletAddress;
      const _tokenId = nftData.tokenId;
      const _divisibility = nftData.shares;
      let logs;
      const divisibleNftsContract = new (web3()).eth.Contract(DivisibleNftsABI.abi, process.env.DIVISIBLE_NFTS_ADDRESS, {});
      await divisibleNftsContract.methods.mint(_owner, _tokenId, _divisibility).send({ from: process.env.OWNER_ADDRESS, gas: '2000000', gasPrice: '3000000' })
        .then(function (blockchain_result) {
          console.log(blockchain_result);
          logs = {
            owner: blockchain_result.events.mintEvent.returnValues._owner,
            tokenId: blockchain_result.events.mintEvent.returnValues._tokenId,
            divisible: blockchain_result.events.mintEvent.returnValues._divisible,
            totalSupply: blockchain_result.events.mintEvent.returnValues._totalSupply,
            message: blockchain_result.events.mintEvent.returnValues._message,
          };
          // res.status(200).json(logs);
          // return;
        }).catch((err) => {
          console.log(err);
          logs =
          {
            field: "Blockchain Error",
            message: err,
          };
          res.status(400).json(logs);
          return { logs };
        });

      res.status(200).json({
        success: true,
        message: "NFT data! added successfully",
        nft: nftData,
      });

    }
    catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
      });
    }
  }
);

router.post("/add-nft2",
  upload.single("image"),
  async (req, res) => {
    try {
      // Generate the data uri from the file buffer data 
      const dataUri = generateDataUri(req.file);

      // // Save the profile image file to the database
      const { secure_url, public_id } = await uploadImage(dataUri.content);
      console.log(secure_url);

      const { name, organization, price, shares, user } = req.body;
      console.log(req.body);
      const nftData = new nft({
        name,
        organization,
        tokenId: public_id,
        image: secure_url,
        approved: false,
        price: parseInt(price),
        shares: parseInt(shares),
        user,
      });
      await nftData.save();
      const _owner = nftData.user.walletAddress;
      const _tokenId = nftData.tokenId;
      const _noOfShares = nftData.shares;
      let logs;
      const divisibleNftsContract = new (web3()).eth.Contract(DivisibleNftsABI.abi, process.env.DIVISIBLE_NFTS_ADDRESS, {});
      await divisibleNftsContract.methods.mint(_owner, _tokenId, _noOfShares).send({ from: process.env.OWNER_ADDRESS, gasPrice: '3000000' })
        .then(function (blockchain_result) {
          console.log(blockchain_result);
          logs = {
            owner: blockchain_result.events.mintEvent.returnValues._owner,
            tokenId: blockchain_result.events.mintEvent.returnValues._tokenId,
            noOfShares: blockchain_result.events.mintEvent.returnValues._noOfShares,
            tokenTotalSupply: blockchain_result.events.mintEvent.returnValues._tokenTotalSupply,
            message: blockchain_result.events.mintEvent.returnValues._message,
          };

        }).catch((err) => {
          console.log(err);
          logs =
          {
            field: "Blockchain Error",
            message: err,
          };
          res.status(400).json(logs);
          return { logs };
        });

      const _account1 = '0x47Cc91d299487a5dED85731F7Ed6c0c9cAC86A0b'
      const _account2 = '0xA93854DB5133468a46c6A7ae57aEAeb31D22BDBE'
      const _numACoins = 10
      const _amount = (web3()).utils.toWei(_numACoins, "ether");
      await (web3()).eth.sendTransaction({ from: process.env.OWNER_ADDRESS, to: _account1, gasPrice: '3000000', value: _amount })
        .then(async function (blockchain_result) {
          await divisibleNftsContract.methods.burnACoin(_account1, _numACoins).send({ from: process.env.OWNER_ADDRESS, gasPrice: '3000000' })
            .then(function (burnACoin_result) {
              console.log(burnACoin_result);
              logs = {
                account: burnACoin_result.events.burnACoinEvent.returnValues._account,
                numACoins: burnACoin_result.events.burnACoinEvent.returnValues._numACoins,
              };
            }).catch((err) => {
              console.log(err);
              logs =
              {
                field: "Blockchain Error",
                message: err,
              };
              res.status(400).json(logs);
              return { logs };
            });

        })
        .catch((err) => {
          console.log(err);
          logs = {
            field: "Blockchain Error",
            message: err,
          };
          res.status(400).json(logs);
          return { logs };
        });

      await (web3()).eth.sendTransaction({ from: process.env.OWNER_ADDRESS, to: _account2, gasPrice: '3000000', value: _amount })
        .then(async function (blockchain_result) {
          await divisibleNftsContract.methods.burnACoin(_account2, _numACoins).send({ from: process.env.OWNER_ADDRESS, gasPrice: '3000000' })
            .then(function (burnACoin_result) {
              console.log(burnACoin_result);
              logs = {
                account: burnACoin_result.events.burnACoinEvent.returnValues._account,
                numACoins: burnACoin_result.events.burnACoinEvent.returnValues._numACoins,
              };
            }).catch((err) => {
              console.log(err);
              logs =
              {
                field: "Blockchain Error",
                message: err,
              };
              res.status(400).json(logs);
              return { logs };
            });

        })
        .catch((err) => {
          console.log(err);
          logs = {
            field: "Blockchain Error",
            message: err,
          };
          res.status(400).json(logs);
          return { logs };
        });

      const _from = _owner;
      const _to1 = _account1;
      const _units = _numACoins;

      await divisibleNftsContract.methods.transferToken(_from, _to1, _tokenId, _units).send({ from: process.env.OWNER_ADDRESS, gasPrice: '3000000' })
        .then(function (blockchain_result) {
          console.log(blockchain_result);
          logs = {
            from: blockchain_result.events.transferEvent.returnValues._from,
            to: blockchain_result.events.transferEvent.returnValues._to,
            tokenId: blockchain_result.events.transferEvent.returnValues._tokenId,
            units: blockchain_result.events.transferEvent.returnValues._units,
            message: blockchain_result.events.transferEvent.returnValues._message,
          };

        }).catch((err) => {
          console.log(err);
          logs =
          {
            field: "Blockchain Error",
            message: err,
          };
          res.status(400).json(logs);
          return { logs };
        });

      const _to2 = _account2;

      await divisibleNftsContract.methods.transferToken(_from, _to2, _tokenId, _units).send({ from: process.env.OWNER_ADDRESS, gasPrice: '3000000' })
        .then(function (blockchain_result) {
          console.log(blockchain_result);
          logs = {
            from: blockchain_result.events.transferEvent.returnValues._from,
            to: blockchain_result.events.transferEvent.returnValues._to,
            tokenId: blockchain_result.events.transferEvent.returnValues._tokenId,
            units: blockchain_result.events.transferEvent.returnValues._units,
            message: blockchain_result.events.transferEvent.returnValues._message,
          };

        }).catch((err) => {
          console.log(err);
          logs =
          {
            field: "Blockchain Error",
            message: err,
          };
          res.status(400).json(logs);
          return { logs };
        });

      res.status(200).json({
        field: "Done",
        message: "Minting of Token, Burning ACoin, Transfer of Share"
      });
      return;

    }
    catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
      });
    }
  }
);

router.get("/one_nft/:id", getOneNftData);
router.post("/update_nft_data/:id", updateNftData);
router.get('/apporved-nfts', getAllApprovedNFTS);
router.get('/user-nfts/:walletAddress', getUserNFtsByWalletAddress);

module.exports = router;
