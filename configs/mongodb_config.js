const mongoose = require("mongoose");

module.exports = connnectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connnected: ${con.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
