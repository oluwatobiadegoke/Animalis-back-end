require("dotenv").config();
require("express-async-errors");
//LIBRARY IMPORTS
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const xss = require("xss-clean");

//ROUTE IMPORTS
const auth = require("./routes/auth");
const posts = require("./routes/posts");
const user = require("./routes/user");
const uploadMedia = require("./routes/uploadMedia");

//DIRECTORY IMPORTS
const connectDB = require("./db/connect");
const notFound = require("./errors/notFound");
const verifyToken = require("./middlewares/authentication");

const port = process.env.PORT || 8000;

app.use(cookieParser(`${process.env.COOKIE_SECRET}`));
const whitelist = ["http://localhost:3000", "https://animalkgdm.netlify.app/"];
const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (whitelist.includes(origin)) return callback(null, true);

    callback(new Error("Not allowed by CORS"));
  },
};
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(xss());
app.use("/api/v1/auth", auth);
app.use("/api/v1/posts", verifyToken, posts);
app.use("/api/v1/users", verifyToken, user);
app.use("/api/v1/upload", verifyToken, uploadMedia);
app.use(notFound);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
