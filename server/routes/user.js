const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const passport = require("passport");

const initializePassport = require("../../config/passportConfig");
initializePassport(passport);

router.get("/login", checkAuthenticated, userController.loginpage);

router.get("/register", checkAuthenticated, userController.registerpage);

router.post("/register", userController.userregister);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/user/dashboard",
    failureRedirect: "/user/login",
    failureFlash: true,
  })
);

router.get("/logout", (req, res) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success_msg", "You Have Been Logged Out");
    res.redirect("/user/login");
  });
});

router.get("/dashboard", checkNotAuthenticated, userController.getDashboard);

router.get(
  "/testdrive/:id",
  checkNotAuthenticated,
  userController.getTestdriveBooking
);

router.post("/testdrive/:id", userController.bookTestDrive);

router.get(
  "/testDriveBookings",
  checkNotAuthenticated,
  userController.viewTestDriveBookings
);

router.get(
  "/carFeedback/:id",
  checkNotAuthenticated,
  userController.getfeedback
);

router.post("/carFeedback/:id", userController.writefeedback);

router.get("/myFeedbacks", userController.viewFeedbacks);

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/user/dashboard");
  }
  next();
}
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/user/login");
}

module.exports = router;
