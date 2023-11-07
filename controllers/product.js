const { validationResult } = require("express-validator");
const Product = require("../models/product");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

exports.getAllProducts = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Error in the data");
      error.data = errors.array();
      error.statusCode = 422;
      throw error;
    }

    const page = req.query.page;
    const perPage = req.query.perPage;

    const totalProducts = await Product.find().countDocuments();

    const products = await Product.find()
      .select("_id title price")
      .sort({ createAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      message: "OK",
      totalProducts: totalProducts,
      products: products,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Error in the data");
      error.data = errors.array();
      error.statusCode = 422;
      throw error;
    }

    const productId = req.params.productId;

    const productItem = await Product.findOne({
      _id: new ObjectId(productId),
    }).select("_id title price");

    res.status(200).json({ message: "OK", product: productItem });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getSearchClient = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Error in the data");
      error.data = errors.array();
      error.statusCode = 422;
      throw error;
    }

    const productSearch = req.query.productSearch;
    const perPage = req.query.perPage;
    const page = req.query.page;

    const totalProducts = await Product.find({
      title: { $regex: productSearch },
    }).countDocuments();

    const products = await Product.find({
      title: { $regex: productSearch },
    })
      .select("_id title price")
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      message: "OK",
      products: products,
      totalProducts: totalProducts,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.insertProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Error in the data");
      error.data = errors.array();
      error.statusCode = 422;
      throw error;
    }

    const title = req.body.title;
    const price = req.body.price;
    const userId = req.userId;

    const productItem = new Product({
      title: title,
      price: price,
      creator: userId,
    });

    const result = await productItem.save();

    res.status(201).json({ message: "OK", isSave: true, productId: result.id });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Error in the data");
      error.data = errors.array();
      error.statusCode = 422;
      throw error;
    }

    const title = req.body.title;
    const price = req.body.price;
    const userId = req.userId;
    const productId = req.params.productId;

    const productItem = {
      title: title,
      price: price,
      userId: userId,
    };

    await Product.updateOne(
      { _id: new ObjectId(productId) },
      { $set: productItem }
    );

    res.status(201).json({ message: "OK", isSave: true, productId: productId });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Error in the data");
      error.data = errors.array();
      error.statusCode = 422;
      throw error;
    }

    const productId = req.params.productId;

    await Product.deleteOne({ _id: new ObjectId(productId) });

    res.status(201).json({ message: "OK", isDeleted: true });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
