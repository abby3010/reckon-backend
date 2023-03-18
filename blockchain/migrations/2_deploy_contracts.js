const DivisibleNFTs = artifacts.require("DivisibleNFTs");
// const Validation = artifacts.require("Validation");
// const Tracking = artifacts.require("Tracking");

module.exports = function(deployer) {
  deployer.deploy(DivisibleNFTs);
};
