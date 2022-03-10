const express = require("express");
const router = express.Router();

const Ctrl = require("../../../controllers/stripe/admin.controllers");
const security = require("../../../middleware/security.middlewares");
const _database = require("../../../middleware/db.switch");

router.post(
  "/stripe/admin/new",
  security.accessAPI,
  _database.switch,
  security.accessUser("stripe.admin.create"),
  Ctrl.create
);

module.exports = router;
