const mongoose = require("mongoose");

const Nftschema = new mongoose.Schema(
  {
    name: {
      type: String,
      max: 255,
      required: true,
    },

    organization: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    approve: {
      value: false,
    },
    shares: {
      type: Number,
    },
    user: {
      type: Object,
      require: true,
    },
  },
  { timestamps: true } // createdAt, updatedAt timestamps will be taken care of by this automatically
);

module.exports = mongoose.model("Nft", Nftschema, "nft");
