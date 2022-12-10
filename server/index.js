const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 6969;
const dbConnect = require("./config/database");
const authRouter = require("./routes/authRouter");
const productRouter = require("./routes/productRouter")
const userRouter = require("./routes/userRouter");
const cors = require("cors");

const MONGO_URI = process.env.MONGO_URI;

dbConnect(MONGO_URI);

app.use(cors(), express.json());

app.use('/auth', authRouter)

app.use('/user', userRouter)

app.use('/products', productRouter)

app.use('/', (req, res) => {
  res.send('req received');
})

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`)
})
