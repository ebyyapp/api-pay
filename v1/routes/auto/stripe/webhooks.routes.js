const express = require("express");
const router = express.Router();

const Ctrl = require("../../../controllers/stripe/webhooks.controllers");
const security = require("../../../middleware/security.middlewares");
const _database = require("../../../middleware/db.switch");

router.post(
  "/stripe/subscription/webhooks",
  security.accessAPI,
  _database.switch,
  security.accessUser("stripe.subscription.webhooks"),
  Ctrl.subscription
);

router.post(
  "/stripe/customer/webhooks",
  security.accessAPI,
  _database.switch,
  security.accessUser("stripe.customer.webhooks"),
  Ctrl.customer
);

router.post(
  "/stripe/invoice/webhooks",
  security.accessAPI,
  _database.switch,
  security.accessUser("stripe.invoice.webhooks"),
  Ctrl.invoices
);

module.exports = router;
