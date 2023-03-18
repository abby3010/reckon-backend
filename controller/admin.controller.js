const nftModal = require("../modal/nft.modal");

exports.approveNft = async (req, res) => {
  const approved = req.body.approved;
  const { id } = req.params;
  nftModal
    .findByIdAndUpdate(
      { id },
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
