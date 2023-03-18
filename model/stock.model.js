const mongoose = require("mongoose");
// const { ObjectId } = mongoose.Schema;

const dynamicBuyOrderModel = (databaseName) => {
    const buyTransactionSchema = new mongoose.Schema(
        {
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            userId: {
                type: String,
                required: true,
            },
        },
        { timestamps: true } // createdAt, updatedAt timestamps will be taken care of by this automatically
    );

    const conn = mongoose.connection.useDb(databaseName);

    return conn.model("buy", buyTransactionSchema, "buy");
}

const dynamicSellOrderModel = (databaseName) => {
    const sellTransactionSchema = new mongoose.Schema(
        {
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            userId: {
                type: String,
                required: true,
            },
        },
        { timestamps: true } // createdAt, updatedAt timestamps will be taken care of by this automatically
    );

    const conn = mongoose.connection.useDb(databaseName);

    return conn.model("sell", sellTransactionSchema, "sell");
}

const dynamicConfirmedOrderModel = (databaseName) => {
    const confirmedTransactionSchema = new mongoose.Schema(
        {
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            buyerId: {
                type: String,
                required: true,
            },
            sellerId: {
                type: String,
                required: true,
            }
        },
        { timestamps: true } // createdAt, updatedAt timestamps will be taken care of by this automatically
    );

    const conn = mongoose.connection.useDb(databaseName);

    return conn.model("confirmed", confirmedTransactionSchema, "confirmed");
}

module.exports = { dynamicBuyOrderModel, dynamicSellOrderModel, dynamicConfirmedOrderModel }