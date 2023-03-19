const express = require('express')
const router = express.Router()

// Controllers
const { placeBuyOrderForNFTShare, placeSellOrderForNFTShare, getCurrentPriceOfNFTShare, saveShareExchangeHistoryToUserDoc } = require("../controller/stockMarket.controller");
router.get('/getCurrentPrice', getCurrentPriceOfNFTShare);
router.post('/placeBuyOrder', placeBuyOrderForNFTShare);
router.post('/placeSellOrder', placeSellOrderForNFTShare);
router.post('/add-trade', saveShareExchangeHistoryToUserDoc);

module.exports = router;