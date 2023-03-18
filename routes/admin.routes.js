const express = require("express");
const { approveNft, getnftData, deleteOneNftData } = require("../controller/admin.controller");
const router = express.Router();

router.post("/approve_nft/:id", approveNft);
router.get("/get_nft_data", getnftData);
router.get("/delete_nft_data/:id", deleteOneNftData);

module.exports = router;
