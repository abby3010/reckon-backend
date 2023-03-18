const express = require('express')
const router = express.Router()


// controller
const { upload, remove } = require("../controller/cloudinary.controller");

router.post('/uploadimages', upload);
router.post('/removeimage', remove);

module.exports = router;