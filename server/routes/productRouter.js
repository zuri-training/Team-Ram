
const controller = require("../controller/productController");
const router = require("express").Router();

router
  // get popular products
  .get("/popular", controller.getPopular)
  // expects a search query in the form /search?q=<shoe name>
  .get("/search", controller.getProducts)
  // expects a search query in the form of /details?id=<style id>
  .get("/details", controller.getProductComments)
  // expects a search query in the form of /details?id=<style id>
  // expects a comment object in the body in the form of
  // body: {comment: {user, content}}
  .put("/comments", controller.addProductComment)
module.exports = router;