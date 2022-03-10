const express = require("express");
const router = express.Router();

const Ctrl = require("../../../controllers/stripe/subscription.controllers");
const security = require("../../../middleware/security.middlewares");
const admin = require("../../../middleware/stripe/admin.middleware");
const _database = require("../../../middleware/db.switch");

router.post(
  "/stripe/subscription/new",
  security.accessAPI,
  _database.switch,
  security.accessUser("stripe.subscription.create"),
  admin.accessPay(),
  Ctrl.create
);

module.exports = router;
