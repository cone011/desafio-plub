const express = require("express");
const router = express.Router();
const { check, param, body, query } = require("express-validator");
const isAuth = require("../middleware/isAuth");
const product = require("../controllers/product");
const Product = require("../models/product");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

router.get(
  "/product",
  isAuth,
  [
    query(
      "perPage",
      "Please select at least the amount of register you wanna show"
    ).isNumeric({ min: 1 }),
    query("page", "Please select at least a page ").isNumeric({
      min: 1,
    }),
  ],
  product.getAllProducts
);

router.get(
  "/product/:productId",
  isAuth,
  [
    param("productId", "Please select at least a product")
      .trim()
      .isLength({ min: 1 }),
  ],
  product.getProductById
);

router.get(
  "/search/product",
  isAuth,
  [
    query("productSearch", "Please enter at least of min 3 character")
      .trim()
      .isLength({ min: 3 }),
    query(
      "perPage",
      "Please select at least the amount of register you wanna show"
    ).isNumeric({ min: 1 }),
    query("page", "Please select at least a page ").isNumeric({
      min: 1,
    }),
  ],
  product.getSearchClient
);

router.post(
  "/product",
  isAuth,
  [
    body("title", "Please enter a title").trim().isLength({ min: 5 }),
    check("price")
      .isInt({ min: 1 })
      .withMessage("The price must be greater than one"),
  ],
  product.insertProduct
);

router.put(
  "/product/:productId",
  isAuth,
  [
    body("title", "Please enter a title").trim().isLength({ min: 5 }),
    check("price")
      .isInt({ min: 1 })
      .withMessage("The price must be greater than one"),
    check("productId").custom(async (value, { req }) => {
      try {
        const productFound = await Product.findOne({
          _id: new ObjectId(value),
        });
        if (!productFound) {
          const error = new Error("This product dont exist anyomore");
          error.statusCode = 422;
          throw error;
        }
        return true;
      } catch (err) {
        ErrorHandler(err, next);
      }
    }),
  ],
  product.updateProduct
);

router.delete(
  "/product/:productId",
  isAuth,
  [
    check("productId").custom(async (value, { req }) => {
      try {
        const productFound = await Product.findOne({
          _id: new ObjectId(value),
        });
        if (!productFound) {
          const error = new Error("This product dont exist anyomore");
          error.statusCode = 422;
          throw error;
        }
        return true;
      } catch (err) {
        ErrorHandler(err, next);
      }
    }),
  ],
  product.deleteProduct
);

module.exports = router;
