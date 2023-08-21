const express = require("express");
const cors = require("cors");
const {userRouter} = require("./routes/userRoutes");
const {postRouter} = require("./routes/postRoutes");
const {auth} = require("./middleware/authMiddleware");
// const {connection} = require("./db")
const mongoose = require("mongoose")
require("dotenv").config();

const app = express();
app.use(express.json())
app.use(cors())
app.use("/users",userRouter)
app.use("/posts",auth,postRouter)
const connect = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URL);
      console.log("connected");
    } catch (error) {
      console.log(error);
    }
  };
  
  app.listen(process.env.PORT, () => {
    connect();
    console.log("Listening on PORT and connected to data base");
  });
