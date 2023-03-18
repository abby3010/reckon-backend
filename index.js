const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const connectDB = require("./configs/mongodb_config");
const path = require("path");
const app = express();
const bodyParser = require('body-parser');
// Mongoose Connection
connectDB();

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
const nftRoutes = require('./routes/nft.routes')

app.use("/api/admin", adminRoute);

// Route Middlewares
app.use("/api/auth", authRoute);

app.use("/api/nft", nftRoutes);

// Serve static assets if in production
app.use("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/express/index.html"));
  //__dirname : It will resolve to your project folder.
});

// PORT
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port: ${port}`));
