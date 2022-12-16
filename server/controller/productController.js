const Sneaks_API = require("sneaks-api");
const sneaks = new Sneaks_API();
const Products = require("../models/Product");


// get popular shoes
exports.getPopular = async (req, res) => {
  try {
    sneaks.getMostPopular(8, (err, products) => {
      if (err) throw err;
      res.status(200).send({
        success: true,
        message: "products found",
        products,
      })
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error processing request",
      error,
    })
  }
}


// search shoes
// get many shoes with query
exports.getProducts = async (req, res) => {
  try {
    // a req query containing a search query
    const { q } = await req.query;
    const query = decodeURI(q);
    sneaks.getProducts(query, 14, (err, products) => {
      if (err) throw err;
      res.status(200).send({
        success: true,
        message: "correctly processed request",
        products,
      });
    })

  } catch (error) {
    console.error(error)
    res.status(500).send({
      success: false,
      message: "error processing request",
      error,
    })
  }
}

exports.getProductComments = async (req, res) => {
  try {
    const { id } = await req.query;
    Products.findOne({ sneaks_id: id })
      // execute if it has been saved previously
      .then(details => {
        if (!details) throw new Error("create reference first")
        res.status(200).send({
          success: true,
          message: "success getting product details",
          details,
        })
      })
      // execute if it hasn't been saved previously
      .catch(err => {
        if (!id) throw err;
        const details = new Products({
          sneaks_id: id,
          product_comments: [],
        })
        details.save((err, details) => {
          if (err) throw err;
          res.status(200).send({
            success: true,
            message: "saved product in db",
            details,
          })
        });
      })

  } catch (error) {
    console.error(error)
    res.status(500).send({
      success: false,
      message: "error processing request",
      error,
    })
  }
}

exports.addProductComment = async (req, res) => {
  try {
    const { id } = await req.query;
    const { comment } = await req.body;
	if (!comment) throw new Error("comment cannot be falsy");
    Products.findOne({ sneaks_id: id })
      .then(product => {
        if (!product) throw new Error("error getting product");
        product.product_comments.push(comment);
        product.save((err, product) => {
          if (err) throw err;
          res.status(200).send({
            success: true,
            message: "comment added",
            details: product
          })
        })
      })
      .catch(e => {
        res.status(404).send({
          success: false,
          message: "an error occured",
          error: e
        })
      })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error processing request",
      error,
    })
  }
}
