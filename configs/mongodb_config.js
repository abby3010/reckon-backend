const mongoose = require("mongoose");

module.exports = connnectDB = async () => {
  try {
    return await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connnected: ${con.connection.host}`);
    const web3 = await con.connection.db.collection('config').findOne({_id: 'web3'})
    console.log(web3)
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
