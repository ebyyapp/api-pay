const express = require("express");
const router = express.Router();

const Ctrl = require("../../../controllers/stripe/customers.controllers");
const security = require("../../../middleware/security.middlewares");
const _database = require("../../../middleware/db.switch");

router.post(
  "/stripe/customer/new",
  security.accessAPI,
  _database.switch,
  security.accessUser("stripe.customer.create"),
  Ctrl.create
);

module.exports = router;
