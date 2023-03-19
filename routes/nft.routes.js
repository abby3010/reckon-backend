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
const axios = require("axios");


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
      var nftId;
      await nftData.save(function(err,result){
        if (err){
            console.log(err);
        }
        else{
            console.log(result)
            nftId = result["_id"]
        }
    });
      const _owner = nftData.user.walletAddress;
      const _tokenId = nftData.tokenId;
      const _divisibility = nftData.shares;
      let logs;
      const divisibleNftsContract = new (web3()).eth.Contract(DivisibleNftsABI.abi, process.env.DIVISIBLE_NFTS_ADDRESS, {});
      var encodedData = divisibleNftsContract.methods.mint(_owner, _tokenId, _divisibility, process.env.OWNER_ADDRESS).encodeABI();

      const gasPrice = await web3().eth.getGasPrice();
    const gasEstimate = await divisibleNftsContract.methods.mint(_owner, _tokenId, _divisibility, process.env.OWNER_ADDRESS).estimateGas({ });
    
    // const estimateOptions = {
    //   method: 'GET',
    //   url:'https://mainnet-aptos-api.moralis.io/transactions/estimate_gas_price',
    //   headers: {
    //     accept: 'application/json',
    //     'X-API-Key': process.env.MORALIS_KEY
    //   },
    // };
    
    // await axios(estimateOptions)
    //   .then(response => console.log(response))
    //   .catch(err => console.error(err));

    const transactionParam = {
      to: process.env.DIVISIBLE_NFTS_ADDRESS,
      gas: gasEstimate,
      gasPrice: gasPrice,
      // value: encodedValue,
      data: encodedData,
    };
    await web3().eth.accounts.signTransaction(
        transactionParam,
        process.env.OWNER_PRIVATE_KEY
      )
      .then(async (signed) => {
        await web3().eth.sendSignedTransaction(signed.rawTransaction)
          .then(function (blockchain_result, events) {
            console.log(blockchain_result);
            logs = {
              blockchain_result,
            };
            // res.status(200).json(logs);
            // return { logs };
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
    
    var block = await (web3()).eth.getBlock("latest");
    var blockNumber = await web3().eth.getBlockNumber()

    await divisibleNftsContract
      .getPastEvents("mintEvent", {
        fromBlock: blockNumber - 5,
        toBlock: "latest",
      })
      .then(async (blockchain_result) =>{
        for (let i = 0; i < blockchain_result.length; i++) {
          let resultOwner = blockchain_result[i]["returnValues"]["_owner"]
            .toString()
            .replace(/\s/g, "");
          var boolCheck =
            resultOwner.toString().trim().toLowerCase() ===
            _owner.toString().trim().toLowerCase();
          if (boolCheck) {
            console.log(blockchain_result[i]);
            var data = JSON.stringify({
              "ticker_symbol": name,
              "nft_owner_address": nftData.user.walletAddress,
              "face_value": price,
              "total_shares": shares
            });
            
            var config = {
              method: 'post',
            maxBodyLength: Infinity,
              url: 'https://smact.vercel.app/api/addNewNFTTicker',
              headers: { 
                'Content-Type': 'application/json'
              },
              data : data
            };
          
            await axios(config)
              .then(function (response) {
                console.log(JSON.stringify(response.data));
              })
            res.status(200).json(blockchain_result[i]);
            return;
          }
        }
        res.status(400).json("No event emitted");
        return;
      });
  } catch (err) {
    // await nft.findOneAndRemove({_id: nftId}, function(e,result){
    //   if (e){
    //       console.log(e);
    //   }
    //   else{
    //       console.log(result)
    //   } });
    console.log(err);
    logs = {
      field: "Blockchain Unknown Error",
      message: err,
    };
    res.status(400).json(logs);
    return { logs };
  }
  }
);

router.get("/one_nft/:id", getOneNftData);
router.post("/update_nft_data/:id", updateNftData);
router.get('/apporved-nfts', getAllApprovedNFTS);
router.get('/user-nfts/:walletAddress', getUserNFtsByWalletAddress);

module.exports = router;
