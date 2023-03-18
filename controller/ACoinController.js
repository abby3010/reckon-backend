const { web3, DivisibleNftsABI } = require("../web3");
const Moralis = require("moralis").default;

const _transferACoin = async (req, res) => {
  const _sender = req.body.sender;
  const _receiver = req.body.receiver;
  const _numACoins = req.body.numACoins;
  const _caller = req.body.caller;
  let logs;

  try {
    const divisibleNftsContract = new (web3()).eth.Contract(
      DivisibleNftsABI.abi,
      process.env.DIVISIBLE_NFTS_ADDRESS,
      {}
    );
    var encodedData = divisibleNftsContract.methods
      .transferACoin(_sender, _receiver, _numACoins, _caller)
      .encodeABI();
    const transactionParam = {
      to: process.env.DIVISIBLE_NFTS_ADDRESS,
      // gas: '0x76c0', // 30400
      // gasPrice: '0x9184e72a000', // 10000000000000
      // value: encodedValue,
      data: encodedData,
    };

    res.status(200).json(transactionParam);
    return;
  } catch (err) {
    console.log(err);
    logs = {
      field: "Blockchain Error",
      message: err,
    };
    res.status(400).json(logs);
    return { logs };
  }
};

const _transferACoinEvent = async (req, res) => {
  const _caller = req.body.caller;
  const divisibleNftsContract = new (web3()).eth.Contract(
    DivisibleNftsABI.abi,
    process.env.DIVISIBLE_NFTS_ADDRESS,
    {}
  );
  var blockNumber = await web3().eth.getBlockNumber();
  await divisibleNftsContract
    .getPastEvents("transferACoinEvent", {
      fromBlock: blockNumber - 5,
      toBlock: "latest",
    })
    .then(function (blockchain_result) {
      for (let i = 0; i < blockchain_result.length; i++) {
        let resultCaller = blockchain_result[i]["returnValues"]["_caller"]
          .toString()
          .replace(/\s/g, "");
        var boolCheck =
          resultCaller.toString().trim().toLowerCase() ===
          _caller.toString().trim().toLowerCase();
        if (boolCheck) {
          console.log(blockchain_result[i]);
          res.status(200).json(blockchain_result[i]);
          return;
        }
      }
      res.status(400).json("No event emitted");
      return;
    });
};

const _buyACoin = async (req, res) => {
  const _account = req.body.account;
  const _numACoins = req.body.numACoins;
  const _caller = req.body.caller;
  // const _amount = (web3()).utils.toWei(_numACoins, "ether");

  let logs;
  try {
    const divisibleNftsContract = new (web3()).eth.Contract(
      DivisibleNftsABI.abi,
      process.env.DIVISIBLE_NFTS_ADDRESS,
      {}
    );
    var encodedData = divisibleNftsContract.methods
      .buyACoin(_account, _numACoins, _caller)
      .encodeABI();
    var encodedValue = web3().utils.toHex(
      web3().utils.toWei(_numACoins, "gwei")
    );
    const transactionParam = {
      to: process.env.DIVISIBLE_NFTS_ADDRESS,
      // gas: '0x76c0', // 30400
      // gasPrice: '0x9184e72a000', // 10000000000000
      value: encodedValue,
      data: encodedData,
    };

    res.status(200).json(transactionParam);
    return;
  } catch (err) {
    console.log(err);
    logs = {
      field: "Blockchain Error",
      message: err,
    };
    res.status(400).json(logs);
    return { logs };
  }
};

const _buyACoinEvent = async (req, res) => {
  console.log(req.body.body)
  console.log(JSON.parse(req.body.body))
  const _caller = (JSON.parse(req.body.body)).caller;
  console.log(_caller);
  const divisibleNftsContract = new (web3()).eth.Contract(
    DivisibleNftsABI.abi,
    process.env.DIVISIBLE_NFTS_ADDRESS,
    {}
  );
  var blockNumber = await web3().eth.getBlockNumber();
  await divisibleNftsContract
    .getPastEvents("buyACoinEvent", {
      fromBlock: blockNumber - 5,
      toBlock: "latest",
    })
    .then(function (blockchain_result) {
      for (let i = 0; i < blockchain_result.length; i++) {
        let resultCaller = blockchain_result[i]["returnValues"]["_caller"]
          .toString()
          .replace(/\s/g, "");
        var boolCheck =
          resultCaller.toString().trim().toLowerCase() === _caller.toString().trim().toLowerCase();
        if (boolCheck) {
          console.log(blockchain_result[i]);
          console.log(blockchain_result[i]["returnValues"]['_account'])
          res.status(200).json(blockchain_result[i]);
          return;
        }
      }
      res.status(400).json("No event emitted");
      return;
    });
};

const _buyACoinEventTemp = async (req, res) => {
  const _caller = req.body.caller;
  const eventCaller = await web3().utils.sha3(_caller)
  const abi = DivisibleNftsABI.abi
  const eventTopic = await web3().utils.sha3("buyACoinEvent(address, uint, address payable, string)")
  // console.log(typeof DivisibleNftsABI.abi)
  const response = await Moralis.EvmApi.events.getContractEvents({
    address: process.env.DIVISIBLE_NFTS_ADDRESS,
    abi: {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "_account",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_numACoins",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address payable",
          "name": "_caller",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "_message",
          "type": "string"
        }
      ],
      "name": "buyACoinEvent",
      "type": "event"
    },
    chain: 80001,
    topic: "buyACoinEvent(address, uint, address payable, string)",
  })
  // console.log(response);
  res.status(200).json(response);
  return
}

const _burnACoin = async (req, res) => {
  const _account = req.body.account;
  const _numACoins = req.body.numACoins;
  const _caller = req.body.caller;
  // const _amount = web3().utils.toWei(_numACoins, "ether");

  let logs;

  try {
    const divisibleNftsContract = new (web3()).eth.Contract(
      DivisibleNftsABI.abi,
      process.env.DIVISIBLE_NFTS_ADDRESS,
      {}
    );
    var encodedData = divisibleNftsContract.methods.burnACoin(_account, _numACoins, _caller).encodeABI();
      
    var encodedValue = web3().utils.toHex(
      web3().utils.toWei(_numACoins, "gwei")
    );

    const gasPrice = await web3().eth.getGasPrice();
    const gasEstimate = await divisibleNftsContract.methods.burnACoin(_account, _numACoins, _caller).estimateGas({ });
  
    const transactionParam = {
      to: process.env.DIVISIBLE_NFTS_ADDRESS,
      gas: '210000',
      gasPrice: gasPrice,
      value: encodedValue,
      data: encodedData,
    };
    await web3().eth.accounts.signTransaction(
        transactionParam,
        process.env.OWNER_PRIVATE_KEY
      )
      .then(async (signed) => {
        await web3().eth.sendSignedTransaction(signed.rawTransaction)
          .then(function (blockchain_result, events) {
            console.log(blockchain_result);
            logs = {
              blockchain_result,
            };
            // res.status(200).json(logs);
            // return { logs };
          });
      })
      .catch((err) => {
        console.log(err);
        logs = {
          field: "Blockchain Error",
          message: err,
        };

        res.status(400).json(logs);
        return { logs };
      });
    
    var block = await (web3()).eth.getBlock("latest");
    var blockNumber = await web3().eth.getBlockNumber()

    await divisibleNftsContract
      .getPastEvents("burnACoinEvent", {
        fromBlock: blockNumber - 5,
        toBlock: "latest",
      })
      .then(function (blockchain_result) {
        for (let i = 0; i < blockchain_result.length; i++) {
          let resultCaller = blockchain_result[i]["returnValues"]["_caller"]
            .toString()
            .replace(/\s/g, "");
          var boolCheck =
            resultCaller.toString().trim().toLowerCase() ===
            _caller.toString().trim().toLowerCase();
          if (boolCheck) {
            console.log(blockchain_result[i]);
            res.status(200).json(blockchain_result[i]);
            return;
          }
        }
        res.status(400).json("No event emitted");
        return;
      });
  } catch (err) {
    console.log(err);
    logs = {
      field: "Blockchain Unknown Error",
      message: err,
    };
    res.status(400).json(logs);
    return { logs };
  }
};

const _getAcoinTotalSupply = async (req, res) => {

  const _caller = req.body.caller;
  let logs;

  try {
    const divisibleNftsContract = new (web3()).eth.Contract(
      DivisibleNftsABI.abi,
      process.env.DIVISIBLE_NFTS_ADDRESS,
      {}
    );
    var encodedData = divisibleNftsContract.methods
      .getAcoinTotalSupply(_caller)
      .encodeABI();
    
    const transactionParam = {
      to: process.env.DIVISIBLE_NFTS_ADDRESS,
      // gas: '0x76c0', // 30400
      // gasPrice: '0x9184e72a000', // 10000000000000
      // value: encodedValue,
      data: encodedData,
    };

    await web3()
      .eth.accounts.signTransaction(
        transactionParam,
        process.env.OWNER_PRIVATE_KEY
      )
      .then((signed) => {
        web3()
          .eth.sendSignedTransaction(signed.rawTransaction)
          .then(function (blockchain_result, events) {
            console.log(blockchain_result);
            logs = {
              blockchain_result,
            };
          });
      })
      .catch((err) => {
        console.log(err);
        logs = {
          field: "Blockchain Error",
          message: err,
        };

        res.status(400).json(logs);
        return { logs };
      });

    await divisibleNftsContract
      .getPastEvents("getAcoinTotalSupplyEvent", {
        fromBlock: blockNumber - 5,
        toBlock: "latest",
      })
      .then(function (blockchain_result) {
        for (let i = 0; i < blockchain_result.length; i++) {
          let resultCaller = blockchain_result[i]["returnValues"]["_caller"]
            .toString()
            .replace(/\s/g, "");
          var boolCheck =
            resultCaller.toString().trim().toLowerCase() ===
            _caller.toString().trim().toLowerCase();
          if (boolCheck) {
            console.log(blockchain_result[i]);
            res.status(200).json(blockchain_result[i]);
            return;
          }
        }
        res.status(400).json("No event emitted");
        return;
      });
  } catch (err) {
    console.log(err);
    logs = {
      field: "Blockchain Unknown Error",
      message: err,
    };
    res.status(400).json(logs);
    return { logs };
  }

};

const _acoinBalanceOfTemp = async (req, res) => {
  console.log(req.body);
  const _account = req.body.account;
  const _caller = req.body.caller;
  let logs;

  try {
    const divisibleNftsContract = new (web3()).eth.Contract(
      DivisibleNftsABI.abi,
      process.env.DIVISIBLE_NFTS_ADDRESS,
      {}
    );
    var encodedData = divisibleNftsContract.methods
      .acoinBalanceOf(_account, _caller)
      .encodeABI();

      
      // var encodedGas = web3().utils.toHex(
      //   web3().utils.toWei("108250", "gwei")
      // );
    var block = await (web3()).eth.getBlock("latest");
    var blockNumber = await web3().eth.getBlockNumber()
    // console.log((Math.round(block.gasLimit / block.transactions.length)))
    // var encodedGas = web3().utils.toHex(web3().utils.fromWei((Math.round(block.gasLimit / block.transactions.length)).toString(), "ether"));
    var encodedGas = Math.round(block.gasLimit / block.transactions.length)
    const nonce = await web3().eth.getTransactionCount(process.env.OWNER_ADDRESS, 'pending');
    
    await divisibleNftsContract.methods.acoinBalanceOf(_account, _caller).estimateGas(
        {
            from: process.env.OWNER_ADDRESS,
            gasPrice: await web3().eth.getGasPrice()
        }, function(error, estimatedGas) {
          encodedGas = estimatedGas.toString();
        }
    )
    // console.log(encodedGas)
    const transactionParam = {
      nonce: nonce,
      from: process.env.OWNER_ADDRESS,
      to: process.env.DIVISIBLE_NFTS_ADDRESS,
      gas: encodedGas,
      // gasPrice: '0x9184e72a000', // 10000000000000
      gasPrice: await web3().eth.getGasPrice(),
      // value: encodedValue,
      data: encodedData,
    };

    await web3()
      .eth.accounts.signTransaction(
        transactionParam,
        process.env.OWNER_PRIVATE_KEY
      )
      .then((signed) => {
        web3()
          .eth.sendSignedTransaction(signed.rawTransaction)
          .then(function (blockchain_result, events) {
            // console.log(blockchain_result);
            logs = {
              blockchain_result,
            };
          });
      }).then( async() => {
        let blockchain_result = await divisibleNftsContract
      .getPastEvents("acoinBalanceOfEvent", {
        fromBlock: blockNumber - 15,
        toBlock: "latest",
      })
      // console.log( blockchain_result)
      
        for (let i = 0; i < blockchain_result.length; i++) {
          let resultCaller = blockchain_result[i]["returnValues"]["_caller"]
            .toString()
            .replace(/\s/g, "");
          var boolCheck = true
            // resultCaller.toString().trim().toLowerCase() ===
            // _caller.toString().trim().toLowerCase();
          if (boolCheck) {
            console.log(blockchain_result[i]);
            res.status(200).json(blockchain_result[i]);
            return;
          }
          
        }
        res.status(400).json("No event emitted");
        return;
      })
      .catch((err) => {
        console.log(err);
        logs = {
          field: "Blockchain Error",
          message: err,
        };

        res.status(400).json(logs);
        return { logs };
      });

    
  } catch (err) {
    console.log(err);
    logs = {
      field: "Blockchain Unknown Error",
      message: err,
    };
    res.status(400).json(logs);
    return { logs };
  }

};

const _acoinBalanceOf = async (req, res) => {
  const _account = req.body.account;
  const response = await Moralis.EvmApi.utils.runContractFunction({
    address:process.env.DIVISIBLE_NFTS_ADDRESS,
    functionName: "acoinBalanceOf",
    abi: DivisibleNftsABI.abi,
    chain: 80001,
    params: {
        acoinOwner: _account
    }
  })
  console.log(response);
  res.status(200).json(response);
  return

}

module.exports = {
  _buyACoin,
  _burnACoin,
  _transferACoin,
  _getAcoinTotalSupply,
  _acoinBalanceOf,
  _buyACoinEvent
};
// # sourceMappingURL=ACoinController.js.map
