const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 6969;
const dbConnect = require("./config/database");
const authRouter = require("./routes/authRouter");

const MONGO_URI = process.env.MONGO_URI;

dbConnect(MONGO_URI);

app.use(express.json());

app.use('/auth', authRouter)

app.use('/', (req, res) => {
  res.send('req received');
})

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`)
})