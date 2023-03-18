const HDWalletProvider = require('@truffle/hdwallet-provider');
// const secret = require('secret')

// module.exports = {
//   networks: {
//     development: {
//       host: "localhost",
//       port: 9545,
//       network_id: "*", // Match any network id
//       gas: 5000000
//     }
//   },
//   contracts_directory: './contracts/',
//   contracts_build_directory: './build/contracts/',
//   compilers: {
//     solc: {
//       version: "^0.8.16", 
//       settings: {
//         optimizer: {
//           enabled: true, // Default: false
//           runs: 200      // Default: 200
//         },
//       }
//     }
//   }
// };
let secret = "faint job trash miracle bring athlete weather aerobic disagree arch rebel swim"
const mnemonic = secret.toString().trim();

module.exports = {
  networks: {
    // development: {
    //   host: "localhost",
    //   port: 8545,
    //   network_id: "*", // Match any network id
    //   gas: 5000000
    // }
    matic: {
      provider: () => new HDWalletProvider(mnemonic, `https://rpc-mumbai.maticvigil.com/`),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },
  compilers: {
    solc: {
        version: "0.8.16",
    }
  }
}
