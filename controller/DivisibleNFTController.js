const { web3, DivisibleNftsABI } = require("../web3");

const _mint = async (req, res) => {
  const _owner = req.body.owner;
  const _tokenId = req.body.tokenId;
  const _noOfShares = req.body.noOfShares;
  const _caller = req.body.caller;
  let logs;

  try {
    const divisibleNftsContract = new (web3().eth.Contract)(
      DivisibleNftsABI.abi,
      process.env.DIVISIBLE_NFTS_ADDRESS,
      {}
    );
    var encodedData = divisibleNftsContract.methods
      .mint(_owner, _tokenId, _noOfShares, _caller)
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
      .getPastEvents("mintEvent", {
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

const _transferToken = async (req, res) => {
  const _from = req.body.from;
  const _to = req.body.to;
  const _tokenId = req.body.tokenId;
  const _units = req.body.units;
  const _caller = req.body.caller;
  let logs;

  try {
    const divisibleNftsContract = new (web3().eth.Contract)(
      DivisibleNftsABI.abi,
      process.env.DIVISIBLE_NFTS_ADDRESS,
      {}
    );
    var encodedData = divisibleNftsContract.methods
      .transferToken(_from, _to, _tokenId, _units, _caller)
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
      .getPastEvents("transferTokenEvent", {
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

const _unitsOwnedOfAToken = async (req, res) => {
  const _owner = req.body.owner;
  const _tokenId = req.body.tokenId;
  const _caller = req.body.caller;
  let logs;

  try {
    const divisibleNftsContract = new (web3().eth.Contract)(
      DivisibleNftsABI.abi,
      process.env.DIVISIBLE_NFTS_ADDRESS,
      {}
    );
    var encodedData = divisibleNftsContract.methods
      .unitsOwnedOfAToken(_owner, _tokenId, _caller)
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
      .getPastEvents("unitsOwnedOfATokenEvent", {
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

const _divisibilityOfAToken = async (req, res) => {
  const _tokenId = req.body.tokenId;
  const _caller = req.body.caller;
  let logs;

  try {
    const divisibleNftsContract = new (web3().eth.Contract)(
      DivisibleNftsABI.abi,
      process.env.DIVISIBLE_NFTS_ADDRESS,
      {}
    );
    var encodedData = divisibleNftsContract.methods
      .divisibilityOfAToken(_tokenId, _caller)
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
      .getPastEvents("divisibilityEvent", {
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

const _totalSupplyView = async (req, res) => {
  const _caller = req.body.caller;
  let logs;

  try {
    const divisibleNftsContract = new (web3().eth.Contract)(
      DivisibleNftsABI.abi,
      process.env.DIVISIBLE_NFTS_ADDRESS,
      {}
    );
    var encodedData = divisibleNftsContract.methods
      .totalSupplyView(_caller)
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
      .getPastEvents("totalSupplyEvent", {
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

module.exports = {
  _mint,
  _transferToken,
  _unitsOwnedOfAToken,
  _divisibilityOfAToken,
  _totalSupplyView,
  
};
//# sourceMappingURL=DivisibleNFTController.js.map
