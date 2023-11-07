const express = require("express");
const router = express.Router();
const { body, query, check, param } = require("express-validator");
const Client = require("../models/client");
const client = require("../controllers/client");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const isAuth = require("../middleware/isAuth");

router.get(
  "/client",
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
  client.getAllClient
);

router.get(
  "/client/:clientId",
  isAuth,
  [
    param("clientId", "Please select at least a client")
      .trim()
      .isLength({ min: 1 }),
  ],
  client.getClientById
);

router.get(
  "/search/client",
  isAuth,
  [
    query("clientSearch", "Please enter at least of min 3 character")
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
  client.getSearchClient
);

router.post(
  "/client",
  isAuth,
  [
    body("name", "Please enter a name").trim().isLength({ min: 5 }),
    check("email")
      .isEmail()
      .withMessage("Please at least insert a correct email")
      .custom(async (value, { req }) => {
        try {
          const clientItem = await Client.findOne({ email: value });
          if (clientItem) {
            const error = new Error("This email is already take it");
            error.statusCode = 422;
            throw error;
          }
          return true;
        } catch (err) {
          err.statusCode = 500;
          throw err;
        }
      }),
  ],
  client.insertClient
);

router.put(
  "/client/:clientId",
  isAuth,
  [
    body("name", "Please enter a name").trim().isLength({ min: 5 }),
    check("email")
      .isEmail()
      .withMessage("Please at least insert a correct email"),
    param("clientId", "Please select at least a client")
      .trim()
      .isLength({ min: 1 }),
    check("clientId").custom(async (value, { req }) => {
      try {
        const clientItem = await Client.findOne({ _id: new ObjectId(value) });
        if (!clientItem) {
          const error = new Error("This client is already deleted");
          error.statusCode = 422;
          throw error;
        }
        return true;
      } catch (err) {
        err.statusCode = 500;
        throw err;
      }
    }),
  ],
  client.updateClient
);

router.delete(
  "/client/:clientId",
  isAuth,
  [
    check("clientId").custom(async (value, { req }) => {
      try {
        const clientItem = await Client.findOne({ _id: new ObjectId(value) });
        if (!clientItem) {
          const error = new Error("This client is already deleted");
          error.statusCode = 422;
          throw error;
        }
        return true;
      } catch (err) {
        err.statusCode = 500;
        throw err;
      }
    }),
  ],
  client.deleteClient
);

module.exports = router;
