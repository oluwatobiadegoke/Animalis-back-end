//LIBRARY IMPORTS
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

//ROUTE IMPORTS
const auth = require("./routes/auth");
const posts = require("./routes/posts");
const user = require("./routes/user");

//DIRECTORY IMPORTS
const connectDB = require("./db/connect");
const notFound = require("./errors/notFound");
const verifyToken = require("./middlewares/authentication");

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/api/v1/auth", auth);
app.use("/api/v1/posts", verifyToken, posts);
app.use("/api/v1/users", verifyToken, user);
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
