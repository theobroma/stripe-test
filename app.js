const dotenv = require('dotenv');
const envfile = process.env.NODE_ENV === 'production' ?
	'.env' :    // production
	'.dev.env'; // development
// load the contents of the env file into
// the `process.env` object.
dotenv.config({
  silent: true,
  path: `${__dirname}/${envfile}`,
});

const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;

const app = require("express")();
const stripe = require("stripe")(keySecret);

const bodyParser = require('body-parser');



app.set("view engine", "pug");
app.use(require("body-parser").urlencoded({extended: false}));
app.use(bodyParser.json());

app.get("/", (req, res) =>
  res.render("index.pug", {keyPublishable}));

app.post("/charge", (req, res) => {
  let amount = 500;
  
  stripe.customers.create({
    email: req.body.stripeEmail,
    card: req.body.stripeToken
  })
  .then(customer =>
    stripe.charges.create({
      amount,
      description: "Sample Charge",
      currency: "usd",
      customer: customer.id
    }))
  .catch(err => console.log("Error:", err))
  .then(charge => res.render("charge.pug"));
});

app.listen(4567);