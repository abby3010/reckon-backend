const { default: mongoose } = require("mongoose");
const { dynamicBuyOrderModel, dynamicSellOrderModel, dynamicConfirmedOrderModel } = require("../model/stock.model");
const { web3 } = require("../web3");
// const { web3 } = require('../web3')

async function transferTokensWithId(_from, _to, _tokenId, _units) {

    let result = null;

    const divisibleNftsContract = new (web3()).eth.Contract(DivisibleNftsABI.abi, process.env.DIVISIBLE_NFTS_ADDRESS, {});
    await divisibleNftsContract.methods.transferToken(_from, _to, _tokenId, _units).send({ from: process.env.OWNER_ADDRESS, gasPrice: '3000000' })
        .then(function (blockchain_result) {
            console.log(blockchain_result);
            logs = {
                from: blockchain_result.events.transferEvent.returnValues._from,
                to: blockchain_result.events.transferEvent.returnValues._to,
                tokenId: blockchain_result.events.transferEvent.returnValues._tokenId,
                units: blockchain_result.events.transferEvent.returnValues._units,
                message: blockchain_result.events.transferEvent.returnValues._message,
            };
            result = logs;
            return;
        }).catch((err) => {
            console.log(err);
            logs = {
                field: "Blockchain Error",
                message: err,
            };
            result = logs;
            return;
        });

    return result;
}

async function checkAndExecuteBuyOrderIfAnySellOrderExists(nftId, shares, price, userAddress) {
    try {
        // Check if there is any sell order for the given NFT
        var findSellOrder = await mongoose.connection.useDb(nftId).collection("sell").findOne({ price: price, quantity: shares });
        console.log(findSellOrder);
        let sellerId = null;
        if (findSellOrder) {
            sellerId = findSellOrder.userId;
        }

        console.log("SellerId", sellerId);
        if (sellerId !== null) {
            // If yes, then execute the buy order
            var executeOrder = async () => {
                await mongoose.connection.useDb(nftId).collection("buy").deleteOne({ price: price, quantity: shares, userId: userAddress });
                await mongoose.connection.useDb(nftId).collection("sell").deleteOne({ price: price, quantity: shares, userId: sellerId });
                await dynamicConfirmedOrderModel(nftId).create({ price: price, quantity: shares, buyerId: userAddress, sellerId: sellerId });
                // Call blockchain code to transfer the shares to the user's wallet
                // await transferTokensWithId(sellerId, userAddress, nftId, shares);
            }
            executeOrder();
            return {
                message: "Buy order executed successfully!",
                success: true
            };
        }

        // If no, then place the buy order
        await dynamicBuyOrderModel(nftId).create({ price: price, quantity: shares, userId: userAddress });
        return {
            message: "Buy order placed successfully!",
            success: true
        };
    } catch (err) {
        console.log(err);
        return {
            message: "Something went wrong!",
            success: false
        };
    }
}




async function checkAndExecuteSellOrderIfAnyBuyOrderExists(nftId, shares, price, userAddress) {
    try {
        // Check if there is any sell order for the given NFT
        var findBuyOrder = await mongoose.connection.useDb(nftId).collection("buy").findOne({ price: price, quantity: shares });
        console.log(findBuyOrder);
        let buyerId = null;
        if (findBuyOrder !== null && findBuyOrder !== undefined) {
            if (findBuyOrder.length > 0) {
                buyerId = findBuyOrder.userId;
            }
        }

        if (buyerId !== null) {
            // If yes, then execute the buy order
            var executeOrder = async () => {
                await mongoose.connection.useDb(nftId).collection("buy").deleteOne({ price: price, quantity: shares, userId: buyerId });
                await mongoose.connection.useDb(nftId).collection("sell").deleteOne({ price: price, quantity: shares, userId: userAddress });
                await dynamicConfirmedOrderModel(nftId).create({ price: price, quantity: shares, buyerId: buyerId, sellerId: userAddress });
                // Call blockchain code to transfer the shares to the user's wallet
                // await transferTokensWithId(userAddress, buyerId, nftId, shares);
            }
            executeOrder();
            return {
                message: "Sell order executed successfully!",
                success: true
            };
        }

        // If no, then place the buy order
        await dynamicSellOrderModel(nftId).create({ price: price, quantity: shares, userId: userAddress });
        return {
            message: "Sell order placed successfully!",
            success: true
        };
    }
    catch (err) {
        console.log(err);
        return {
            message: "Something went wrong!",
            success: false
        }
    }
}



module.exports = { checkAndExecuteBuyOrderIfAnySellOrderExists, checkAndExecuteSellOrderIfAnyBuyOrderExists }