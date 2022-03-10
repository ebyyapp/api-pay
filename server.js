const express = require("express");
const http = require("http");
const app = express();
const databases = require("./v1/models");

require("dotenv").config();

// *@ Moment Js
moment = require("moment");
moment.locale("fr");

// *@ CORS
const cors = require("cors");
const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/public", express.static("public"));
app.use("/public/documents", express.static("public"));

Object.keys(databases).forEach((key) => {
  const db = databases[key];
  /* db.sequelize.sync({ alter: true }).then(() => {
    console.log("alter and re-sync db.");
  }); */
});

const routesFunctions = require("./functions/router.function");

//!------------- Routes

const Routes = routesFunctions.fromDir(`${__dirname}/v1/routes/auto`, ".js");

Routes.forEach((route) => {
  const call = require(route);
  app.use("/api/pay/v1", express.raw({ type: "application/json" }), call);
});
const security = require("./v1/middleware/security.middlewares");

app.get(
  "/",
  security.accessAPI,
  security.accessUser("test.test.test"),
  async (req, res) => {
    try {
      /* 

    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        number: "4242424242424242",
        exp_month: 2,
        exp_year: 2023,
        cvc: "314",
      },
    }); */
      const stripe = require("stripe")(
        "sk_test_51HYRhVBLIIADCj2UzGUpqw39Y6o07FnZll4z1isr2p34Ryrrfb5vfyoCAJ0ZsMgpaRj4tpBohggU91WfEvJwngDn00wPru7qkf"
      );
      const subscription = await stripe.subscriptions.retrieve(
        "sub_1KRYeEBLIIADCj2UNELnOhDt"
      );
      res.send(subscription);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }
);
app.post("/hooks", async (req, res) => {
  try {
    console.log(req.body);
    res.send(req.body);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

const server = http.createServer(app);

const PORT = process.env.PORT || 8084;
server.listen(PORT, () => {
  console.log("************* Le Serveur écoute sur le Port " + PORT);
});

module.exports = app;
