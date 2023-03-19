const DivisibleNFTs = artifacts.require("DivisibleNFTs");
// const Validation = artifacts.require("Validation");
// const Tracking = artifacts.require("Tracking");

module.exports = function(deployer) {
  deployer.deploy(DivisibleNFTs,  { from: '0x5A47d4640AeBCFe2EAbE924F01B78F36265309E1', value: "240000000000000" });
};
