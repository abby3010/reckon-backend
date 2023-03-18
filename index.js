const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const connectDB = require("./configs/mongodb_config");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./connection");
const { web3, web3config } = require("./web3");
const Web3 = require("web3");
const Moralis = require("moralis").default;

const main = async () => {
  // Mongoose Connection
  const con = await connectDB();
  
  
  try {
    // console.log(await web3.eth.getBlockNumber());
    // const webya = Web3(web3T)
    web3config(con).then(async() => {
      try {
        console.log(await (web3()).eth.getBlockNumber()); 
        Moralis.start({
          apiKey: process.env.MORALIS_KEY
        }).then(async(result)=>{console.log("Web3 Connected")})
      } catch(e) {
        console.log(e)
      }
    })
    // console.log(await (web3(_web3.web3_link)).eth.getBlockNumber());
    // const _balance = 
    // console.log(_balance)
    
  } catch (err) {
    console.log("Change the ngrok link! ", err);
  }



  

  app.use(express.json());
  app.use(helmet());
  app.use(bodyParser.json());
  app.use(
    cors({
      origin: [process.env.CLIENT_URL, "*"],
      credentials: true,
    })
  );

  app.set("trust proxy", 1);

  // Logger
  app.use(morgan("common"));

  // Importing Routes
  const authRoute = require("./routes/auth.routes");
  const adminRoute = require("./routes/admin.routes");
  const nftRoutes = require("./routes/nft.routes");
  const tradingRoutes = require("./routes/stockMarket.routes")
  // const ACoinRoutes = require('./routes/ACoinRoutes');
  app.use(require("./routes/ACoinRoutes"));
  app.use(require("./routes/DivisibleNFTRoutes"));

  app.use("/api/admin", adminRoute);

  // Route Middlewares
  app.use("/api/auth", authRoute);

  app.use("/api/trade", tradingRoutes);

  app.use("/api/nft", nftRoutes);

  // Serve static assets if in production
  app.use("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/express/index.html"));
    //__dirname : It will resolve to your project folder.
  });

  // await connection.connectToServer(async function (err, client) {
  //   if (err) console.log(err);
  //   console.log("Database Connected");
  //   try {
  //     let bc_conn = await web3.connectToServer(function () {
  //       console.log("Connection Successful");
  //     })
  //     console.log(bc_conn)
  //   }
  //   catch (error) {
  //     console.log("Connection Error! ", error);
  //   }
  //   // Querying the Blockchain using the Provider and Web3.js
  //   console.log("Latest Block Number: ");
  //   try {
  //     console.log(await web3.getWeb3().eth.getBlockNumber());
  //   } catch (err) {
  //     console.log("Change the ngrok link! ", err);
  //   }
  // });
  

  // PORT
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Server running on port: ${port}`));
};

main().catch((e) => {
  console.log(e);
});
