const nftModel = require("../model/nft.model");

exports.approveNft = async (req, res) => {
  const approved = req.body.approved;
  const { id } = req.params;
  nftModel
    .findByIdAndUpdate(
      { _id: id },
      {
        ...{
          approved,
        },
      },
      { new: true }
    )
    .exec((err, data) => {
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

exports.getnftData = async (req, res) => {
  await nftModel.find({}).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Error occured",
      });
    }
    console.log(data);
    res.status(200).json(data);
    return;
    // res.status(200);
  });
};

exports.deleteOneNftData = async (req, res) => {
  const { id } = req.params;
  nftModel.findOneAndDelete({ id }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Error occured",
      });
    }
    return res.status(200).json({
      message: "NFT data! deleted successfully",
      success: true,
    });
  });
};
