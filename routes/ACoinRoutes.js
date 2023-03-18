const express = require("express");
const router = express.Router();

const { _buyACoin, _burnACoin, _transferACoin, _getAcoinTotalSupply, _acoinBalanceOf, _buyACoinEvent } = require('../controller/ACoinController');

router.post('/acoin/buy', _buyACoin);
router.post('/acoin/buyEvent', _buyACoinEvent);
router.post('/acoin/burn', _burnACoin);
router.post('/acoin/transfer', _transferACoin);
router.get('/acoin/totalSupply', _getAcoinTotalSupply);
router.post('/acoin/balanceOf', _acoinBalanceOf);
module.exports = router;
// # sourceMappingURL=ACoinRoutes.js.map