const User = require("../model/user.model");
const NftModel = require("../model/nft.model");

/* Post data in Database */
exports.postNftData = async (req, res) => {
  const { name, organization, file, price, totalshares, user } = req.body;
  console.log(req.body);
  await NftModel.save({
    // email: req.user.email,
    name,
    organization,
    file,
    price,
    totalshares,
    user,
  }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Error occured",
      });
    }
    return res.status(200).json({
      message: "NFT data! added successfully",
      success: true,
      nft: data,
    });
  });
};

/* Get one particular Nft data */
exports.getOneNftData = async (req, res) => {
  const { id } = req.params;

  await NftModel.findOne({
    _id: id,
  }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Error occured",
      });
    }
    return res.status(200).json({
      message: "NFT data! Updated successfully",
      success: true,
      nft: data,
    });
  });
};

/* Update data in Database */
exports.updateNftData = async (req, res) => {
  const { name, organization, file, price, totalshares } = req.body;

  const { id } = req.params;
  NftModel.findByIdAndUpdate(
    { id },
    {
      ...{
        name,
        organization,
        file,
        price,
        totalshares,
      },
    },
    { new: true }
  ).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Error occured",
      });
    }
    return res.status(200).json({
      message: "NFT data! added successfully",
      success: true,
      nft: data,
    });
  });
};

//to get all approved NFTS
exports.getAllApprovedNFTS = async (req, res) => {
  await NftModel.find({ approved: true }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Error occured",
      });
    }
    return res.status(200).json({
      message: "NFT data! added successfully",
      success: true,
      nft: data,
    });
  })
}

//to get all individual User NFTS
exports.getUserNFtsByWalletAddress = async (req, res) => {
  const { walletAddress } = req.params;
  await NftModel.find({ 'user.walletAddress': walletAddress }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Error occured",
      });
    }
    return res.status(200).json({
      message: "NFT data! added successfully",
      success: true,
      nft: data,
    });
  })
}