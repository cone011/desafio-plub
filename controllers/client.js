const Client = require("../models/client");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const { validationResult } = require("express-validator");

exports.getAllClient = async (req, res, next) => {
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

    const totalClients = await Client.find().countDocuments();
    const clients = await Client.find()
      .select("_id name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);
    res
      .status(200)
      .json({ message: "OK", clients: clients, totalClients: totalClients });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getClientById = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Error in the data");
      error.data = errors.array();
      error.statusCode = 422;
      throw error;
    }

    const clientId = req.params.clientId;

    const clientItem = await Client.findOne({
      _id: new ObjectId(clientId),
    }).select("_id name email");

    res.status(200).json({ message: "OK", clientItem: clientItem });
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

    const clientSearch = req.query.clientSearch;
    const perPage = req.query.perPage;
    const page = req.query.page;

    const totalClients = await Client.find({
      name: { $regex: clientSearch },
    }).countDocuments();

    const clients = await Client.find({ name: { $regex: clientSearch } })
      .select("_id name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);
    res
      .status(200)
      .json({ message: "OK", clients: clients, totalClients: totalClients });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.insertClient = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Error in the data");
      error.data = errors.array();
      error.statusCode = 422;
      throw error;
    }

    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const address = req.body.address;
    const userId = req.userId;

    const clientItem = new Client({
      name: name,
      email: email,
      phone: phone,
      address: address,
      userId: userId,
    });

    const result = await clientItem.save();

    res
      .status(201)
      .json({ message: "OK", isSaved: true, clientId: result._id.toString() });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.updateClient = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Error in the data");
      error.data = errors.array();
      error.statusCode = 422;
      throw error;
    }

    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const address = req.body.address;
    const userId = req.userId;
    const clientId = req.params.clientId;

    await Client.updateOne(
      { _id: new ObjectId(clientId) },
      {
        $set: {
          name: name,
          email: email,
          phone: phone,
          address: address,
          userId: userId,
        },
      }
    );

    res
      .status(201)
      .json({ message: "OK", isSaved: true, clientId: clientId.toString() });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.deleteClient = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Error in the data");
      error.data = errors.array();
      error.statusCode = 422;
      throw error;
    }

    const clientId = req.params.clientId;

    await Client.deleteOne({ _id: new ObjectId(clientId) });

    res.status(201).json({ messsage: "OK", isDeleted: true });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
