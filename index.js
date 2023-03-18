const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const connectDB = require("./configs/mongodb_config");
const path = require("path");
// const passport = require("passport");
// const expressSession = require("express-session");
// const MongoStore = require("connect-mongo");

const app = express();

// Mongoose Connection
connectDB();

app.use(express.json());
app.use(helmet());

app.use(
  cors({
    origin: [process.env.CLIENT_URL, "*"],
    credentials: true,
  })
);

app.set("trust proxy", 1);

// Logger
app.use(morgan("common"));

// app.use(
//   expressSession({
//     secret: "hQSjNdMPob5j+Z3jfaHg6vKn1Hr0vqVd",
//     resave: true,
//     saveUninitialized: true,
//     cookie: {
//       // Session expires after 24 hrs of inactivity.
//       maxAge: 60 * 60 * 24 * 1000,
//       sameSite: "none",
//       secure: process.env.NODE_ENV === "production" ? true : false,
//     },
//     store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
//   })
// );

// app.use(cookieSession({
// 	name: 'session',
// 	keys: ['asthetech_website_private_key_3010'],
// 	maxAge: 24 * 60 * 60 * 1000 // 24 hours
// }));

// app.use(passport.initialize());
// app.use(passport.session());

// Importing Routes
const authRoute = require("./routes/auth.routes");

// app.use("/api/middleware", middlewareRoute);

// Route Middlewares
app.use("/api/auth", authRoute);

// Serve static assets if in production
app.use("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/express/index.html"));
  //__dirname : It will resolve to your project folder.
});

// PORT
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port: ${port}`));
