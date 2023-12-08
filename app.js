const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const path = require("path");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const fileUpload = require("express-fileupload");

require("dotenv").config();

const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const ehbs = exphbs.create({
  defaultLayout: "main",
  extname: ".hbs",
});

app.use("/asset", express.static(path.join(__dirname, "public/images")));
app.use(express.static("uploads"));

app.engine("hbs", ehbs.engine);
app.set("view engine", "hbs");

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(fileUpload());

app.get("/home", (req, res) => {
  res.render("index", { title: "Home " });
});

app.get("/aboutus", (req, res) => {
  res.render("aboutus", { title: "About Us " });
});

const userRoute = require("./server/routes/user");
app.use("/user", userRoute);

const adminRoute = require("./server/routes/admin");
app.use("/admin", adminRoute);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
