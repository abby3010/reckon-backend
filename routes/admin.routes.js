const express = require("express");
const { approveNft } = require("../controller/admin.controller");
const router = express.Router();

router.post("/approve_nft/:id", approveNft);

module.exports = router;
