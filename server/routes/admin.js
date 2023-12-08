const express = require("express");
const router = express.Router();

const { pool } = require("../../config/db_config");
const adminController = require("../controllers/adminController");
// const session = require("express-session");
// router.use(
//   session({
//     secret: "adminsecret",
//     resave: false,
//     saveUninitialized: false,
//   })
// );
router.get("/login", checkIsLoggedIn, (req, res) => {
  res.render("adminlogin", { title: "Admin Login " });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  // console.log(email);
  pool.query(`SELECT * FROM admin WHERE  email = ?`, [email], (err, rows) => {
    if (err) {
      throw err;
    }
    var row = JSON.parse(JSON.stringify(rows));
    // console.log(row);

    if (row.length > 0) {
      const admin = row[0];
      // console.log(admin.password);
      if (admin.password == password) {
        req.session.userId = admin.admin_id;
        res.redirect("/admin/dashboard");
      } else {
        res.render("adminlogin", { alert: "Incorrect Admin Password " });
      }
    } else {
      res.render("adminlogin", { alert: "Incorrect Admin Email " });
    }
  });
});

router.get("/logout", (req, res) => {
  if (req.session.userId) {
    delete req.session.userId;
    req.flash("success_msg", "You Have Been Logged Out");
    res.redirect("/admin/login");
  }
});

router.get("/dashboard", checkAuth, adminController.getDashboard);

router.get("/deletecars/:id", adminController.deleteCars);

router.get("/addcars", checkAuth, adminController.getAddCars);

router.post("/addcars", adminController.addCars);

router.get("/editcars/:id", checkAuth, adminController.getEditCars);

router.post("/editcars/:id", adminController.updateCars);

router.get(
  "/usertestdrivebookings",
  checkAuth,
  adminController.getUserTestDriveBookings
);

router.get("/userfeedbacks", checkAuth, adminController.getUserFeedbacks);

function checkAuth(req, res, next) {
  if (!req.session.userId) {
    res.redirect("/admin/login");
  } else {
    next();
  }
}

function checkIsLoggedIn(req, res, next) {
  if (req.session.userId) {
    res.redirect("/admin/dashboard");
  } else {
    next();
  }
}

module.exports = router;
