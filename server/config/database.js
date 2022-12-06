const mongoose = require("mongoose");
mongoose.set('strictQuery', true);

async function dbConnect(uri) {
  try {
    await mongoose.connect(uri, {}).then((value) => {
      console.log('connected to mongodb')
    })
  } catch (error) {
    console.error(error);
  }
}

module.exports = dbConnect;