const express = require("express");
const router = express.Router();
const { _mint, _transferToken, _unitsOwnedOfAToken, _divisibilityOfAToken, _totalSupplyView, _divisibilityOfTokens, _getPrice } = require('../controller/DivisibleNFTController');
router.get('/nft/totalSupply', _totalSupplyView);
router.post('/nft/mint', _mint);
router.post('/nft/transfer', _transferToken);
router.post('/nft/transfer/price', _getPrice);
router.post('/nft/owner/own', _unitsOwnedOfAToken);
router.post('/nft/divisibility', _divisibilityOfAToken);
router.post('/nft/divisibilities', _divisibilityOfTokens);
module.exports = router;
// # sourceMappingURL=DivisibleNFTRoutes.js.map