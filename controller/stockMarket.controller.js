const { dynamicBuyOrderModel } = require("../model/stock.model");
const stockMarketService = require("../services/stockMarket");
const User = require("../model/user.model");

async function placeBuyOrderForNFTShare(req, res) {
    const { nftId, shares, price, userAddress } = req.body;
    console.log(req.body);
    if (!nftId || !shares || !price) {
        return res.status(400).json({
            error: "Invalid Data",
        });
    }

    // TODO: Check if the user has enough balance to buy the shares
    // let userBalance = await checkUserBalance(userId, price);
    // if (userBalance < price) {           // ---> assuming that this condition is false
    //     return callback("Insufficient Balance");
    // }
    // var data = await dynamicBuyOrderModel(nftId).create({
    //     quantity: shares, price, userId: userAddress
    // });

    var result = await stockMarketService.checkAndExecuteBuyOrderIfAnySellOrderExists(nftId, shares, price, userAddress);

    // TODO: Deduct the user balance
    // TODO: Add the shares to the user's wallet
    // TODO: Invoke Blockchain code to transfer the shares to the user's wallet

    return res.status(200).json({
        result: result,
    });
}

async function placeSellOrderForNFTShare(req, res) {
    const { nftId, shares, price, userAddress } = req.body;
    if (!nftId || !shares || !price) {
        return res.status(400).json({
            error: "Invalid Data",
        });
    }
    var result = await stockMarketService.checkAndExecuteSellOrderIfAnyBuyOrderExists(nftId, shares, price, userAddress);

    return res.status(200).json({
        result: result,
    });
}

function getCurrentPriceOfNFTShare(req, res) {
    const { nftId } = req.body;
    if (!nftId) {
        return res.status(400).json({
            error: "Invalid Data",
        });
    }
    stockMarketService.getCurrentPriceOfNFTShare(nftId, (err, data) => {
        if (err) {
            return res.status(400).json({
                error: err,
            });
        }
        return res.status(200).json({
            message: "Current Price of NFT Share",
            success: true,
            data: data,
        });
    });
}

const saveShareExchangeHistoryToUserDoc = async (req, res) => {
    const { ticker_symbol, quantity, price, buyerId, order_type, email } = req.body;

    let exchangeData = {
        ticker_symbol,
        quantity,
        price,
        buyerId,
        order_type
    };

    let result =
        await User.findOneAndUpdate({
            email: email
        }, {
            $push: {
                trades: {
                    exchangeData
                }
            }
        });

    return res.status(200).json({
        result: result,
    })
}


module.exports = { saveShareExchangeHistoryToUserDoc, placeBuyOrderForNFTShare, placeSellOrderForNFTShare, getCurrentPriceOfNFTShare }