const express = require("express");
const router = express.Router();

const { _buyACoin, _burnACoin, _transferACoin, _getAcoinTotalSupply, _acoinBalanceOf, _buyACoinEvent, _exchangeINRtoAcoin, _buyACoinINR, _burnACoinINR, _fetchUserTransactions } = require('../controller/ACoinController');

router.post('/acoin/buy', _buyACoin);
router.post('/acoin/buy/inr', _buyACoinINR);
router.post('/acoin/buyEvent', _buyACoinEvent);
router.post('/acoin/burn', _burnACoin);
router.post('/acoin/burn/inr', _burnACoinINR);
router.post('/acoin/transfer', _transferACoin);
router.get('/acoin/totalSupply', _getAcoinTotalSupply);
router.post('/acoin/balanceOf', _acoinBalanceOf);
router.post('/acoin/exchange/inr-to-acoin', _exchangeINRtoAcoin);
router.post('/acoin/user-transactions', _fetchUserTransactions);
module.exports = router;
// # sourceMappingURL=ACoinRoutes.js.map