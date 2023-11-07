const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/users");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

exports.getAllUsers = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Error in the data");
      error.data = errors.array();
      error.statusCode = 422;
      throw error;
    }

    const currentPage = req.query.page;
    const perPage = req.query.perPage;

    const totalUsers = await User.find().countDocuments();

    const users = await User.find()
      .select("_id email name phone")
      .sort({ createAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res
      .status(200)
      .json({ message: "OK", totalUsers: totalUsers, users: users });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Error in the data");
      error.data = errors.array();
      error.statusCode = 422;
      throw error;
    }

    const userId = req.params.userId;

    const userItem = await User.findOne({ _id: new ObjectId(userId) }).select(
      "_id email name phone"
    );

    res.status(200).json({ message: "OK", user: userItem });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.insertUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Error in the data");
      error.data = errors.array();
      error.statusCode = 422;
      throw error;
    }

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const phone = req.body.phone;

    const hassPass = await bcryptjs.hash(password, 12);

    const userItem = new User({
      email: email,
      password: hassPass,
      name: name,
      phone: phone,
    });

    const result = await userItem.save();

    res.status(201).json({ message: "OK", userId: result.id.toString() });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Error in the data");
      error.data = errors.array();
      error.statusCode = 422;
      throw error;
    }

    const email = req.body.email;
    const password = req.body.password;

    const userFound = await User.findOne({ email: email });
    if (!userFound) {
      const error = new Error(
        "The user with this email are not register, please sign in!"
      );
      error.statusCode = 401;
      throw error;
    }
    const isEqual = bcryptjs.compare(password, userFound.password);
    if (!isEqual) {
      const error = new Error("Invalid password!");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      { email: userFound.email, userId: userFound._id.toString() },
      `${process.env.JWT_TOKEN}`,
      { expiresIn: `${process.env.TOKEN_EXPIRATION}` }
    );

    req.session.isLoggedIn = true;
    req.session.user = email;

    res.status(200).json({ message: "OK", token: token });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Error in the data");
      error.data = errors.array();
      error.statusCode = 422;
      throw error;
    }

    const password = req.body.password;
    const userId = req.params.userId;

    const userFound = await User.findById(userId);

    const isEqual = await bcryptjs.compare(password, userFound.password);

    if (isEqual) {
      const error = new Error(
        "The password are the same, please select another one"
      );
      error.statusCode = 401;
      throw error;
    }

    const hassPass = await bcryptjs.hash(password, 12);

    await User.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password: hassPass } }
    );

    res.status(201).json({ message: "OK", isReseted: true });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.logOut = async (req, res, next) => {
  try {
    if (!req.session) {
      const error = new Error("There is no session active");
      error.statusCode = 422;
      throw error;
    }

    req.session.destroy();
    res.status(200).json({ message: "User has been logged out" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Error in the data");
      error.data = errors.array();
      error.statusCode = 422;
      throw error;
    }

    const email = req.body.email;
    const name = req.body.name;
    const phone = req.body.phone;
    const userId = req.params.userId;

    const userItem = await User.findById(userId);

    userItem.email = email;
    userItem.name = name;
    userItem.phone = phone;

    await userItem.save();

    res.status(201).json({ message: "OK", userId: userId });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Error in the data");
      error.data = errors.array();
      error.statusCode = 422;
      throw error;
    }

    const userId = req.params.userId;

    await User.deleteOne({ _id: new ObjectId(userId) });

    res.status(201).json({ message: "OK", isDeleted: true });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
